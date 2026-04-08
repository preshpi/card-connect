export interface CreateLinkRequest {
  title: string;
  icon: string;
  url: string;
  index?: number;
}

export interface LinkItem {
  id?: string;
  title: string;
  icon: string;
  url: string;
  index?: number;
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
}
