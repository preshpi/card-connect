"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { signupSchema, TsignupSchema } from "../../types/auth/Signup";
import Input from "../../components/ui/Input";
import { Button } from "../../components/ui/Button";
import Image from "next/image";

const SignUp = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TsignupSchema>({ resolver: zodResolver(signupSchema) });

  const [step, setStep] = useState<number>(1);

  const onSubmit = (data: TsignupSchema) => {
    console.log(data);
    reset();
  };
  return (
    <div className="w-full flex items-start justify-start">
      {step !== 1 && (
        <button
          onClick={() => setStep((prevStep) => prevStep - 1)}
          className="absolute left-75 py-2"
        >
          <Image
            src={"/icons/arrow-left.svg"}
            alt="back arrow"
            width={24}
            height={24}
          />
        </button>
      )}

      <div className="space-y-2 w-full max-w-125 mx-auto">
        <h3 className="text-[32px] text-white font-semibold">
          New here? Join us. 🚀
        </h3>

        <p className="text-[18px] text-[#F1F1F1]">
          We just need a few details from you to set up your account securely.{" "}
        </p>

        <form className="w-full pt-7 space-y-8">
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-y-2">
                <Input
                  id="firstname"
                  label="First Name"
                  {...register("firstname")}
                  type="text"
                  autoComplete="off"
                  placeholder="Enter first name"
                />
                {errors.firstname && (
                  <span className="text-red-500">{`${errors.firstname.message}`}</span>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Input
                  id="lastname"
                  type="text"
                  {...register("lastname")}
                  label="Last Name"
                  autoComplete="off"
                  placeholder="Enter last name"
                />
                {errors.lastname && (
                  <span className="text-red-500">{`${errors.lastname.message}`}</span>
                )}
              </div>

              <div className="space-y-3 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setStep(2)}
                  className="bg-[#7269E3] text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-y-2">
                <Input
                  id="email"
                  type="email"
                  {...register("email")}
                  label="Email Address"
                  autoComplete="off"
                  placeholder="Enter email address"
                />{" "}
                {errors.email && (
                  <span className="text-red-500">{`${errors.email.message}`}</span>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Input
                  id="phone"
                  type="number"
                  {...register("phone")}
                  label="Phone Number"
                  autoComplete="off"
                  placeholder="Enter phone number"
                />
                {errors.phone && (
                  <span className="text-red-500">{`${errors.phone.message}`}</span>
                )}
              </div>
              <div className="space-y-3 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={() => setStep(3)}
                  className="bg-[#7269E3] text-white"
                >
                  Next
                </Button>
              </div>
            </div>
          )}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex flex-col gap-y-2">
                <Input
                  id="password"
                  type="password"
                  label="Password"
                  {...register("password")}
                  password
                  autoComplete="off"
                  placeholder="Enter password"
                />
                {errors.password && (
                  <span className="text-red-500">{`${errors.password.message}`}</span>
                )}
              </div>
              <div className="flex flex-col gap-y-2">
                <Input
                  id="confirmPassword"
                  type="password"
                  {...register("confirmPassword")}
                  password
                  label="Confirm Password"
                  autoComplete="off"
                  placeholder="Confirm your Password"
                />
                {errors.confirmPassword && (
                  <span className="text-red-500">{`${errors.confirmPassword.message}`}</span>
                )}
              </div>
              <div className="space-y-3 pt-6">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  onClick={handleSubmit(onSubmit)}
                  className="bg-[#7269E3] text-white"
                >
                  Register
                </Button>
              </div>
            </div>
          )}
          <div className="flex items-center space-x-2 justify-center">
            {" "}
            <span className="text-[#64748B]">
              Already have an account?{" "}
            </span>{" "}
            <Link
              href={"/login"}
              className="text-[#a5a6f2]  hover:text-[#b3b5f5] hover:underline hover:transition-all duration-300 cursor-pointer font-medium focus:outline-none outline-none"
            >
              Login
            </Link>{" "}
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignUp;
