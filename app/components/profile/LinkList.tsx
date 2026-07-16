"use client";

import { LinkItem } from "@/app/types/links";
import { ProfileDesign } from "@/app/types/design";
import ButtonLink from "./ButtonLink";
import CardLink from "./CardLink";
import SplitCardLink from "./SplitCardLink";
import GroupHeader from "./GroupHeader";
import { groupLinksByGroup } from "@/app/utils/links";

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

  const { grouped, ungrouped } = groupLinksByGroup(links);

  return (
    <div className="w-full space-y-6">
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
