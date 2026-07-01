import { LinkItem } from "@/app/types/links";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import React from "react";

type PreviewLinkModalProps = {
  show: boolean;
  setShowPreviewModal: (show: boolean) => void;
  profileImage?: string | null;
  fullName?: string;
  bio?: string;
  initial?: string;
  setShowShareProfileModal: (show: boolean) => void;
  links?: LinkItem[];
  username?: string;
  openShareLinkModal: (link: LinkItem) => void;
};

const PreviewLinkModal = ({
  setShowPreviewModal,
  profileImage,
  fullName,
  bio,
  username,
  links,
  openShareLinkModal,
  initial,
  setShowShareProfileModal,
}: PreviewLinkModalProps) => {
  return (
    <div>
      <div className="fixed inset-0 z-50 bg-gray-50 md:hidden flex flex-col">
        {/* Top Navigation */}
        <div className="bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-10">
          <button
            onClick={() => setShowPreviewModal(false)}
            className="text-gray-900 hover:bg-gray-100 p-2 rounded-lg transition-colors"
            aria-label="Back"
          >
            <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
              <path
                d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12l4.58-4.59z"
                fill="currentColor"
              />
            </svg>
          </button>

          <div className="flex-1 text-center px-4">
            <p className="text-sm font-semibold text-gray-900 truncate">
              cardconnect/{username || "username"}
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              className="text-gray-600 hover:bg-gray-100 p-2 rounded-lg transition-colors"
              aria-label="Share"
              onClick={() => setShowShareProfileModal(true)}
            >
              <svg width="24" height="24" fill="none" viewBox="0 0 24 24">
                <path
                  d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.15c.52.47 1.2.77 1.96.77 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92 1.61 0 2.92-1.31 2.92-2.92s-1.31-2.92-2.92-2.92z"
                  fill="currentColor"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Preview Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="flex flex-col items-center gap-6 p-6 pt-8">
            {/* Profile Section */}
            <div className="w-24 h-24 rounded-full bg-gray-200 overflow-hidden flex items-center justify-center">
              {profileImage ? (
                <Image
                  src={profileImage}
                  alt={fullName || "Profile Image"}
                  width={100}
                  height={100}
                  className="w-full h-full object-cover"
                />
              ) : (
                <span className="text-2xl font-semibold text-gray-600">
                  {initial}
                </span>
              )}
            </div>

            <div className="text-center">
              <p className="font-semibold text-gray-900 text-lg">{fullName}</p>
              <p className="text-sm text-gray-600">{bio}</p>
            </div>

            {/* Links Section */}
            <div className="w-full space-y-3 max-w-sm">
              {links?.map((link: LinkItem) => (
                <div
                  key={`preview-${link.id || `${link.title}-${link.url}`}`}
                  className="w-full rounded-xl bg-white border border-gray-200 px-4 py-4 text-gray-900 shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 flex-1 min-w-0">
                      {link.icon ? (
                        <Image
                          src={link.icon}
                          alt={link.title}
                          width={24}
                          height={24}
                          className="rounded object-cover shrink-0"
                        />
                      ) : null}
                      <span className="truncate text-sm font-medium">
                        {link.title}
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => openShareLinkModal(link)}
                      aria-label={`Share ${link.title}`}
                      className="rounded p-1 hover:bg-gray-100 shrink-0 transition-colors"
                    >
                      <MoreVertical size={18} color="#6B7280" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PreviewLinkModal;
