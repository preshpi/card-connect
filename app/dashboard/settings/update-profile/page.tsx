"use client";

import { useMemo, useRef, useState } from "react";
import { ArrowLeft, Camera, Loader2, User } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useGetUser } from "@/app/services/auth";
import { useUpdateProfile } from "@/app/services/profile";
import type { ProfileUpdateRequest } from "@/app/types/auth";
import { getApiErrorMessage } from "@/app/utils/apiError";
import OtpInput from "@/app/components/ui/OtpInput";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dpokiomqq/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "card_connect";

type ProfileFormProps = {
  initialProfile: {
    fullName: string;
    bio: string;
    email: string;
    profileImage?: string;
  };
};

async function uploadImageToCloudinary(file: File) {
  if (!file.type.startsWith("image/")) {
    throw new Error("Please select an image file.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

  const response = await fetch(CLOUDINARY_UPLOAD_URL, {
    method: "POST",
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(
      `Upload failed with status ${response.status}: ${errorText}`,
    );
  }

  const data = await response.json();

  if (!data?.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return data.secure_url as string;
}

function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: initialProfile.fullName,
    bio: initialProfile.bio,
    email: initialProfile.email,
    emailChangeOtp: "",
  });
  const [profileImageUrl, setProfileImageUrl] = useState(
    initialProfile.profileImage || "",
  );
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [emailChangePending, setEmailChangePending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => {
    const { name, value } = e.target;

    if (name === "email") {
      const emailChanged =
        value.trim() && value.trim() !== initialProfile.email;

      if (
        !emailChanged ||
        (emailChangePending && value.trim() !== pendingEmail)
      ) {
        setEmailChangePending(false);
        setPendingEmail("");
        setFormData((prev) => ({
          ...prev,
          emailChangeOtp: "",
        }));
      }
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    setIsImageUploading(true);

    try {
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      setProfileImageUrl(uploadedImageUrl);
      toast.success("Profile image uploaded successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upload profile image."));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSaveChanges = (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (formData.bio.length > 250) {
      toast.error("Bio must be 250 characters or less");
      return;
    }

    const trimmedEmail = formData.email.trim();
    const emailChanged = trimmedEmail && trimmedEmail !== initialProfile.email;

    const payload = {
      fullName: formData.fullName.trim(),
      bio: formData.bio.trim(),
      ...(profileImageUrl && profileImageUrl !== initialProfile.profileImage
        ? { profileImage: profileImageUrl }
        : {}),
      ...(emailChanged ? { email: trimmedEmail } : {}),
      ...(emailChangePending && formData.emailChangeOtp.trim()
        ? { emailChangeOtp: formData.emailChangeOtp.trim() }
        : {}),
    } satisfies ProfileUpdateRequest;

    updateProfile(payload, {
      onSuccess: () => {
        if (emailChanged && !emailChangePending) {
          toast.success(
            "OTP sent to your new email. Enter it to complete the change.",
          );
          setEmailChangePending(true);
          setPendingEmail(trimmedEmail);
          return;
        }

        toast.success("Profile updated successfully");
        setEmailChangePending(false);
        setPendingEmail("");
        setFormData((prev) => ({
          ...prev,
          emailChangeOtp: "",
        }));
      },
      onError: (error: unknown) => {
        toast.error(getApiErrorMessage(error, "Failed to update profile."));
      },
    });
  };

  return (
    <form onSubmit={handleSaveChanges} className="space-y-6">
      <div className="flex flex-col gap-2">
        <span className="text-sm font-medium text-[#1D1F2C]">
          Profile Avatar
        </span>
        <div className="flex items-center gap-4">
          <label
            htmlFor="profileImage"
            className="group relative flex h-20 w-20 cursor-pointer items-center justify-center overflow-hidden rounded-full border border-dashed border-gray-300 bg-gray-100 transition hover:border-[#7269D1]"
          >
            {profileImageUrl ? (
              <Image
                src={profileImageUrl}
                alt="Profile avatar preview"
                width={80}
                height={80}
                className="h-full w-full object-cover"
              />
            ) : (
              <User className="h-8 w-8 text-gray-400" />
            )}

            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/35 group-hover:opacity-100">
              <Camera className="h-4 w-4" />
            </span>
          </label>

          <div className="min-w-0 flex-1">
            <input
              ref={fileInputRef}
              id="profileImage"
              name="profileImage"
              type="file"
              accept="image/*"
              onChange={handleProfileImageChange}
              className="hidden"
            />
            <p className="text-sm font-medium text-[#1D1F2C]">
              {isImageUploading ? "Uploading image..." : "Upload a new photo"}
            </p>
            <p className="text-xs text-gray-500">
              JPG, PNG, and WebP files are supported.
            </p>
          </div>

          {isImageUploading && (
            <Loader2 className="h-5 w-5 animate-spin text-[#7269D1]" />
          )}
        </div>
      </div>

      <div className="flex flex-col">
        <label
          htmlFor="fullName"
          className="text-sm font-medium text-[#1D1F2C] mb-2"
        >
          Full Name
        </label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          placeholder="Enter full name"
          value={formData.fullName}
          onChange={handleChange}
          className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all"
        />
      </div>

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
          placeholder="Enter short bio"
          value={formData.bio}
          onChange={handleChange}
          maxLength={250}
          rows={3}
          className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all resize-none"
        />
        <div className="mt-2 text-xs text-gray-500 text-right">
          {formData.bio.length}/250
        </div>
      </div>

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
          className="px-6 py-3 border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all"
        />

        {emailChangePending && (
          <>
            <p className="mt-2 text-xs text-[#7269D1]">
              OTP sent to {pendingEmail}. Enter it below to complete the email
              change.
            </p>
            <div className="mt-4">
              <label
                htmlFor="emailChangeOtp-0"
                className="text-sm font-medium text-[#1D1F2C] mb-2 block"
              >
                Email Change OTP
              </label>
              <OtpInput
                value={formData.emailChangeOtp}
                onChange={(emailChangeOtp) =>
                  setFormData((prev) => ({ ...prev, emailChangeOtp }))
                }
                idPrefix="emailChangeOtp"
                name="emailChangeOtp"
                length={6}
                disabled={isPending}
              />
            </div>
          </>
        )}
      </div>

      <button
        type="submit"
        disabled={isPending}
        className="w-full bg-[#7269E3] hover:bg-[#7269D1] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
      >
        {isPending
          ? emailChangePending && formData.emailChangeOtp.trim()
            ? "Verifying..."
            : "Saving..."
          : emailChangePending
            ? "Verify Email Change"
            : "Save Changes"}
      </button>
    </form>
  );
}

export default function UpdateProfile() {
  const { data: userData, isLoading: isUserLoading } = useGetUser();

  const currentProfile = useMemo(() => {
    const user = userData?.data;
    const fullName =
      user?.fullName ||
      [user?.firstname, user?.lastname].filter(Boolean).join(" ");

    return {
      fullName,
      bio: user?.bio || "",
      email: user?.email || "",
      profileImage: user?.profileImage || "",
    };
  }, [userData]);

  if (isUserLoading) {
    return (
      <div className="w-full min-h-screen max-w-md px-4 py-8 lg:max-w-lg">
        <p className="text-sm text-[#1D1F2C]">Loading profile...</p>
      </div>
    );
  }

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
      {/* Card Container */}
      <div className="rounded-lg py-6 md:py-8">
        {/* Header */}
        <div className="flex items-center mb-4 gap-12">
          <Link href={"/dashboard/settings"} className="block md:hidden">
            <button className="flex items-center justify-start gap-2 text-xl font-medium text-[#1D1F2C] transition cursor-pointer my-4">
              <ArrowLeft size={28} />
            </button>
          </Link>

          <h1 className="text-lg md:text-2xl font-medium text-[#1D1F2C] text-center md:mb-8">
            Update Details
          </h1>
        </div>

        {/* Form */}
        <ProfileForm
          key={`${currentProfile.fullName}-${currentProfile.bio}-${currentProfile.email}-${currentProfile.profileImage}`}
          initialProfile={currentProfile}
        />
      </div>
    </div>
  );
}
