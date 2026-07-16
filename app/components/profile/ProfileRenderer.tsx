"use client";

import { User } from "@/app/types/auth";
import { LinkItem } from "@/app/types/links";
import { ProfileDesign, SocialLink } from "@/app/types/design";
import { THEMES } from "@/app/config/themes";
import MinimalHeader from "./MinimalHeader";
import SpotlightHeader from "./SpotlightHeader";
import SocialIcons from "./SocialIcons";
import LinkList from "./LinkList";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";

interface ProfileRendererProps {
  user: Pick<User, "fullName" | "bio" | "profileImage" | "username">;
  links: LinkItem[];
  socialLinks?: SocialLink[];
  design: ProfileDesign;
}

export default function ProfileRenderer({
  user,
  links,
  socialLinks = [],
  design,
}: ProfileRendererProps) {
  const theme = THEMES.find((t) => t.id === design.theme);
  const bgStyle = { backgroundColor: design.backgroundColor };

  return (
    <div
      style={bgStyle}
      className="w-full px-4 min-h-fit flex flex-col items-center"
    >
      <div className="w-full max-w-md space-y-6 flex flex-col h-full pt-12">
        {/* Theme-specific header */}
        {design.theme === "minimal" && (
          <MinimalHeader user={user} design={design} />
        )}
        {design.theme === "spotlight" && (
          <SpotlightHeader user={user} design={design} />
        )}

        {/* Social icons (fixed placement, after bio/before links) */}
        {design.showSocialIcons && socialLinks.length > 0 && (
          <SocialIcons links={socialLinks} />
        )}

        {/* Link list - flex-1 to take remaining space */}
        <div className="flex-1">
          {links && links.length > 0 && (
            <LinkList links={links} design={design} />
          )}
        </div>

        {/* Footer - always at bottom */}
        <div className="pb-14 flex items-center justify-center mt-auto">
          <Image
            src={Logo}
            alt="CardConnect Logo"
            width={130}
            height={130}
            priority
          />
        </div>
      </div>
    </div>
  );
}
