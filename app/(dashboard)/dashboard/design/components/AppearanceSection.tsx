"use client";

import { useRef, useState } from "react";
import { useDesignStore } from "@/app/store/useDesignStore";
import { Camera, Loader2 } from "lucide-react";
import ImageCropModal from "@/app/components/ImageCropModal";
import { toast } from "sonner";

const CLOUDINARY_UPLOAD_URL =
  "https://api.cloudinary.com/v1_1/dpokiomqq/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "card_connect";

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
      `Upload failed with status ${response.status}: ${errorText}`
    );
  }

  const data = await response.json();

  if (!data?.secure_url) {
    throw new Error("Cloudinary did not return an image URL.");
  }

  return data.secure_url as string;
}

export default function AppearanceSection() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [showCropModal, setShowCropModal] = useState(false);
  const [tempImageForCrop, setTempImageForCrop] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleProfileImageChange = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];

    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (typeof event.target?.result === "string") {
        setTempImageForCrop(event.target.result);
        setShowCropModal(true);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedImageUrl: string) => {
    setIsUploading(true);

    try {
      const response = await fetch(croppedImageUrl);
      const blob = await response.blob();
      const file = new File([blob], "cover-image.jpg", {
        type: "image/jpeg",
      });

      const uploadedImageUrl = await uploadImageToCloudinary(file);
      setDraft({ coverImage: uploadedImageUrl });
      toast.success("Cover image updated successfully");
    } catch (error) {
      toast.error("Failed to upload cover image");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <ImageCropModal
        open={showCropModal}
        imageSrc={tempImageForCrop}
        aspect={3}
        cropShape="rect"
        onCropComplete={handleCropComplete}
        onClose={() => {
          setShowCropModal(false);
          setTempImageForCrop("");
        }}
      />

      <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>

      {/* Profile Shape */}
      <div className="mb-6">
        <p className="text-sm font-medium text-gray-700 mb-3">
          Profile Picture Shape
        </p>
        <div className="space-y-2">
          {["circle", "rounded-square"].map((shape) => (
            <label key={shape} className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
              <input
                type="radio"
                name="profileShape"
                value={shape}
                checked={draft.profileShape === shape}
                onChange={(e) =>
                  setDraft({ profileShape: e.target.value as any })
                }
                className="w-4 h-4"
              />
              <span className="text-sm font-medium text-gray-700">
                {shape === "circle" ? "Circle" : "Rounded Square"}
              </span>
            </label>
          ))}
        </div>
      </div>

      {/* Cover Image Upload (Spotlight-only) */}
      {draft.theme === "spotlight" && (
        <div className="border-t pt-6">
          <p className="text-sm font-medium text-gray-700 mb-3">Cover Image</p>
          <label
            className="group relative flex h-32 w-full cursor-pointer items-center justify-center overflow-hidden rounded-xl border-2 border-dashed border-gray-300 bg-gray-50 transition hover:border-purple-400 hover:bg-purple-50"
            onClick={() => fileInputRef.current?.click()}
          >
            {draft.coverImage ? (
              <img
                src={draft.coverImage}
                alt="Cover"
                className="h-full w-full object-cover"
              />
            ) : (
              <div className="flex flex-col items-center gap-2">
                <Camera className="h-6 w-6 text-gray-400 group-hover:text-purple-600" />
                <span className="text-sm font-medium text-gray-600 group-hover:text-purple-600">
                  Upload cover image
                </span>
              </div>
            )}

            <span className="absolute inset-0 flex items-center justify-center bg-black/0 text-white opacity-0 transition group-hover:bg-black/20 group-hover:opacity-100">
              {isUploading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Camera className="h-6 w-6" />
              )}
            </span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleProfileImageChange}
            className="hidden"
          />
        </div>
      )}
    </div>
  );
}
