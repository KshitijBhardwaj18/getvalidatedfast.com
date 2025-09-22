"use client";

import { useSearchParams } from "next/navigation";
import CardWrapper from "./cardwrapper";
import { useCallback, useEffect, useState } from "react";
import { VerifyEmail } from "@/actions/new-verifiation";
import FormError from "./form-error";
import FormSuccess from "./form-success";
import { BeatLoader } from "react-spinners";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";
const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>();
  const [success, setSuccess] = useState<string | undefined>();
  
  const router = useRouter();

  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  console.log("hello")

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("MissingToken");
      return;
    }
    VerifyEmail(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch((err) => {
        console.log(err);
        setError("Something went wrong");
      });
  }, [token]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <CardWrapper>
      <div className="flex flex-col justify-center items-center">
        {!success && !error && <BeatLoader />}
        <FormError message={error} />
        <FormSuccess message={success} />
        <Button className="mt-5" onClick={() => router.push("/auth/signin")}>
            back to login
        </Button>
      </div>
    </CardWrapper>
  );
};

export default NewVerificationForm;
