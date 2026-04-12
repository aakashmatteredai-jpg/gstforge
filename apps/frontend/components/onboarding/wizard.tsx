"use client";

import { useState } from "react";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter, Input, Label, Button } from "@gstforge/ui";
import { BusinessDetailsSchema, BusinessDetails } from "@gstforge/types";
import { useStore } from "../../hooks/use-store";
import { toast } from "sonner";
import { CheckCircle2 } from "lucide-react";

export function OnboardingWizard() {
  const [step, setStep] = useState(1);
  const { setBusinessDetails } = useStore();
  const [details, setDetails] = useState<Partial<BusinessDetails>>({
    name: "",
    gstin: "",
    state: "",
    address: "",
    pan: "",
  });

  const nextStep = () => setStep((s) => s + 1);
  const prevStep = () => setStep((s) => s - 1);

  const handleComplete = () => {
    try {
      const validated = BusinessDetailsSchema.parse(details);
      setBusinessDetails(validated);
      toast.success("Business profile completed!");
      // Redirect or update store
    } catch (err: any) {
      toast.error(err.errors?.[0]?.message || "Invalid details");
    }
  };

  return (
    <div className="max-w-2xl mx-auto py-10">
      <Card className="border-2 border-indigo-100 shadow-xl">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 1 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>1</div>
            <div className="w-12 h-px bg-slate-200 my-auto mx-2" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 2 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>2</div>
            <div className="w-12 h-px bg-slate-200 my-auto mx-2" />
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${step >= 3 ? 'bg-indigo-600 text-white' : 'bg-slate-200'}`}>3</div>
          </div>
          <CardTitle className="text-3xl font-bold">Welcome to GSTForge</CardTitle>
          <CardDescription>Let's get your business profile ready in 3 simple steps.</CardDescription>
        </CardHeader>

        <CardContent className="min-h-[300px]">
          {step === 1 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-semibold">Basic Information</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>Business Registered Name</Label>
                  <Input 
                    placeholder="e.g. Acme Solutions" 
                    value={details.name} 
                    onChange={(e) => setDetails({...details, name: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>GSTIN</Label>
                  <Input 
                    placeholder="15-digit GST Number" 
                    value={details.gstin} 
                    onChange={(e) => setDetails({...details, gstin: e.target.value.toUpperCase()})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4 animate-in fade-in slide-in-from-right-4">
              <h3 className="text-xl font-semibold">Tax & Address</h3>
              <div className="grid gap-4">
                <div className="space-y-2">
                  <Label>PAN Number</Label>
                  <Input 
                    placeholder="ABCDE1234F" 
                    value={details.pan} 
                    onChange={(e) => setDetails({...details, pan: e.target.value.toUpperCase()})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>State</Label>
                  <Input 
                    placeholder="e.g. Maharashtra" 
                    value={details.state} 
                    onChange={(e) => setDetails({...details, state: e.target.value})}
                  />
                </div>
                <div className="space-y-2">
                  <Label>Full Address</Label>
                  <Input 
                    placeholder="Factory/Office Address" 
                    value={details.address} 
                    onChange={(e) => setDetails({...details, address: e.target.value})}
                  />
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4 text-center py-10 animate-in fade-in slide-in-from-right-4">
              <CheckCircle2 className="w-16 h-16 text-green-500 mx-auto" />
              <h3 className="text-2xl font-bold">All Set!</h3>
              <p className="text-gray-500">Your profile is ready. You can now start creating invoices.</p>
              <div className="bg-indigo-50 p-4 rounded-lg text-left inline-block">
                <p><strong>Business:</strong> {details.name}</p>
                <p><strong>GSTIN:</strong> {details.gstin}</p>
                <p><strong>State:</strong> {details.state}</p>
              </div>
            </div>
          )}
        </CardContent>

        <CardFooter className="flex justify-between border-t pt-6 mt-6">
          {step > 1 && step < 4 && (
            <Button variant="outline" onClick={prevStep}>Back</Button>
          )}
          <div className="ml-auto" />
          {step < 3 ? (
            <Button onClick={nextStep} className="bg-indigo-600 hover:bg-indigo-700">Continue</Button>
          ) : (
            <Button onClick={handleComplete} className="bg-green-600 hover:bg-green-700">Finish Onboarding</Button>
          )}
        </CardFooter>
      </Card>
    </div>
  );
}
