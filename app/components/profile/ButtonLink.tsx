"use client";

import { LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";

interface ButtonLinkProps {
  link: LinkItem;
  design: ProfileDesign;
}

export default function ButtonLink({ link, design }: ButtonLinkProps) {
  const isFilled = design.buttonStyle === "filled";
  const isOutline = design.buttonStyle === "outline";
  const isSoft = design.buttonStyle === "soft";

  const baseClasses = "block w-full py-3 px-4 rounded-xl font-medium transition-all hover:shadow-md text-center no-underline";

  let finalClasses = baseClasses;
  const inlineStyle: React.CSSProperties = { display: "block" };

  if (isFilled) {
    finalClasses += " text-white";
    inlineStyle.backgroundColor = design.buttonColor;
  } else if (isOutline) {
    finalClasses += " border-2";
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
