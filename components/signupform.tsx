"use client";

import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { signIn } from "@/auth";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";

import { SignUpSchema } from "@/zod/schema";

import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";

import { SignUp } from "@/actions/register";
import { useToast } from "@/hooks/use-toast";
import { DEFAULT_LOGIN_REDIRECT } from "@/routes";
import { useState } from "react";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import SocialLogin from "./socialLogin";

const SignUpForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();

  const LoginViaProvider = async (provider: string) => {
    await signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT });
  };
  const form = useForm<z.infer<typeof SignUpSchema>>({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
    },
  });
  const { toast } = useToast();
  const onSubmit = async (values: z.infer<typeof SignUpSchema>) => {
    const response = await SignUp(values);

    if (response.success) {
      setSuccess(response.success);
    } else {
      setError(response.error);
    }
  };
  return (
    <div className="flex flex-col w-full">
      <div className="w-full">
      <SocialLogin/>
      </div>
      

      <div className="flex items-center justify-center my-4 w-full" >
        <div className="w-full border-t border-gray-300"></div>
        <span className="px-2 text-gray-500 text-[10px]  whitespace-nowrap">
          Continue with
        </span>
        <div className="w-full border-t border-gray-300"></div>
      </div>

      <div>
        <div className="mt-4">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
              <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] p-0 m-0">Name</FormLabel>
                    <FormControl>
                      <Input
                        className="placeholder:text-[10px] border-none bg-[#f2f4f7]"
                        placeholder="john"
                        {...field}
                        type="text"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] p-0 m-0">Email</FormLabel>
                    <FormControl>
                      <Input
                        size={5}
                        className="placeholder:text-[10px] border-none bg-[#f2f4f7]"
                        placeholder="email@xyz.com"
                        {...field}
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-[12px] p-0 m-0 border-none">
                      Password
                    </FormLabel>
                    <FormControl>
                      <Input
                      className="border-none bg-[#f2f4f7]" 
                        placeholder="********"
                        {...field}
                        type="password"
                      />
                    </FormControl>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit" className="w-full mt-3  hover:bg-green-400 hover:text-white">
                Sign Up
              </Button>
            </form>
          </Form>
          <div className="mt-2">
          <FormSuccess message={success} />
          <FormError message={error} />
          </div>
        
        </div>
      </div>

      <div>
        <Link
          className="text-[12px] text-slate-500 font-[400] underline text-center flex items-center justify-center mt-3 "
          href="/auth/signin"
        >
          Already have a account?
        </Link>
      </div>
    </div>
  );
};

export default SignUpForm;
