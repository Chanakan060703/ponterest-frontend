"use client";

import React, { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { toast } from "sonner";
import { loginSchema, LoginInput } from "@/lib/validators";
import { login as loginApi } from "@/lib/api/auth";
import { useAuth } from "@/components/providers/AuthProvider";

const getErrorMessage = (error: unknown) => {
  if (axios.isAxiosError(error)) {
    const response = error.response?.data as
      | { error?: string; message?: string }
      | undefined;

    return response?.error ?? response?.message ?? error.message;
  }

  if (error instanceof Error) {
    return error.message;
  }

  return "An error occurred during login";
};

function LoginContent() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const { login } = useAuth();

  useEffect(() => {
    if (isRegistered) {
      toast.success("Account created successfully! Please sign in.");
    }
  }, [isRegistered]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginInput) => {
    setLoading(true);

    try {
      const result = await loginApi(data);

      if (result) {
        login(result.token, result.user);
        toast.success("Welcome back!");
        router.push("/");
      } else {
        toast.error("Invalid email or password");
      }
    } catch (error: unknown) {
      console.error(error);
      toast.error(getErrorMessage(error));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1f160f] mb-2">Welcome Back</h1>
        <p className="text-[#6d5b4b]">Sign in to continue to Ponterest</p>
      </div>

      {isRegistered && (
        <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-100 text-emerald-700 text-sm font-medium animate-in fade-in slide-in-from-top-4 duration-500">
          Account created successfully! Please sign in.
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        <div>
          <label className="block text-sm font-medium text-[#4a3f35] mb-1.5 ml-1">
            Email Address
          </label>
          <input
            type="email"
            {...register("email")}
            className={`w-full px-4 py-3 rounded-2xl bg-white/50 border ${errors.email ? 'border-rose-400 ring-4 ring-rose-50' : 'border-[#e8dfd5] focus:border-[#fb923c] focus:ring-4 focus:ring-orange-100'} outline-none transition-all duration-200`}
            placeholder="name@example.com"
          />
          {errors.email && <p className="mt-1.5 ml-1 text-xs font-medium text-rose-500">{errors.email.message}</p>}
        </div>

        <div>
          <div className="flex justify-between items-center mb-1.5 ml-1">
            <label className="block text-sm font-medium text-[#4a3f35]">
              Password
            </label>
            <a href="#" className="text-xs font-semibold text-[#fb923c] hover:underline">
              Forgot?
            </a>
          </div>
          <input
            type="password"
            {...register("password")}
            className={`w-full px-4 py-3 rounded-2xl bg-white/50 border ${errors.password ? 'border-rose-400 ring-4 ring-rose-50' : 'border-[#e8dfd5] focus:border-[#fb923c] focus:ring-4 focus:ring-orange-100'} outline-none transition-all duration-200`}
            placeholder="••••••••"
          />
          {errors.password && <p className="mt-1.5 ml-1 text-xs font-medium text-rose-500">{errors.password.message}</p>}
        </div>


        <button
          type="submit"
          disabled={loading}
          className="w-full py-4 bg-[#fb923c] hover:bg-[#f97316] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all duration-200 transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Signing in...
            </span>
          ) : (
            "Sign In"
          )}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-[#e8dfd5]/50">
        <p className="text-[#6d5b4b]">
          Don&apos;t have an account?{" "}
          <Link
            href="/register"
            className="text-[#fb923c] font-bold hover:underline transition-all"
          >
            Create account
          </Link>
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="p-8 md:p-10" />}>
      <LoginContent />
    </Suspense>
  );
}
