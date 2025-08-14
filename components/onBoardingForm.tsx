"use client";

import React, { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/card";
import { Button } from "./ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Input } from "./ui/input";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { createWorkspaceAndProject } from "@/actions/createOnboarding";
import { useRouter } from "next/navigation";

const stepOneSchema = z.object({
  teamName: z
    .string()
    .min(1, "Team name is required")
    .max(50, "Max 50 characters"),
});

const stepTwoSchema = z.object({
  projectName: z
    .string()
    .min(1, "Project name is required")
    .max(50, "Max 50 characters"),
});

const OnBoardingForm: React.FC = () => {
  const [step, setStep] = useState<number>(1);
  const totalSteps = 2;

  const formStepOne = useForm<z.infer<typeof stepOneSchema>>({
    resolver: zodResolver(stepOneSchema),
    defaultValues: { teamName: "" },
  });

  const formStepTwo = useForm<z.infer<typeof stepTwoSchema>>({
    resolver: zodResolver(stepTwoSchema),
    defaultValues: { projectName: "" },
  });

  const progressPercent = useMemo(() => Math.round((step / totalSteps) * 100), [step]);
  const router = useRouter();

  const onSubmit = async (data: z.infer<typeof stepTwoSchema>) => {
    const teamName = formStepOne.getValues("teamName");
    const res = await createWorkspaceAndProject({ teamName, projectName: data.projectName });
    if (res.success) {
      router.push("/dashboard");
    } else {
      alert(res.error);
    }
  };

  return (
    <div className="w-full max-w-xl">
      {/* Header */}
      <div className="text-center mb-6">
        <h1 className="text-3xl font-bold ">Welcome to GetValidatedFast! 🎉</h1>
        <p className="text-slate-500 text-sm">Let's set up your workspace to start collecting feedback</p>
      </div>

      {/* Progress */}
      <div className="mb-4">
        <div className="flex items-center justify-between text-[12px] text-slate-500 mb-2">
          <span>Step {step} of {totalSteps}</span>
          <span>{progressPercent}% complete</span>
        </div>
        <div className="h-2 w-full rounded-full bg-slate-200">
          <div
            className="h-2 rounded-full bg-green-400 transition-all"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Card */}
      <Card className="shadow-lg hover:shadow-xl transition-shadow duration-300 border-none min-w-xl space-y-5 mt-8">
        <CardHeader className="pb-2">
          <CardTitle className="text-center">{step === 1 ? "Create Your Team" : "Create Your First Project"}</CardTitle>
          <CardDescription className="text-center">
            {step === 1
              ? "Set up your team workspace to collaborate and organize projects."
              : "Projects help you organize and track feedback from your users."}
          </CardDescription>
        </CardHeader>

        <CardContent>
          {step === 1 && (
            <Form {...formStepOne}>
              <form onSubmit={formStepOne.handleSubmit(() => setStep(2))} className="space-y-2">
                <FormField
                  control={formStepOne.control}
                  name="teamName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] p-0 m-0">Team Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., bhardwajjtechnologies's Team"
                          className="placeholder:text-[10px] border-none bg-[#f2f4f7]"
                          maxLength={50}
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      {field.value && (
                        <p className="text-emerald-600 text-[12px] mt-1">✓ Looks good!</p>
                      )}
                      <p className="text-slate-500 text-[10px] mt-1">{field.value?.length || 0}/50 characters</p>
                    </FormItem>
                  )}
                />

                <div className="flex gap-3 pt-3">
                  <Button type="button" variant="outline" className="flex-1" disabled>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-500 hover:bg-green-600 text-white">
                    Continue
                  </Button>
                </div>
              </form>
            </Form>
          )}

          {step === 2 && (
            <Form {...formStepTwo}>
              <form onSubmit={formStepTwo.handleSubmit(onSubmit)} className="space-y-2">
                <FormField
                  control={formStepTwo.control}
                  name="projectName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-[12px] p-0 m-0">Project Name *</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="e.g., Main Website Feedback"
                          className="placeholder:text-[10px] border-none bg-[#f2f4f7]"
                          maxLength={50}    
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                      <p className="text-slate-500 text-[10px] mt-1">{field.value?.length || 0}/50 characters</p>
                    </FormItem>
                  )}
                />

                <div className="rounded-md bg-purple-50 text-purple-700 text-[12px] p-3">
                  💡 Tip: Choose a descriptive name like "Website Feedback" or "Mobile App Reviews" to easily identify this project later.
                </div>

                <div className="flex gap-3 pt-3">
                  <Button type="button" variant="outline" className="flex-1" onClick={() => setStep(1)}>
                    Back
                  </Button>
                  <Button type="submit" className="flex-1 bg-green-400 hover:bg-green-600 text-white" disabled={!formStepTwo.watch("projectName").trim()}>
                    Create Project
                  </Button>
                </div>
              </form>
            </Form>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default OnBoardingForm;