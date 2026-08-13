"use client";

import { useDesignStore } from "@/app/store/useDesignStore";
import { SocialPlatform } from "@/app/types/design";

const SOCIAL_PLATFORMS: Array<{
  id: SocialPlatform;
  name: string;
  baseUrl: string;
  placeholder: string;
}> = [
  { id: "instagram", name: "Instagram", baseUrl: "https://instagram.com/", placeholder: "username" },
  { id: "x", name: "X (Twitter)", baseUrl: "https://x.com/", placeholder: "username" },
  { id: "linkedin", name: "LinkedIn", baseUrl: "https://linkedin.com/in/", placeholder: "username" },
  { id: "github", name: "GitHub", baseUrl: "https://github.com/", placeholder: "username" },
  { id: "tiktok", name: "TikTok", baseUrl: "https://tiktok.com/@", placeholder: "username" },
  { id: "youtube", name: "YouTube", baseUrl: "https://youtube.com/@", placeholder: "username" },
  { id: "facebook", name: "Facebook", baseUrl: "https://facebook.com/", placeholder: "username" },
];

export default function SocialIconsSection() {
  const draft = useDesignStore((state) => state.draft);
  const setDraft = useDesignStore((state) => state.setDraft);
  const socialLinksDraft = useDesignStore((state) => state.socialLinksDraft);
  const setSocialLinksDraft = useDesignStore(
    (state) => state.setSocialLinksDraft
  );

  const handleUrlChange = (platform: SocialPlatform, username: string) => {
    const updated = socialLinksDraft.filter((l) => l.platform !== platform);
    if (username.trim()) {
      const platformConfig = SOCIAL_PLATFORMS.find((p) => p.id === platform);
      const fullUrl = platformConfig ? platformConfig.baseUrl + username.trim() : username.trim();
      updated.push({ platform, url: fullUrl });
    }
    setSocialLinksDraft(updated);
  };

  const getSocialUsername = (platform: SocialPlatform) => {
    const url = socialLinksDraft.find((l) => l.platform === platform)?.url || "";
    const platformConfig = SOCIAL_PLATFORMS.find((p) => p.id === platform);
    if (platformConfig && url.startsWith(platformConfig.baseUrl)) {
      return url.slice(platformConfig.baseUrl.length);
    }
    return url;
  };

  const hasAnyUrl = socialLinksDraft.some((l) => l.url?.trim());

  return (
    <div>
      <h2 className="text-lg font-semibold text-gray-900 mb-4">
        Social Icons
      </h2>
      <p className="text-sm text-gray-600 mb-4">
        Add your social media usernames. Icons will appear above your link list.
      </p>

      <div className="space-y-4 mb-6">
        {SOCIAL_PLATFORMS.map((platform) => (
          <div key={platform.id}>
            <label className="text-sm font-medium text-gray-900 mb-2 block">
              {platform.name}
            </label>
            <div className="flex items-center gap-2 bg-gray-50 rounded-lg border border-gray-300 px-3 py-2 focus-within:ring-2 focus-within:ring-purple-500 focus-within:border-transparent transition-all">
              <span className="text-sm text-gray-600 whitespace-nowrap">
                {platform.baseUrl}
              </span>
              <input
                type="text"
                placeholder={platform.placeholder}
                value={getSocialUsername(platform.id)}
                onChange={(e) => handleUrlChange(platform.id, e.target.value)}
                className="flex-1 bg-transparent text-sm text-gray-900 placeholder-gray-500 outline-none"
              />
            </div>
          </div>
        ))}
      </div>

      {/* Show/Hide toggle - ON by default */}
      <div className="pt-4 border-t border-gray-200">
        <label className="flex items-center gap-3 p-3 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer">
          <input
            type="checkbox"
            checked={draft.showSocialIcons}
            onChange={(e) => setDraft({ showSocialIcons: e.target.checked })}
            className="w-4 h-4 rounded accent-purple-600"
          />
          <span className="text-sm font-medium text-gray-700">
            Show social icons on profile
          </span>
        </label>
        <p className="text-xs text-gray-500 mt-2">
          Icons appear above your link list when enabled
        </p>
      </div>
    </div>
  );
}
