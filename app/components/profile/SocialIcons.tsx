"use client";

import { Instagram, Github, Linkedin, Facebook, Youtube } from "lucide-react";
import { SocialLink } from "@/app/types/design";

interface SocialIconsProps {
  links: SocialLink[];
}

export default function SocialIcons({ links }: SocialIconsProps) {
  const filteredLinks = links.filter((l) => l.url?.trim());

  if (filteredLinks.length === 0) return null;

  const getIcon = (platform: string) => {
    switch (platform) {
      case "instagram":
        return <Instagram size={20} />;
      case "github":
        return <Github size={20} />;
      case "linkedin":
        return <Linkedin size={20} />;
      case "facebook":
        return <Facebook size={20} />;
      case "youtube":
        return <Youtube size={20} />;
      case "x":
        return <X size={20} />;
      case "tiktok":
        return <TikTok size={20} />;
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center gap-4 mb-8">
      {filteredLinks.map((link) => (
        <a
          key={link.platform}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className="text-gray-700 hover:text-gray-900 transition-colors"
          title={link.platform}
        >
          {getIcon(link.platform)}
        </a>
      ))}
    </div>
  );
}

// Inline SVGs for X and TikTok since lucide doesn't have official marks for these
function X({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.627l-5.1-6.694-5.867 6.694h-3.31l7.75-8.835L.424 2.25h6.627l4.872 6.247 5.321-6.247zM17.002 18.807h1.791L5.97 3.539H4.171l12.831 15.268z" />
    </svg>
  );
}

function TikTok({ size = 24 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.1 1.82 2.89 2.89 0 0 1 5.1-1.82V9.4a6.84 6.84 0 0 0-5-2.19c-3.63 0-6.55 2.94-6.55 6.55 0 3.61 2.92 6.55 6.55 6.55A6.59 6.59 0 0 0 12 20.13V6.02a8.43 8.43 0 0 0 7.59 4.85v-3.4a4.85 4.85 0 0 1-3.59-1.79l.37-.6z" />
    </svg>
  );
}
