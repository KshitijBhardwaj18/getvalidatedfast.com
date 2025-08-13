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
import { useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { LoginSchema } from "@/zod/schema";
import { Login } from "@/actions/login";
import FormSuccess from "./form-success";
import FormError from "./form-error";
import { startTransition, useState } from "react";
import SocialLogin from "./socialLogin";

const SignInForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  const [token, setToken] = useState<boolean>(false);

  const searchParam = useSearchParams();
  const urlError =
    searchParam.get("error") === "OAuthAccountNotLinked"
      ? "Email already in use with other provider"
      : "";
  console.log(urlError);
  const form = useForm<z.infer<typeof LoginSchema>>({
    resolver: zodResolver(LoginSchema),
    defaultValues: {
      email: "",
      password: "",
      otp: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof LoginSchema>) => {
    setError("");
    setSuccess("");

    startTransition(() => {
      Login(values)
        .then((data) => {
          if (data?.error) {
            form.reset();
            setError(data.error);
          } else if (data?.success) {
            form.reset();
            setSuccess(data.success);
          } else if (data?.twoFactor) {
            form.reset();
            setToken(data.twoFactor);
          }
        })
        .catch(() => {
          setError("Something went wrong");
        });
    });
  };

  return (
    <div>
      {!token && (
        <>
          <SocialLogin />{" "}
          <div className="flex items-center justify-center my-4">
            <div className="w-full border-t border-gray-300"></div>
            <span className="px-2 text-gray-500 text-[10px]  whitespace-nowrap">
              Continue with
            </span>
            <div className="w-full border-t border-gray-300"></div>
          </div>{" "}
        </>
      )}

      <div>
        <div className="mt-4">
          <div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-2"
              >
                {!token && (
                  <>
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-[12px] p-0 m-0">Email</FormLabel>
                          <FormControl>
                            <Input
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
                          <FormLabel className="text-[12px] p-0 m-0">Password</FormLabel>
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
                    <Button asChild className="font-normal p-0" variant="link">
                      <Link href="/auth/reset">Forgot your password?</Link>
                    </Button>
                  </>
                )}

                {token && (
                  <FormField
                    control={form.control}
                    name="otp"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-[12px] p-0 m-0">2fa</FormLabel>
                        <FormControl>
                          <Input
                            className="border-none bg-[#f2f4f7]"
                            placeholder="Two Factor Code"
                            {...field}
                            type="string"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}

                <Button type="submit" className="w-full mt-3">
                  {!token ? <p> Login </p> : <p>Submit Code</p>}
                </Button>
              </form>
            </Form>
            <div className="mt-2">
              <FormSuccess message={success} />
              <FormError message={error || urlError} />
            </div>{" "}
          </div>
        </div>
      </div>

      <div>
        <Link
          className="text-[12px] text-slate-500 font-[400] underline text-center flex items-center justify-center mt-3 "
          href="/auth/signup"
        >
          Don&apos;t have a account?
        </Link>
      </div>
    </div>
  );
};

export default SignInForm;
