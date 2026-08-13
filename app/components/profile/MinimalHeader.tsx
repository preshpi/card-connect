"use client";

import Image from "next/image";
import { User } from "@/app/types/auth";
import { ProfileDesign } from "@/app/types/design";
import { FONT_CLASS_MAP } from "@/app/lib/fonts";

interface MinimalHeaderProps {
  user: Pick<User, "fullName" | "bio" | "profileImage">;
  design: ProfileDesign;
}

export default function MinimalHeader({ user, design }: MinimalHeaderProps) {
  const fontClass = FONT_CLASS_MAP[design.font];
  const textStyle = { color: design.textColor };

  const profileImageClass =
    design.profileShape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="flex flex-col items-center gap-y-6">
      {/* Profile Image */}
      <div
        className={`w-32 h-32 ${profileImageClass} overflow-hidden flex items-center justify-center flex-shrink-0`}
        style={{ backgroundColor: design.buttonColor }}
      >
        {user.profileImage ? (
          <Image
            src={user.profileImage}
            alt={user.fullName || "Profile"}
            width={96}
            height={96}
            className="w-full h-full object-cover"
          />
        ) : (
          <span
            className="text-2xl font-bold"
            style={{ color: design.backgroundColor }}
          >
            {(user.fullName || "?").charAt(0).toUpperCase()}
          </span>
        )}
      </div>

      {/* Name and Bio */}
      <div className={`text-center ${fontClass}`}>
        <p className="font-bold text-xl" style={textStyle}>
          {user.fullName || "Your Name"}
        </p>
        <p className="text-sm mt-1 opacity-80" style={textStyle}>
          {user.bio || "Your bio goes here"}
        </p>
      </div>
    </div>
  );
}
