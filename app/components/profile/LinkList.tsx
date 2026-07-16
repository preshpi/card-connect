"use client";

import { LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";
import ButtonLink from "./ButtonLink";
import CardLink from "./CardLink";
import SplitCardLink from "./SplitCardLink";

interface LinkListProps {
  links: LinkItem[];
  design: ProfileDesign;
}

export default function LinkList({ links, design }: LinkListProps) {
  const LinkComponent = {
    button: ButtonLink,
    card: CardLink,
    "split-card": SplitCardLink,
  }[design.linkStyle] || ButtonLink;

  return (
    <div className="w-full space-y-4">
      {links.map((link) => (
        <LinkComponent key={link.id} link={link} design={design} />
      ))}
    </div>
  );
}
