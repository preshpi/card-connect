"use client";

import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";

export default function LoginPage() {
    const [showPassword, setShowPassword] = useState(false);
    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const handleSubmit = () => {
        console.log("Form submitted:", formData);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    return (
        <main className="flex items-start justify-start lg:items-center lg:justify-center p-5 bg-white min-h-screen">
            <div className="w-full max-w-full lg:max-w-md p-4 lg:p-8">
                {/* Logo */}
                <div className="flex items-center justify-start lg:justify-center mb-8">
                    <Link href="/">
                        <Image
                            src={Logo}
                            alt="CardConnect Logo"
                            width={150}
                            height={150}
                            priority
                        />
                    </Link>
                </div>

                {/* Header */}
                <div className="text-left lg:text-center mb-8">
                    <h1 className="text-2xl font-bold text-[#1D1F2C] mb-2">
                        Log In
                    </h1>
                    <p className="text-sm text-[#1B231F]">
                        Welcome back! Please enter your email and password to
                        proceed.
                    </p>
                </div>

                {/* Form Fields */}
                <div className="space-y-5">
                    {/* Email Field */}
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
                        >
                            Email
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="Enter email address"
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                        />
                    </div>

                    {/* Password Field */}
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-[#1B231F] mb-2 cursor-pointer"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Enter password"
                                className="w-full px-4 py-3 pr-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600 transition cursor-pointer"
                            >
                                {showPassword ? (
                                    <Eye className="w-5 h-5" />
                                ) : (
                                    <EyeOff className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Forgot Password Link */}
                    <div className="text-right">
                        <a
                            href="/forgot-password"
                            className="text-sm text-[#1B231F] hover:text-[#7269E3] transition"
                        >
                            Forgot Password?
                        </a>
                    </div>

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="w-full bg-[#7269E3] hover:bg-[#7269D1] text-white font-medium py-3 rounded-full transition duration-200 cursor-pointer shadow-sm"
                    >
                        Log In
                    </button>
                </div>

                {/* Create Account Link */}
                <div className="mt-6 text-left lg:text-center">
                    <p className="text-sm text-gray-600">
                        Don&apos;t have an account?{" "}
                        <a
                            href="/signup"
                            className="text-[#7269E3] hover:underline font-medium"
                        >
                            Create Account
                        </a>
                    </p>
                </div>
            </div>
        </main>
    );
}
