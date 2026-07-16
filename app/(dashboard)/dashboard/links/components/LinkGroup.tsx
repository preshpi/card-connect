import React from "react";
import { LinkItem, LinkGroup as LinkGroupType } from "@/app/types/links";
import LinkGroupHeader from "./LinkGroupHeader";

interface LinkGroupProps {
  group: LinkGroupType;
  links: LinkItem[];
  onRenameGroup: (groupId: string) => void;
  onDeleteGroup: (groupId: string) => void;
  onEditLink: (link: LinkItem) => void;
  onDeleteLink: (linkId: string) => void;
  onMoveLink: (linkId: string, linkTitle: string) => void;
  isLoading?: boolean;
  children?: React.ReactNode;
}

export default function LinkGroup({
  group,
  links,
  onRenameGroup,
  onDeleteGroup,
  onEditLink,
  onDeleteLink,
  onMoveLink,
  isLoading,
  children,
}: LinkGroupProps) {
  return (
    <div className="space-y-2">
      <LinkGroupHeader
        groupName={group.name}
        linkCount={links.length}
        onRename={() => onRenameGroup(group.id)}
        onDelete={() => onDeleteGroup(group.id)}
        isLoading={isLoading}
      />
      {children}
    </div>
  );
}
