"use client";

import Image from "next/image";
import { Link as LinkIcon, X } from "lucide-react";
import {
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  TelegramIcon,
  TelegramShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";
import { toast } from "sonner";
import { useState } from "react";
import InstructionalModal from "./InstructionalModal";

type ShareProfileModalProps = {
  open: boolean;
  profileUrl: string;
  fullName: string;
  onClose: () => void;
  onCopy: () => void;
  username?: string;
};
export default function ShareProfileModal({
  open,
  username,
  profileUrl,
  fullName,
  onClose,
  onCopy,
}: ShareProfileModalProps) {
  const [instructionalModal, setInstructionalModal] = useState<string | null>(
    null,
  );

  const shareTitle = `Check out my link in bio - ${fullName}`;
  const shareMessage = `Check out my profile on Card Connect: ${profileUrl}`;

  const socialPlatforms = [
    {
      label: "Instagram",
      icon: "/assets/socials/instagram.svg",
      onClick: () => setInstructionalModal("Instagram"),
    },
    {
      label: "TikTok",
      icon: "/assets/socials/tiktok.svg",
      onClick: () => setInstructionalModal("TikTok"),
    },
    {
      label: "YouTube",
      icon: "/assets/socials/youtube.svg",
      onClick: () => setInstructionalModal("YouTube"),
    },
    {
      label: "X",
      icon: "/assets/socials/x.svg",
      onClick: () => setInstructionalModal("X"),
    },
    {
      label: "WhatsApp",
      node: (
        <WhatsappShareButton url={profileUrl} title={shareMessage}>
          <WhatsappIcon size={50} round />
        </WhatsappShareButton>
      ),
    },
    {
      label: "Facebook",
      node: (
        <FacebookShareButton url={profileUrl} hashtag="#CardConnect">
          <FacebookIcon size={50} round />
        </FacebookShareButton>
      ),
    },
    {
      label: "LinkedIn",
      node: (
        <LinkedinShareButton url={profileUrl} title={shareTitle}>
          <LinkedinIcon size={50} round />
        </LinkedinShareButton>
      ),
    },
    {
      label: "Telegram",
      node: (
        <TelegramShareButton url={profileUrl} title={shareMessage}>
          <TelegramIcon size={50} round />
        </TelegramShareButton>
      ),
    },
  ];

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-2 md:items-center">
        <div className="w-full max-w-md rounded-t-3xl md:rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
          {/* Header */}
          <div className="mb-6 flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-900">Share</h2>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close share modal"
                className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
              >
                <X size={24} />
              </button>
            </div>
          </div>

          {/* Copy Link Section */}
          <div className="mb-8">
            <div className="flex items-center gap-3 rounded-xl border border-gray-300 px-4 py-3 bg-white">
              <LinkIcon size={20} className="text-gray-600 shrink-0" />
              <input
                type="text"
                value={profileUrl}
                readOnly
                className="flex-1 text-sm text-gray-900 font-medium bg-transparent outline-none"
              />
              <button
                type="button"
                onClick={onCopy}
                className="shrink-0 rounded-lg bg-gray-900 text-white px-4 py-2 text-sm font-semibold transition-colors hover:bg-gray-800"
              >
                Copy
              </button>
            </div>
          </div>

          {/* My Platforms Section */}
          <div>
            <h3 className="mb-4 text-lg font-bold text-gray-900">
              My platforms
            </h3>
            <div className="grid grid-cols-4 gap-4">
              {socialPlatforms.map((platform) => (
                <div
                  key={platform.label}
                  className="flex flex-col items-center text-center"
                >
                  {platform.node ? (
                    <div className="mb-2">{platform.node}</div>
                  ) : (
                    <button
                      type="button"
                      onClick={platform.onClick}
                      className="mb-2 flex h-16 w-16 items-center justify-center  transition-colors group"
                    >
                      <Image
                        src={platform.icon || ""}
                        alt={platform.label}
                        width={50}
                        height={50}
                        className="group-hover:scale-110 transition-transform rounded-full object-cover"
                      />
                    </button>
                  )}
                  <p className="text-xs font-medium text-gray-800">
                    {platform.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Instructional Modals */}
      {instructionalModal && (
        <InstructionalModal
          open={true}
          platform={instructionalModal}
          profileUrl={profileUrl}
          onClose={() => setInstructionalModal(null)}
          onCopy={() => {
            navigator.clipboard.writeText(profileUrl);
            toast.success("Link copied!");
          }}
        />
      )}
    </>
  );
}
