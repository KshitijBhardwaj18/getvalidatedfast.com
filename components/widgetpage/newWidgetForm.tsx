"use client";

import { useState, useMemo } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FormProvider, useFieldArray } from "react-hook-form";
import { Button } from "../ui/button";
import { Card } from "../ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  FunctionalitySchema,
  type FunctionalityValues,
  getContentSchema,
  behaviourSchema,
} from "@/types/widgetform";
import { Bug, MessageSquare, Star } from "lucide-react";

type ContentSchemaType = ReturnType<typeof getContentSchema>;
type ContentValues = z.infer<ContentSchemaType>;

const steps = ["Functionality", "Content", "Behavior"] as const;

const WizardStepper = ({ step }: { step: number }) => {
  return (
    <div className="flex items-center gap-8">
      {steps.map((s, i) => (
        <div
          className="flex flex-col gap-2 items-center justify-center"
          key={i + s}
        >
          <div
            aria-current={i === step ? "step" : undefined}
            className={`size-8 rounded-full flex items-center justify-center text-sm ${
              i <= step
                ? "bg-green-500 text-white"
                : "bg-neutral-200 text-neutral-600"
            }`}
          >
            {i + 1}
          </div>
          <p
            className={`flex items-center justify-center text-[0.8rem] ${
              i <= step ? " text-green-500" : "text-neutral-500"
            }`}
          >
            {s}
          </p>
        </div>
      ))}
    </div>
  );
};

const UrlsInput = ({
  value,
  onChange,
  placeholder,
}: {
  value: string[];
  onChange: (next: string[]) => void;
  placeholder?: string;
}) => {
  return (
    <Input
      placeholder={placeholder}
      value={value.join(", ")}
      onChange={(e) => {
        const parts = e.target.value
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean);
        onChange(parts);
      }}
    />
  );
};

export default function NewWidgetForm() {
  const [step, setStep] = useState(0);

  const functionalityForm = useForm<FunctionalityValues>({
    resolver: zodResolver(FunctionalitySchema),
    defaultValues: {
      name: "",
      isReviewsEnabled: false,
      isBugReportingEnabled: false,
      isFeatureSuggestionEnabled: false,
      surveyEnabled: false,
      surveyOptions: { primaryFeedbackType: "NPS" } as any,
    } as any,
    mode: "onChange",
  });

  const surveyEnabled = functionalityForm.watch("surveyEnabled");
  const primaryType = functionalityForm.watch(
    "surveyOptions.primaryFeedbackType" as any
  ) as undefined | "NPS" | "CSAT" | "CUSTOM" | "TESTIMONIALS";

  const ContentSchema = useMemo(
    () =>
      getContentSchema({
        surveyEnabled: !!surveyEnabled,
        primaryFeedbackType: surveyEnabled ? primaryType : undefined,
      }),
    [surveyEnabled, primaryType]
  );

  // Use any for dynamic schema branches to satisfy RHF's Control generic
  const contentForm = useForm<any>({
    resolver: zodResolver(ContentSchema),
    defaultValues: {
      HeaderTitle: "",
      ThanksTitle: "",
      ThanksMessage: "",
      // @ts-ignore dynamic fields
      question: "",
      // @ts-ignore
      questions: [],
      // @ts-ignore
      submitText: "",
    },
    mode: "onChange",
  });

  const { fields, append, remove } = useFieldArray({
    control: contentForm.control as any,
    name: "questions" as any,
  });

  const behaviorForm = useForm<z.infer<typeof behaviourSchema>>({
    resolver: zodResolver(behaviourSchema),
    defaultValues: {
      triggerType: "showImmediately",
      includeUrls: [],
      excludeUrls: [],
      devices: { desktop: true, mobile: true, tablet: true },
    },
  });

  const nextFromStep1 = functionalityForm.handleSubmit(() => setStep(1));
  const nextFromStep2 = contentForm.handleSubmit(() => setStep(2));
  const back = () => setStep((s) => Math.max(0, s - 1));

  const onCreate = behaviorForm.handleSubmit(async (behaviorValues) => {
    const functionalityValues = functionalityForm.getValues();
    const contentValues = contentForm.getValues();
    const payload = {
      functionality: functionalityValues,
      content: contentValues,
      behavior: behaviorValues,
    };
    console.log("CREATE_WIDGET", payload);
  });

  return (
    <div className="space-y-8 flex items-center justify-center flex-col mt-3 px-15">
      <WizardStepper step={step} />
      <Card className="border border-neutral-300 p-10 shadow-lg w-full  ">
        {step === 0 && (
          <FormProvider {...functionalityForm}>
            <Form {...functionalityForm}>
              <form className="space-y-6">
                <div>
                  <h1 className="font-[900] text-xl">
                    Step 1: Functionality & Basics
                  </h1>
                  <p className="text-neutral-600 text-sm">
                    Choose what your widget will do and give it a name.
                  </p>
                </div>

                <FormField
                  control={functionalityForm.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex flex-col justify-center items-start">
                        <div>
                          <p className="font-bold"> Widget Name (Internal) </p>
                          <p className="text-neutral-600 text-sm mt-3">
                            A name helps you to identify the widget. (Not shown
                            to the users)
                          </p>
                        </div>
                      </FormLabel>

                      <FormControl>
                        <Input
                          placeholder="Main Feedback Widget"
                          {...field}
                          className="border-neutral-400 focus:border-0"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <h2 className="font-bold text-sm">Widget Modules</h2>

                <FormItem className="flex items-center justify-between rounded-lg border border-neutral-300 p-4">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>
                      <MessageSquare />
                    </div>
                    <div className="flex gap-2 flex-col">
                      <FormLabel className="font-bold">
                        Collect Feedback / Surveys
                      </FormLabel>
                      <FormDescription>
                        Gather general feedback and run custom surveys.
                      </FormDescription>
                    </div>
                  </div>
                  <FormField
                    control={functionalityForm.control}
                    name="surveyEnabled"
                    render={({ field }) => (
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          className="
    data-[state=checked]:bg-green-500 
    data-[state=unchecked]:bg-neutral-500
    before:bg-white before:shadow-md before:ring-1 before:ring-black/5
  "
                        />
                      </FormControl>
                    )}
                  />
                </FormItem>

                {surveyEnabled && (
                  <div className="flex flex-row gap-6 pl-5">
                    <div className="bg-neutral-300 border-neutral-300 w-[0.8px] h-[100px]" />

                    <FormField
                      control={functionalityForm.control}
                      name={"surveyOptions.primaryFeedbackType" as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>
                            <div className="flex flex-col gap-2">
                              <h3 className="font-semibold">Primary Feedback Type</h3>
                              <p className="text-neutral-500">Choose the main survey type and flow</p>
                            </div>
                          </FormLabel>
                          <FormControl>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select type" />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="NPS">NPS Survey</SelectItem>
                                <SelectItem value="CSAT">
                                  CSAT Survey
                                </SelectItem>
                                <SelectItem value="CUSTOM">Custom</SelectItem>
                                <SelectItem value="TESTIMONIALS">
                                  Testimonial / Review Form
                                </SelectItem>
                              </SelectContent>
                            </Select>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}

                <FormItem className="flex items-center justify-between rounded-lg border border-neutral-300 p-4">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>
                      <Star />
                    </div>
                    <div className="flex gap-2 flex-col">
                      <FormLabel className="font-bold">Reviews</FormLabel>
                      <FormDescription>
                        Collect Product or Service reviews
                      </FormDescription>
                    </div>
                  </div>
                  <FormField
                    control={functionalityForm.control}
                    name="isReviewsEnabled"
                    render={({ field }) => (
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-neutral-500 before:bg-white before:shadow-md before:ring-1 before:ring-black/5"
                        />
                      </FormControl>
                    )}
                  />
                </FormItem>

                <FormItem className="flex items-center justify-between rounded-lg border border-neutral-300 p-4">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>
                      <Bug />
                    </div>
                    <div className="flex gap-2 flex-col">
                      <FormLabel className="font-bold">Bug Reporting</FormLabel>
                      <FormDescription>
                        Allow users to report bugs with screenshot and system
                        info
                      </FormDescription>
                    </div>
                  </div>
                  <FormField
                    control={functionalityForm.control}
                    name="isBugReportingEnabled"
                    render={({ field }) => (
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-neutral-500 before:bg-white before:shadow-md before:ring-1 before:ring-black/5"
                        />
                      </FormControl>
                    )}
                  />
                </FormItem>

                <FormItem className="flex items-center justify-between rounded-lg border border-neutral-300 p-4">
                  <div className="flex flex-row gap-2 items-center justify-center">
                    <div>
                      <Bug />
                    </div>
                    <div className="flex gap-2 flex-col">
                      <FormLabel className="font-bold">
                        Feature Suggestion
                      </FormLabel>
                      <FormDescription>
                        Allow users to suggest features or upvote existing
                        requests
                      </FormDescription>
                    </div>
                  </div>
                  <FormField
                    control={functionalityForm.control}
                    name="isFeatureSuggestionEnabled"
                    render={({ field }) => (
                      <FormControl>
                        <Switch
                          checked={field.value as boolean}
                          onCheckedChange={field.onChange}
                          className="data-[state=checked]:bg-green-500 data-[state=unchecked]:bg-neutral-500 before:bg-white before:shadow-md before:ring-1 before:ring-black/5"
                        />
                      </FormControl>
                    )}
                  />
                </FormItem>

                <div className="flex justify-end gap-2">
                  <Button type="button" onClick={nextFromStep1}>
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        )}

        {step === 1 && (
          <FormProvider {...contentForm}>
            <Form {...contentForm}>
              <form className="space-y-6">
                <FormField
                  control={contentForm.control}
                  name={"HeaderTitle" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Widget Header Title</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="How can we help you today?"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {surveyEnabled &&
                  (primaryType === "NPS" || primaryType === "CSAT") && (
                    <>
                      <FormField
                        control={contentForm.control}
                        name={"question" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Question</FormLabel>
                            <FormControl>
                              <Input
                                placeholder="How satisfied are you?"
                                {...field}
                              />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={contentForm.control}
                        name={"submitText" as any}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Submit Button Text</FormLabel>
                            <FormControl>
                              <Input placeholder="Submit" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </>
                  )}

                {surveyEnabled && primaryType === "CUSTOM" && (
                  <>
                    <div className="space-y-3">
                      <FormLabel>Custom Survey Questions</FormLabel>
                      {fields.map((f, i) => (
                        <FormField
                          key={f.id}
                          control={contentForm.control}
                          name={`questions.${i}` as any}
                          render={({ field }) => (
                            <FormItem>
                              <FormControl>
                                <Input
                                  placeholder={`Question ${i + 1}`}
                                  {...field}
                                />
                              </FormControl>
                              <div className="flex justify-end">
                                <Button
                                  type="button"
                                  variant="outline"
                                  onClick={() => remove(i)}
                                >
                                  Remove
                                </Button>
                              </div>
                              <FormMessage />
                            </FormItem>
                          )}
                        />
                      ))}
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => append("")}
                      >
                        Add Question
                      </Button>
                    </div>
                    <FormField
                      control={contentForm.control}
                      name={"submitText" as any}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Submit Button Text</FormLabel>
                          <FormControl>
                            <Input placeholder="Submit" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </>
                )}

                {surveyEnabled && primaryType === "TESTIMONIALS" && (
                  <FormField
                    control={contentForm.control}
                    name={"submitText" as any}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Submit Button Text</FormLabel>
                        <FormControl>
                          <Input placeholder="Send" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={contentForm.control}
                  name={"ThanksTitle" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thank You Title</FormLabel>
                      <FormControl>
                        <Input placeholder="Thank you!" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contentForm.control}
                  name={"ThanksMessage" as any}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Thank You Message</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="We appreciate your feedback."
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button type="button" onClick={nextFromStep2}>
                    Next
                  </Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        )}

        {step === 1 && (
          <FormItem className="flex items-center justify-between rounded-lg border border-neutral-300 p-4">
            <div className="flex flex-row gap-2 items-center justify-center">
              <div>
                <MessageSquare />
              </div>
              <div className="flex gap-2 flex-col">
                <FormLabel className="font-bold">
                  Collect Feedback / Surveys
                </FormLabel>
                <FormDescription>
                  Gather general feedback and run custom surveys.
                </FormDescription>
              </div>
            </div>
            <FormField
              control={functionalityForm.control}
              name="surveyEnabled"
              render={({ field }) => (
                <FormControl>
                  <Switch
                    checked={field.value as boolean}
                    onCheckedChange={field.onChange}
                    className="
    data-[state=checked]:bg-green-500 
    data-[state=unchecked]:bg-neutral-500
    before:bg-white before:shadow-md before:ring-1 before:ring-black/5
  "
                  />
                </FormControl>
              )}
            />
          </FormItem>
        )}

        {step === 2 && (
          <FormProvider {...behaviorForm}>
            <Form {...behaviorForm}>
              <form className="space-y-6" onSubmit={onCreate}>
                <FormField
                  control={behaviorForm.control}
                  name="triggerType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Trigger Type</FormLabel>
                      <FormControl>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Choose when to show the widget" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="showImmediately">
                              Show Immediately
                            </SelectItem>
                            <SelectItem value="afterDelay">
                              After Delay
                            </SelectItem>
                            <SelectItem value="onScroll">On Scroll</SelectItem>
                            <SelectItem value="exitIntent">
                              Exit Intent
                            </SelectItem>
                            <SelectItem value="manual">Manual</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={behaviorForm.control}
                    name="includeUrls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Show on Specific URLs</FormLabel>
                        <FormControl>
                          <UrlsInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="/docs/*, /pricing"
                          />
                        </FormControl>
                        <FormDescription>
                          Comma-separated patterns. Leave empty to show on all
                          pages.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={behaviorForm.control}
                    name="excludeUrls"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Exclude on Specific URLs</FormLabel>
                        <FormControl>
                          <UrlsInput
                            value={field.value}
                            onChange={field.onChange}
                            placeholder="/admin/*, /login"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <FormField
                    control={behaviorForm.control}
                    name="devices.desktop"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel>Desktop</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={behaviorForm.control}
                    name="devices.mobile"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel>Mobile</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={behaviorForm.control}
                    name="devices.tablet"
                    render={({ field }) => (
                      <FormItem className="flex items-center justify-between rounded-lg border p-4">
                        <FormLabel>Tablet</FormLabel>
                        <FormControl>
                          <Switch
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>

                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={back}>
                    Back
                  </Button>
                  <Button type="submit">Create Widget</Button>
                </div>
              </form>
            </Form>
          </FormProvider>
        )}
      </Card>
    </div>
  );
}
