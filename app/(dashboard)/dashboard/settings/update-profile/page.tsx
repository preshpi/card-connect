"use client";

import { useMemo, useRef, useState, useEffect } from "react";
import { ArrowLeft, Camera, Loader2, User, X } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "sonner";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useUpdateProfile } from "@/app/services/profile";
import type { ProfileUpdateRequest } from "@/app/types/auth";
import { getApiErrorMessage } from "@/app/utils/apiError";
import OtpInput from "@/app/components/ui/OtpInput";
import { apiClient } from "@/app/lib/api-client";
import ImageCropModal from "@/app/components/ImageCropModal";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dpokiomqq/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "card_connect";

type ProfileFormProps = {
  initialProfile: {
    fullName: string;
    bio: string;
    email: string;
    username: string;
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

async function checkUsernameAvailability(username: string) {
  try {
    const response = await apiClient
      .getClient()
      .get(`/profile/username/check?username=${username}`);
    return response.data.data.available;
  } catch {
    return false;
  }
}

function ProfileForm({ initialProfile }: ProfileFormProps) {
  const { mutate: updateProfile, isPending } = useUpdateProfile();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [formData, setFormData] = useState({
    fullName: initialProfile.fullName,
    bio: initialProfile.bio,
    email: initialProfile.email,
    username: initialProfile.username,
    emailChangeOtp: "",
  });
  const [profileImageUrl, setProfileImageUrl] = useState(
    initialProfile.profileImage || "",
  );
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [emailChangePending, setEmailChangePending] = useState(false);
  const [pendingEmail, setPendingEmail] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [checkingUsername, setCheckingUsername] = useState(false);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState("");

  // Check username availability when it changes
  useEffect(() => {
    const checkUsername = async () => {
      const trimmedUsername = formData.username.trim();

      if (!trimmedUsername) {
        setUsernameError("");
        return;
      }

      if (trimmedUsername === initialProfile.username) {
        setUsernameError("");
        return;
      }

      if (trimmedUsername.length < 3) {
        setUsernameError("Username must be at least 3 characters");
        return;
      }

      if (!/^[a-zA-Z0-9_-]+$/.test(trimmedUsername)) {
        setUsernameError(
          "Username can only contain letters, numbers, underscore, and hyphen",
        );
        return;
      }

      setCheckingUsername(true);
      try {
        const available = await checkUsernameAvailability(trimmedUsername);
        setUsernameError(available ? "" : "This username is already taken");
      } catch {
        setUsernameError("Error checking username availability");
      } finally {
        setCheckingUsername(false);
      }
    };

    const debounceTimer = setTimeout(checkUsername, 500);
    return () => clearTimeout(debounceTimer);
  }, [formData.username, initialProfile.username]);

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

  const handleCancelEmailChange = () => {
    setFormData((prev) => ({
      ...prev,
      email: initialProfile.email,
      emailChangeOtp: "",
    }));
    setEmailChangePending(false);
    setPendingEmail("");
    toast.info("Email change cancelled");
  };

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    // Read file as data URL for cropper
    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setTempImageForCrop(event.target.result);
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  // Add new handler for crop completion
  const handleCropComplete = async (croppedImageUrl: string) => {
    setIsImageUploading(true);

    try {
      // Convert blob URL to file
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "profile-image.jpg", {
        type: "image/jpeg",
      });

      // Upload to Cloudinary
      const uploadedImageUrl = await uploadImageToCloudinary(file);
      setProfileImageUrl(uploadedImageUrl);
      toast.success("Profile image updated successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to upload profile image."));
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsImageUploading(false);
    }
  };

  const handleSaveChanges = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.fullName.trim()) {
      toast.error("Full name is required");
      return;
    }

    if (formData.bio.length > 250) {
      toast.error("Bio must be 250 characters or less");
      return;
    }

    const trimmedUsername = formData.username.trim();
    if (!trimmedUsername) {
      toast.error("Username is required");
      return;
    }

    if (usernameError) {
      toast.error(usernameError);
      return;
    }

    const trimmedEmail = formData.email.trim();
    const emailChanged = trimmedEmail && trimmedEmail !== initialProfile.email;
    const usernameChanged = trimmedUsername !== initialProfile.username;

    try {
      // Step 1: Update username if changed
      if (usernameChanged) {
        await apiClient.getClient().patch("/profile/username", {
          username: trimmedUsername,
        });
        toast.success("Username updated successfully");
      }

      // Step 2: Update other profile fields
      const profilePayload = {
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

      updateProfile(profilePayload, {
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
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update username."));
    }
  };
  return (
    <>
      <ImageCropModal
        open={showCropModal}
        imageSrc={tempImageForCrop}
        onCropComplete={handleCropComplete}
        onClose={() => {
          setShowCropModal(false);
          setTempImageForCrop("");
        }}
      />
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
            htmlFor="username"
            className="text-sm font-medium text-[#1D1F2C] mb-2"
          >
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              id="username"
              name="username"
              placeholder="Enter username"
              value={formData.username}
              onChange={handleChange}
              className={`w-full px-6 py-3 border rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7269D1] focus:border-transparent transition-all ${
                usernameError ? "border-red-500" : "border-gray-200"
              }`}
            />
            {checkingUsername && (
              <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-[#7269D1]" />
            )}
          </div>
          {usernameError && (
            <p className="mt-1 text-xs text-red-500">{usernameError}</p>
          )}
          {formData.username !== initialProfile.username &&
            !usernameError &&
            formData.username.trim() && (
              <p className="mt-1 text-xs text-green-500">
                ✓ Username available
              </p>
            )}
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

        <div className="flex flex-col gap-3">
          <button
            type="submit"
            disabled={
              isPending ||
              (formData.username !== initialProfile.username && !!usernameError)
            }
            className="flex-1 bg-[#7269E3] hover:bg-[#7269D1] disabled:opacity-75 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-md hover:shadow-lg cursor-pointer"
          >
            {isPending
              ? emailChangePending && formData.emailChangeOtp.trim()
                ? "Verifying..."
                : "Saving..."
              : emailChangePending
                ? "Verify Email Change"
                : "Save Changes"}
          </button>

          {emailChangePending && (
            <button
              type="button"
              onClick={handleCancelEmailChange}
              disabled={isPending}
              className="flex-1 border border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold py-3 px-6 rounded-lg transition-all duration-200 cursor-pointer disabled:opacity-75 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <X size={18} />
              Cancel
            </button>
          )}
        </div>
      </form>{" "}
    </>
  );
}

export default function UpdateProfile() {
  const user = useAuthStore((state) => state.user);
  const isUserLoading = !user;

  const currentProfile = useMemo(() => {
    const u = user;
    const fullName =
      u?.fullName || [u?.firstname, u?.lastname].filter(Boolean).join(" ");

    return {
      fullName,
      bio: u?.bio || "",
      email: u?.email || "",
      username: u?.username || "",
      profileImage: u?.profileImage || "",
    };
  }, [user]);

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
          key={`${currentProfile.fullName}-${currentProfile.bio}-${currentProfile.email}-${currentProfile.username}-${currentProfile.profileImage}`}
          initialProfile={currentProfile}
        />
      </div>
    </div>
  );
}
