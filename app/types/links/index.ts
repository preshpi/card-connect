import { ProfileDesign, SocialLink } from "@/app/types/design";

export interface LinkGroup {
  id: string;
  name: string;
  userId: string;
  index: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateLinkRequest {
  title: string;
  icon: string;
  url: string;
  index?: number;
  groupId?: string;
}

export interface LinkItem {
  id?: string;
  title: string;
  icon: string;
  url: string;
  index?: number;
  groupId?: string;
  groupName?: string;
}

export interface CreateLinkResponse {
  message: string;
  data?: LinkItem;
}

export interface UpdateLinkRequest {
  title?: string;
  icon?: string;
  url?: string;
  index?: number;
  groupId?: string | null;
}

export interface CreateGroupRequest {
  name: string;
}

export interface RenameGroupRequest {
  name: string;
}

export interface UpdateLinkResponse {
  message: string;
  data?: LinkItem;
}

export interface DeleteLinkResponse {
  status?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
}

export interface ReorderLinksRequest {
  order: Array<{
    id: string;
    index: number;
  }>;
}

export interface ReorderLinksResponse {
  status?: boolean;
  message?: string;
  data?: {
    message?: string;
  };
}

export interface ListLinksResponse {
  status: boolean;
  data: LinkItem[];
  groups?: LinkGroup[];
}

export interface PublicProfileResponse {
  status?: boolean;
  data: {
    user: {
      id: string;
      fullName?: string;
      bio?: string;
      profileImage?: string;
      username?: string;
      design?: ProfileDesign | null;
      socialLinks?: SocialLink[];
    };
    links: LinkItem[];
  };
}
