"use client";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema } from "@/zod/schema";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { useState } from "react";
import { generateVerificationToken } from "@/lib/token";
import { sendVerificationToken } from "@/lib/mail";
import bcrypt from "bcryptjs";
import { resetPasswordAction } from "@/actions/resetPasswordAction";


const ResetPasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const router = useRouter();
  const form = useForm<z.infer<typeof resetPasswordSchema>>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof resetPasswordSchema>) => {
    const response = await resetPasswordAction(values);

    if(response?.error){
        setError(response.error)
    }
    if(response?.success){
        setSuccess(response.success);
       
    }
  };

  return (
    <div>
      <div>
        <div className="">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input 
                        className="placeholder:text-[10px]"
                        placeholder="jhondoe@gmail.com"
                        {...field}
                        type="email"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full  ">
                Change Password
              </Button>
            </form>
          </Form>
          <div className="mt-2">
            <FormSuccess message={success} />
            <FormError message={error} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
