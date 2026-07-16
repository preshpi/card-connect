"use client";

import Image from "next/image";
import { User } from "@/app/types/auth";
import { ProfileDesign } from "@/app/types/design";
import { FONT_CLASS_MAP } from "@/app/lib/fonts";

interface SpotlightHeaderProps {
  user: Pick<User, "fullName" | "bio" | "profileImage">;
  design: ProfileDesign;
}

export default function SpotlightHeader({
  user,
  design,
}: SpotlightHeaderProps) {
  const fontClass = FONT_CLASS_MAP[design.font];
  const textStyle = { color: design.textColor };

  const profileImageClass =
    design.profileShape === "circle" ? "rounded-full" : "rounded-2xl";

  return (
    <div className="">
      {/* Cover Image */}
      {design.coverImage && (
        <div className="w-full h-32 rounded-2xl overflow-hidden mb-0">
          <Image
            src={design.coverImage}
            alt="Cover"
            width={400}
            height={128}
            className="w-full h-full object-cover"
          />
        </div>
      )}

      {/* Profile Section with overlapping avatar (for Spotlight) */}
      <div
        className={`flex flex-col items-center gap-2 ${design.coverImage ? "-mt-12 relative z-10 mb-2" : "mb-8"}`}
      >
        {/* Profile Image */}
        <div
          className={`w-28 h-28 ${profileImageClass} overflow-hidden flex items-center justify-center flex-shrink-0 border-4`}
          style={{
            backgroundColor: design.buttonColor,
            borderColor: design.backgroundColor,
          }}
        >
          {user.profileImage ? (
            <Image
              src={user.profileImage}
              alt={user.fullName || "Profile"}
              width={112}
              height={112}
              className="w-full h-full object-cover"
            />
          ) : (
            <span
              className="text-3xl font-bold"
              style={{ color: design.backgroundColor }}
            >
              {(user.fullName || "?").charAt(0).toUpperCase()}
            </span>
          )}
        </div>

        {/* Name and Bio */}
        <div className={`text-center ${fontClass} pt-2`}>
          <p className="font-bold text-2xl" style={textStyle}>
            {user.fullName || "Your Name"}
          </p>
          <p className="text-sm mt-1 opacity-80" style={textStyle}>
            {user.bio || "Your bio goes here"}
          </p>
        </div>
      </div>
    </div>
  );
}
