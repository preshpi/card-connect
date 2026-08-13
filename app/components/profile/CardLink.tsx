"use client";

import Image from "next/image";
import { LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";
import { ChevronRight } from "lucide-react";

interface CardLinkProps {
  link: LinkItem;
  design: ProfileDesign;
}

export default function CardLink({ link, design }: CardLinkProps) {
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
      <div className="flex flex-col">
        {/* Image */}
        {link.icon && (
          <div className="w-full h-32 overflow-hidden bg-gray-200">
            <Image
              src={link.icon}
              alt={link.title}
              width={400}
              height={128}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Title */}
        <div className="p-4 flex items-center justify-between">
          <span className="font-medium" style={{ color: design.textColor }}>
            {link.title}
          </span>
          <ChevronRight size={18} style={{ color: design.textColor }} className="opacity-50 group-hover:opacity-100 transition-opacity" />
        </div>
      </div>
    </a>
  );
}
