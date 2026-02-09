"use client";

import React, { useState } from "react";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import Link from "next/link";

export default function ChangePassword() {
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Handle password update logic here
        console.log("Password update submitted");
    };

    return (
        <div className="w-full min-h-screen max-w-md px-4 py-8 lg:max-w-lg">
            <Link href={"/dashboard/settings"}>
                <button className="hidden md:flex items-center gap-2 text-lg font-medium text-[#1D1F2C] transition cursor-pointer my-4">
                    <span className="flex items-center justify-center w-6 h-6 rounded-full border text-[#7269D1] border-[#7269D1]">
                        <ArrowLeft size={14} />
                    </span>
                    Back
                </button>
            </Link>
            {/* Header */}
            <div className="flex items-center mb-4 gap-12">
                <Link href={"/dashboard/settings"} className="block md:hidden">
                    <button className="flex items-center justify-start gap-2 text-xl font-medium text-[#1D1F2C] transition cursor-pointer my-4">
                        <ArrowLeft size={28} />
                    </button>
                </Link>
                <h1 className="text-lg md:text-2xl font-medium text-[#1D1F2C] text-center md:mb-8">
                    Change Password
                </h1>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Current Password */}
                <div>
                    <label
                        htmlFor="current-password"
                        className="block text-sm font-medium text-[#1D1F2C] mb-2"
                    >
                        Current Password
                    </label>
                    <div className="relative">
                        <input
                            id="current-password"
                            type={showCurrentPassword ? "text" : "password"}
                            value={currentPassword}
                            onChange={(e) => setCurrentPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all placeholder:text-[#1D1F2C]"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowCurrentPassword(!showCurrentPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1F2C] hover:text-[#1D1F2C] transition-colors cursor-pointer"
                        >
                            {showCurrentPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* New Password */}
                <div>
                    <label
                        htmlFor="new-password"
                        className="block text-sm font-medium text-[#1D1F2C] mb-2"
                    >
                        New Password
                    </label>
                    <div className="relative">
                        <input
                            id="new-password"
                            type={showNewPassword ? "text" : "password"}
                            value={newPassword}
                            onChange={(e) => setNewPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all placeholder:text-[#1D1F2C]"
                        />
                        <button
                            type="button"
                            onClick={() => setShowNewPassword(!showNewPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1F2C] hover:text-[#1D1F2C] transition-colors cursor-pointer"
                        >
                            {showNewPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Confirm Password */}
                <div>
                    <label
                        htmlFor="confirm-password"
                        className="block text-sm font-medium text-[#1D1F2C] mb-2"
                    >
                        Confirm Password
                    </label>
                    <div className="relative">
                        <input
                            id="confirm-password"
                            type={showConfirmPassword ? "text" : "password"}
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            placeholder="Enter password"
                            className="w-full px-4 py-3 border border-[#DDDDDD] rounded-lg focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all placeholder:text-[#1D1F2C]"
                        />
                        <button
                            type="button"
                            onClick={() =>
                                setShowConfirmPassword(!showConfirmPassword)
                            }
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[#1D1F2C] hover:text-[#1D1F2C] transition-colors cursor-pointer"
                        >
                            {showConfirmPassword ? (
                                <EyeOff className="w-5 h-5" />
                            ) : (
                                <Eye className="w-5 h-5" />
                            )}
                        </button>
                    </div>
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    className="w-full bg-[#7269E3] hover:bg-[#7269D1] text-white font-medium py-3 px-4 rounded-lg transition-colors cursor-pointer focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:ring-offset-2"
                >
                    Update Password
                </button>
            </form>
        </div>
    );
}
