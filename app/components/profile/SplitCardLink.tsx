"use client";

import Image from "next/image";
import { LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";
import { ChevronRight } from "lucide-react";

interface SplitCardLinkProps {
  link: LinkItem;
  design: ProfileDesign;
}

export default function SplitCardLink({ link, design }: SplitCardLinkProps) {
  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className="block group rounded-xl overflow-hidden transition-all hover:shadow-md"
      style={{
        backgroundColor: design.backgroundColor === "#FFFFFF" ? "#F3F4F6" : "rgba(255,255,255,0.1)",
      }}
    >
      <div className="flex items-center h-24">
        {/* Image (left) */}
        {link.icon && (
          <div className="w-24 h-24 flex-shrink-0 bg-gray-200">
            <Image
              src={link.icon}
              alt={link.title}
              width={96}
              height={96}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title and chevron (right) */}
        <div className="flex-1 px-4 flex items-center justify-between">
          <span className="font-medium" style={{ color: design.textColor }}>
            {link.title}
          </span>
          <ChevronRight
            size={18}
            style={{ color: design.textColor }}
            className="opacity-50 group-hover:opacity-100 transition-opacity flex-shrink-0"
          />
        </div>
      </div>
    </a>
  );
}
