"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { registerSchema, RegisterInput } from "@/lib/validators";
import { register as registerApi } from "@/lib/api/auth";

export default function RegisterPage() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterInput) => {
    setLoading(true);

    try {
      const result = await registerApi(data);
      if (result) {
        toast.success("Account created successfully!");
        router.push("/login?registered=true");
      } else {
        toast.error("Registration failed. Please try again.");
      }
    } catch (err: any) {
      console.error(err);
      toast.error(err.response?.data?.error || err.response?.data?.message || err.message || "An error occurred during registration");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 md:p-10">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-[#1f160f] mb-2">Create Account</h1>
        <p className="text-[#6d5b4b]">Join the Ponterest community today</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-[#4a3f35] mb-1.5 ml-1">
            Full Name
          </label>
          <input
            type="text"
            {...register("name")}
            className={`w-full px-4 py-3 rounded-2xl bg-white/50 border ${errors.name ? 'border-rose-400 ring-4 ring-rose-50' : 'border-[#e8dfd5] focus:border-[#fb923c] focus:ring-4 focus:ring-orange-100'} outline-none transition-all duration-200`}
            placeholder="John Doe"
          />
          {errors.name && <p className="mt-1.5 ml-1 text-xs font-medium text-rose-500">{errors.name.message}</p>}
        </div>

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
          <label className="block text-sm font-medium text-[#4a3f35] mb-1.5 ml-1">
            Phone Number
          </label>
          <input
            type="tel"
            {...register("phone")}
            className={`w-full px-4 py-3 rounded-2xl bg-white/50 border ${errors.phone ? 'border-rose-400 ring-4 ring-rose-50' : 'border-[#e8dfd5] focus:border-[#fb923c] focus:ring-4 focus:ring-orange-100'} outline-none transition-all duration-200`}
            placeholder="081-234-5678"
          />
          {errors.phone && <p className="mt-1.5 ml-1 text-xs font-medium text-rose-500">{errors.phone.message}</p>}
        </div>

        <div>
          <label className="block text-sm font-medium text-[#4a3f35] mb-1.5 ml-1">
            Password
          </label>
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
          className="w-full py-4 bg-[#fb923c] hover:bg-[#f97316] text-white font-bold rounded-2xl shadow-lg shadow-orange-200 transition-all duration-200 transform active:scale-[0.98] mt-6 group disabled:opacity-70"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating account...
            </span>
          ) : (
            "Create Account"
          )}
        </button>
      </form>

      <div className="mt-8 text-center pt-6 border-t border-[#e8dfd5]/50">
        <p className="text-[#6d5b4b]">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-[#fb923c] font-bold hover:underline transition-all"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
