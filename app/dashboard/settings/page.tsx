"use client";

import { useState } from "react";
import { AlertCircle } from "lucide-react";
import Link from "next/link";

export default function Settings() {
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const handleChangePassword = () => {
        // Handle navigate to change password page or open modal
        console.log("Navigate to change password");
    };

    const handleDeleteAccount = async () => {
        setIsDeleting(true);
        // Simulate API call
        setTimeout(() => {
            console.log("Account deleted");
            setIsDeleting(false);
            setShowDeleteModal(false);
        }, 1000);
    };

    return (
        <div className="w-full min-h-screen bg-gray-50 py-8 md:py-12">
            <div className="w-full">
                {/* Page Header */}
                <h1 className="text-2xl md:text-3xl font-bold text-[#1D1F2C] mb-8 md:mb-12">
                    Settings
                </h1>

                {/* Settings Container */}
                <div className="space-y-6 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-6">
                    {/* Profile Details Card */}
                    <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#1D1F2C] mb-2">
                            Profile Details
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Update your personal information and preferences.
                        </p>
                        <Link href={"/dashboard/settings/update-profile"}>
                            <button
                                onClick={handleChangePassword}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                            >
                                Update Details
                            </button>
                        </Link>
                    </div>

                    {/* Change Password Card */}
                    <div className="bg-white rounded-2xl p-6 md:p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#1D1F2C] mb-2">
                            Change Password
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Permanently delete your entire account and all
                            profiles you own.
                        </p>
                        <Link href={"/dashboard/settings/change-password"}>
                            <button
                                onClick={handleChangePassword}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-2xl text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer"
                            >
                                Change Password
                            </button>
                        </Link>
                    </div>

                    {/* Delete Account Card - Full Width */}
                    <div className="lg:col-span-1 bg-white rounded-2xl p-6 md:p-7 shadow-sm">
                        <h2 className="text-lg font-semibold text-[#1D1F2C] mb-2">
                            Delete Account
                        </h2>
                        <p className="text-sm text-gray-500 mb-6">
                            Permanently deleting your account will erase all
                            your data.
                        </p>
                        <button
                            onClick={() => setShowDeleteModal(true)}
                            className="w-full px-6 py-2.5 bg-[#BF010A] text-white font-semibold rounded-2xl transition-colors duration-200 cursor-pointer shadow-md hover:shadow-lg"
                        >
                            Delete Account
                        </button>
                    </div>
                </div>
            </div>

            {/* Delete Account Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
                    <div className="bg-white rounded-2xl p-6 md:p-8 max-w-sm w-full shadow-xl">
                        {/* Alert Icon */}
                        <div className="flex justify-center mb-4">
                            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                                <AlertCircle className="w-6 h-6 text-red-600" />
                            </div>
                        </div>

                        {/* Modal Content */}
                        <h3 className="text-lg font-semibold text-[#1D1F2C] text-center mb-2">
                            Delete Account?
                        </h3>
                        <p className="text-sm text-gray-600 text-center mb-6">
                            Are you sure you want to permanently delete your
                            account? This action cannot be undone.
                        </p>

                        {/* Modal Actions */}
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                disabled={isDeleting}
                                className="flex-1 px-4 py-2.5 bg-[#BF010A] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold rounded-2xl transition-colors duration-200 cursor-pointer"
                            >
                                {isDeleting ? "Deleting..." : "Delete"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
