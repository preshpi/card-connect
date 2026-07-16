"use client";

import { useEffect, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";
import { useDesignStore } from "@/app/store/useDesignStore";
import { useAuthStore } from "@/app/store/useAuthStore";
import { useUpdateProfile } from "@/app/services/profile";
import { useGetLinks } from "@/app/services/links";
import { toast } from "sonner";

import ThemeSelector from "./components/ThemeSelector";
import AppearanceSection from "./components/AppearanceSection";
import ColorSection from "./components/ColorSection";
import TypographySection from "./components/TypographySection";
import ButtonStyleSection from "./components/ButtonStyleSection";
import LinkStyleSection from "./components/LinkStyleSection";
import SocialIconsSection from "./components/SocialIconsSection";
import DesignEditorLivePreview from "./components/DesignEditorLivePreview";

const CustomizeDesignPage = () => {
  const user = useAuthStore((state) => state.user);
  const { data: linksData } = useGetLinks();
  const { mutate: updateProfile } = useUpdateProfile();

  const draft = useDesignStore((state) => state.draft);
  const socialLinksDraft = useDesignStore((state) => state.socialLinksDraft);
  const saveStatus = useDesignStore((state) => state.saveStatus);
  const initFromUser = useDesignStore((state) => state.initFromUser);
  const markSaving = useDesignStore((state) => state.markSaving);
  const markSaved = useDesignStore((state) => state.markSaved);
  const markError = useDesignStore((state) => state.markError);

  const isInitializedRef = useRef(false);
  const saveTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Initialize from user data on mount
  useEffect(() => {
    if (user && !isInitializedRef.current) {
      initFromUser(user.design, user.socialLinks);
      isInitializedRef.current = true;
    }
  }, [user, initFromUser]);

  // Debounced autosave
  useEffect(() => {
    if (saveTimerRef.current) {
      clearTimeout(saveTimerRef.current);
    }

    saveTimerRef.current = setTimeout(() => {
      markSaving();

      updateProfile(
        {
          design: draft,
          socialLinks: socialLinksDraft,
        },
        {
          onSuccess: () => {
            markSaved();
            // Auto-dismiss success after 2 seconds
            setTimeout(() => {
              useDesignStore.setState({ saveStatus: "idle" });
            }, 2000);
          },
          onError: () => {
            markError();
            toast.error("Failed to save design changes");
          },
        }
      );
    }, 700);

    return () => {
      if (saveTimerRef.current) {
        clearTimeout(saveTimerRef.current);
      }
    };
  }, [draft, socialLinksDraft, updateProfile, markSaving, markSaved, markError]);

  const saveStatusMessage = {
    idle: "",
    saving: "Saving...",
    saved: "Saved",
    error: "Save failed",
  }[saveStatus];

  const saveStatusColor = {
    idle: "",
    saving: "text-gray-500",
    saved: "text-green-600",
    error: "text-red-600",
  }[saveStatus];

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Back link for mobile */}
      <div className="lg:hidden fixed top-0 left-0 right-0 bg-white border-b border-gray-200 p-4 z-40">
        <Link
          href="/dashboard"
          className="flex items-center gap-2 text-gray-700 hover:text-gray-900"
        >
          <ChevronLeft size={20} />
          <span className="text-sm font-medium">Back</span>
        </Link>
      </div>

      {/* Left: Customization Options (hidden on mobile) */}
      <div className="hidden lg:flex flex-col flex-1 px-10 py-8 overflow-y-auto">
        <div className="max-w-2xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">
                Design Your Profile
              </h1>
              <p className="text-gray-600 mt-1">
                Customize how your profile looks to visitors
              </p>
            </div>
            {saveStatusMessage && (
              <span className={`text-sm font-medium ${saveStatusColor}`}>
                {saveStatusMessage}
              </span>
            )}
          </div>

          <div className="space-y-8">
            <ThemeSelector />
            <AppearanceSection />
            <ColorSection />
            <TypographySection />
            <ButtonStyleSection />
            <LinkStyleSection />
            <SocialIconsSection />
          </div>
        </div>
      </div>

      {/* Mobile: Stacked Layout */}
      <div className="lg:hidden flex flex-col w-full pt-16">
        <div className="px-4 py-6 overflow-y-auto flex-1 pb-32">
          <h1 className="text-2xl font-bold text-gray-900 mb-1">
            Design Your Profile
          </h1>
          <p className="text-gray-600 mb-6">
            Customize how your profile looks to visitors
          </p>

          <div className="space-y-6">
            <ThemeSelector />
            <AppearanceSection />
            <ColorSection />
            <TypographySection />
            <ButtonStyleSection />
            <LinkStyleSection />
            <SocialIconsSection />
          </div>
        </div>

        {/* Mobile Preview */}
        <div className="border-t border-gray-200 bg-white px-4 py-6 pb-6">
          <p className="text-sm font-medium text-gray-700 mb-4">Preview</p>
          <DesignEditorLivePreview links={linksData?.data || []} />
        </div>
      </div>

      {/* Right: Live Preview (Desktop Only) */}
      <div className="hidden lg:flex flex-col border-l border-gray-200 w-96 bg-white px-6 py-8 sticky top-0 h-screen overflow-y-auto">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Preview</h2>
        <DesignEditorLivePreview links={linksData?.data || []} />
      </div>
    </div>
  );
};

export default CustomizeDesignPage;
