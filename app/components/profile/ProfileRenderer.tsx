"use client";

import { User } from "@/app/types/auth";
import { LinkGroup, LinkItem } from "@/app/types/links";
import { ProfileDesign, SocialLink } from "@/app/types/design";
import { THEMES } from "@/app/config/themes";
import MinimalHeader from "./MinimalHeader";
import SpotlightHeader from "./SpotlightHeader";
import SocialIcons from "./SocialIcons";
import LinkList from "./LinkList";
import Image from "next/image";
import Logo from "../../../public/assets/Logo.svg";
import LogoWhite from "../../../public/assets/LogoWhite.svg";
import Link from "next/link";

interface ProfileRendererProps {
  user: Pick<User, "fullName" | "bio" | "profileImage" | "username">;
  links: LinkItem[];
  groups?: LinkGroup[];
  socialLinks?: SocialLink[];
  design: ProfileDesign;
  fillViewport?: boolean;
}

function isDarkBackground(color: string): boolean {
  const hexMatches = color.match(/#[0-9A-Fa-f]{6}/g);
  if (!hexMatches || hexMatches.length === 0) return false;

  const luminances = hexMatches.map((hex) => {
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  });

  const avgLuminance =
    luminances.reduce((sum, l) => sum + l, 0) / luminances.length;
  return avgLuminance <= 0.6;
}

export default function ProfileRenderer({
  user,
  links,
  groups,
  socialLinks = [],
  design,
  fillViewport = true,
}: ProfileRendererProps) {
  const theme = THEMES.find((t) => t.id === design.theme);
  const bgStyle = { background: design.backgroundColor };
  const logoSrc = isDarkBackground(design.backgroundColor) ? LogoWhite : Logo;

  return (
    <div
      style={bgStyle}
      className={`w-full px-4 flex flex-col items-center ${
        fillViewport ? "min-h-screen" : "min-h-fit"
      }`}
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
            <LinkList links={links} groups={groups} design={design} />
          )}
        </div>

        {/* Footer - always at bottom */}
        <div className="pb-14 flex items-center justify-center mt-auto">
          <Link href="/" target="_blank" rel="noopener noreferrer">
            <Image
              src={logoSrc}
              alt="CardConnect Logo"
              width={130}
              height={130}
              priority
            />
          </Link>
        </div>
      </div>
    </div>
  );
}
