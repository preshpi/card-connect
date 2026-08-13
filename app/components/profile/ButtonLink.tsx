"use client";

import { LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";

interface ButtonLinkProps {
  link: LinkItem;
  design: ProfileDesign;
}

function getContrastTextColor(hexColor: string): string {
  const hex = hexColor.replace("#", "");
  if (hex.length !== 6) return "#ffffff";

  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);

  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.6 ? "#111111" : "#ffffff";
}

export default function ButtonLink({ link, design }: ButtonLinkProps) {
  const isFilled = design.buttonStyle === "filled";
  const isOutline = design.buttonStyle === "outline";
  const isSoft = design.buttonStyle === "soft";

  const baseClasses = "block w-full py-3 px-4 rounded-xl font-medium transition-all hover:shadow-md text-center no-underline";

  let finalClasses = baseClasses;
  const inlineStyle: React.CSSProperties = { display: "block" };

  if (isFilled) {
    inlineStyle.color = getContrastTextColor(design.buttonColor);
    inlineStyle.backgroundColor = design.buttonColor;
  } else if (isOutline) {
    finalClasses += " border";
    inlineStyle.borderColor = design.buttonColor;
    inlineStyle.color = design.buttonColor;
    inlineStyle.backgroundColor = "transparent";
  } else {
    inlineStyle.backgroundColor = design.buttonColor + "1F"; // 12% alpha
    inlineStyle.color = design.buttonColor;
  }

  return (
    <a
      href={link.url}
      target="_blank"
      rel="noopener noreferrer"
      className={finalClasses}
      style={inlineStyle}
    >
      {link.title}
    </a>
  );
}
