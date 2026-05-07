export interface LinkPerformance {
  linkId: string;
  title: string;
  url: string;
  count: number;
}

export interface AnalyticsData {
  totalProfileViews: number;
  totalLinkClicks: number;
  topPerformingLink: LinkPerformance;
  mostSharedLink: LinkPerformance;
}

export interface AnalyticsResponse {
  status: boolean;
  data: AnalyticsData;
}
