"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./cardwrapper";
import { useCallback, useEffect, useState } from "react";
import { VerifyEmail } from "@/actions/new-verifiation";
import { UpdatePassword } from "@/actions/newPassword";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { BeatLoader } from "react-spinners";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { Input } from "./ui/input";
import { newPasswordSchema, resetPasswordSchema } from "@/zod/schema";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";

const NewPasswordForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [isValidToken, setValidToken] = useState<boolean | undefined>(false);

  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  console.log(token);
  if (!token) {
    return "Invalid credentials";
  }
  const form = useForm<z.infer<typeof newPasswordSchema>>({
    resolver: zodResolver(newPasswordSchema),
    defaultValues: {
      password: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof newPasswordSchema>) => {
    const response = await UpdatePassword(values, token);

    if (response.success) {
      setSuccess(response.success);
      router.push("/auth/signin");
    }

    if (response.error) {
      setError(response.error);
    }
  };

  return (
    <CardWrapper>
      <div className="flex flex-col justify-center items-center">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New Password</FormLabel>
                  <FormControl>
                    <Input
                      className="placeholder:text-[10px]"
                      placeholder="********"
                      {...field}
                      type="password"
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
    </CardWrapper>
  );
};

export default NewPasswordForm;
