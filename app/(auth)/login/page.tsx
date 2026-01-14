"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { Button } from "../../components/ui/Button";
import Input from "../../components/ui/Input";
import { signInSchema, TsignInSchema } from "../../types/auth/Login";

const Login = () => {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<TsignInSchema>({ resolver: zodResolver(signInSchema) });

  const onSubmit = (data: TsignInSchema) => {
    console.log(data);
    reset();
  };
  return (
    <div className="w-full flex items-start justify-start max-w-125 mx-auto">
      <div className="space-y-2 w-full">
        <h3 className="text-[32px] text-white font-semibold">
          Welcome back! 😎
        </h3>
        <p className="text-[18px] text-[#F1F1F1]">
          Login with your credentials to continue.
        </p>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="w-full pt-12 space-y-8"
        >
          <div className="flex flex-col gap-y-1">
            <Input
              id="email"
              type="email"
              {...register("email")}
              label="Email Address"
              autoComplete="off"
              placeholder="Enter email address"
            />
            {errors.email && (
              <span className="text-red-400 text-sm">
                {errors.email.message}
              </span>
            )}
          </div>

          <div>
            <div className="flex flex-col gap-y-1">
              <Input
                label="Password"
                id="password"
                {...register("password")}
                placeholder="Enter Password"
                type="password"
                password
                autoComplete="true"
              />
              {errors.password && (
                <span className="text-red-400 text-sm">{`${errors.password.message}`}</span>
              )}{" "}
            </div>

            <p className="flex cursor-pointer hover:text-[#b3b5f5] hover:underline hover:transition-all duration-300 items-end w-full justify-end pt-4.5 font-medium text-[#a5a6f2] text-sm outline-none focus:outline-none">
              Forgot password?
            </p>
          </div>

          <div className="space-y-3">
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-[#7269E3] text-white"
            >
              Sign in
            </Button>

            <div className="flex items-center space-x-2 justify-center">
              {" "}
              <span className="text-[#64748B]">
                Don&apos;t have an account?{" "}
              </span>{" "}
              <Link
                href={"/signup"}
                className="text-[#a5a6f2]  hover:text-[#b3b5f5] hover:underline hover:transition-all duration-300 cursor-pointer font-medium focus:outline-none outline-none"
              >
                Create an account
              </Link>{" "}
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
