import { LinkItem, LinkGroup } from "@/app/types/links";

export interface GroupedLinksResult {
  ungrouped: LinkItem[];
  grouped: Array<{
    group: LinkGroup;
    links: LinkItem[];
  }>;
}

export function groupLinksByGroup(
  links: LinkItem[],
  groups?: LinkGroup[]
): GroupedLinksResult {
  const groupMap = new Map<string, LinkGroup>();
  const groupedLinks = new Map<string, LinkItem[]>();
  const ungrouped: LinkItem[] = [];

  if (groups) {
    groups.forEach((group) => {
      groupMap.set(group.id, group);
      groupedLinks.set(group.id, []);
    });
  }

  links.forEach((link) => {
    if (!link.groupId) {
      ungrouped.push(link);
    } else {
      if (!groupedLinks.has(link.groupId)) {
        groupedLinks.set(link.groupId, []);
      }
      groupedLinks.get(link.groupId)!.push(link);
    }
  });

  const grouped = Array.from(groupedLinks.entries())
    .map(([groupId, linksInGroup]) => {
      const group = groupMap.get(groupId);
      return {
        group: group || {
          id: groupId,
          name: groupId,
          userId: "",
          index: 0,
          createdAt: "",
          updatedAt: "",
        },
        links: linksInGroup,
      };
    })
    .filter((item) => item.links.length > 0)
    .sort((a, b) => a.group.index - b.group.index);

  return { ungrouped, grouped };
}
