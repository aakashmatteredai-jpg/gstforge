import { existsSync, readFileSync } from "node:fs";
import { dirname, join, parse } from "node:path";
import { PrismaClient } from "@prisma/client";

function hydrateEnvFromWorkspaceRoot() {
  if (process.env.DATABASE_URL) {
    return;
  }

  let currentDir = process.cwd();
  const { root } = parse(currentDir);

  while (true) {
    const envPath = join(currentDir, ".env");

    if (existsSync(envPath)) {
      const contents = readFileSync(envPath, "utf8");

      for (const line of contents.split(/\r?\n/)) {
        const trimmed = line.trim();

        if (!trimmed || trimmed.startsWith("#")) {
          continue;
        }

        const separatorIndex = trimmed.indexOf("=");

        if (separatorIndex === -1) {
          continue;
        }

        const key = trimmed.slice(0, separatorIndex).trim();
        const rawValue = trimmed.slice(separatorIndex + 1).trim();
        const value = rawValue.replace(/^['"]|['"]$/g, "");

        if (key && process.env[key] === undefined) {
          process.env[key] = value;
        }
      }

      return;
    }

    if (currentDir === root) {
      return;
    }

    currentDir = dirname(currentDir);
  }
}

hydrateEnvFromWorkspaceRoot();

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma = globalForPrisma.prisma ?? new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export * from "@prisma/client";
