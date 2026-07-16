"use client";

import { useDesignStore } from "@/app/store/useDesignStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import ProfileRenderer from "@/app/components/profile/ProfileRenderer";
import PhoneFrame from "@/app/components/profile/PhoneFrame";
import { LinkItem } from "@/app/types/links";

interface DesignEditorLivePreviewProps {
  links: LinkItem[];
}

export default function DesignEditorLivePreview({
  links,
}: DesignEditorLivePreviewProps) {
  const draft = useDesignStore((state) => state.draft);
  const socialLinksDraft = useDesignStore((state) => state.socialLinksDraft);
  const user = useAuthStore((state) => state.user);

  return (
    <PhoneFrame>
      <ProfileRenderer
        user={{
          fullName: user?.fullName,
          bio: user?.bio,
          profileImage: user?.profileImage,
          username: user?.username,
        }}
        links={links}
        socialLinks={socialLinksDraft}
        design={draft}
      />
    </PhoneFrame>
  );
}
