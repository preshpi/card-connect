"use client";

import { useState } from "react";
import { Eye, EyeOff, User } from "lucide-react";

export default function Profile() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        bio: "",
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
    ) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSaveChanges = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulate API call
        setTimeout(() => {
            console.log("Profile updated:", formData);
            setIsLoading(false);
        }, 1000);
    };

    return (
        <div className="w-full min-h-screen max-w-md px-4 py-8 lg:max-w-lg">
            {/* Card Container */}
            <div className="rounded-lg py-6 md:py-8">
                {/* Header */}
                <h1 className="flex justify-center md:block text-xl md:text-2xl font-bold text-[#1D1F2C] mb-8">
                    Profile Details
                </h1>

                {/* Profile Avatar */}
                <div className="flex justify-left mb-8">
                    <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center">
                        <User className="w-8 h-8 text-gray-400" />
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleSaveChanges} className="space-y-6">
                    {/* First Name and Last Name - Side by side on desktop */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                        {/* First Name */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="firstName"
                                className="text-sm font-medium text-[#1D1F2C] mb-2"
                            >
                                First Name
                            </label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                placeholder="Enter name"
                                value={formData.firstName}
                                onChange={handleChange}
                                className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        {/* Last Name */}
                        <div className="flex flex-col">
                            <label
                                htmlFor="lastName"
                                className="text-sm font-medium text-[#1D1F2C] mb-2"
                            >
                                Last Name
                            </label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                placeholder="Enter name"
                                value={formData.lastName}
                                onChange={handleChange}
                                className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>
                    </div>

                    {/* Bio */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="bio"
                            className="text-sm font-medium text-[#1D1F2C] mb-2"
                        >
                            Bio
                        </label>
                        <textarea
                            id="bio"
                            name="bio"
                            placeholder="Enter short header description"
                            value={formData.bio}
                            onChange={handleChange}
                            rows={1}
                            className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all resize-none"
                        />
                    </div>

                    {/* Email Address */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="email"
                            className="text-sm font-medium text-[#1D1F2C] mb-2"
                        >
                            Email Address
                        </label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Enter email"
                            value={formData.email}
                            onChange={handleChange}
                            className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                        />
                    </div>

                    {/* Password */}
                    <div className="flex flex-col">
                        <label
                            htmlFor="password"
                            className="text-sm font-medium text-[#1D1F2C] mb-2"
                        >
                            Password
                        </label>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                id="password"
                                name="password"
                                placeholder="Enter password"
                                value={formData.password}
                                onChange={handleChange}
                                className="w-full px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all pr-10"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
                            >
                                {showPassword ? (
                                    <EyeOff className="w-5 h-5" />
                                ) : (
                                    <Eye className="w-5 h-5" />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* Save Changes Button */}
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="w-full bg-[#7269E3] hover:bg-[#7269D1] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
                    >
                        {isLoading ? "Saving..." : "Save Changes"}
                    </button>
                </form>
            </div>
        </div>
    );
}
