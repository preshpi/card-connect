"use client";

import { ProfileDesign } from "@/app/types/design";

interface GroupHeaderProps {
  groupName: string;
  design: ProfileDesign;
}

export default function GroupHeader({ groupName, design }: GroupHeaderProps) {
  return (
    <h3
      className="text-sm font-semibold mt-4 uppercase tracking-wide text-center"
      style={{ color: design.textColor }}
    >
      {groupName}
    </h3>
  );
}
