"use client";

import { LinkGroup, LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";
import ButtonLink from "./ButtonLink";
import CardLink from "./CardLink";
import SplitCardLink from "./SplitCardLink";
import GroupHeader from "./GroupHeader";
import { groupLinksByGroup } from "@/app/utils/links";
import { FONT_CLASS_MAP } from "@/app/lib/fonts";

interface LinkListProps {
  links: LinkItem[];
  design: ProfileDesign;
  groups?: LinkGroup[];
}

export default function LinkList({ links, design, groups }: LinkListProps) {
  const LinkComponent =
    {
      button: ButtonLink,
      card: CardLink,
      "split-card": SplitCardLink,
    }[design.linkStyle] || ButtonLink;

  const { grouped, ungrouped } = groupLinksByGroup(links, groups);
  const fontClass = FONT_CLASS_MAP[design.font];
  return (
    <div className={`w-full space-y-6 ${fontClass}`}>
      {/* Grouped links */}
      {grouped.map(({ group, links: groupLinks }) => (
        <div key={group.id}>
          <GroupHeader groupName={group.name} design={design} />
          <div className="space-y-4 mt-2">
            {groupLinks.map((link) => (
              <LinkComponent key={link.id} link={link} design={design} />
            ))}
          </div>
        </div>
      ))}

      {/* Ungrouped links */}
      {ungrouped.length > 0 && (
        <div className="space-y-4">
          {ungrouped.map((link) => (
            <LinkComponent key={link.id} link={link} design={design} />
          ))}
        </div>
      )}
    </div>
  );
}
