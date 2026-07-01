import { X } from "lucide-react";

type InstructionalModalProps = {
  open: boolean;
  platform: string;
  profileUrl: string;
  onClose: () => void;
  onCopy: () => void;
};

const InstructionalModal = ({
  open,
  platform,
  profileUrl,
  onClose,
  onCopy,
}: InstructionalModalProps) => {
  if (!open) return null;

  const instructions: Record<
    string,
    { steps: string[]; color: string; action: string }
  > = {
    Instagram: {
      steps: [
        "Open the Instagram app on your mobile device",
        "Go to your profile and tap Edit profile",
        "Scroll to the Website field in your bio section",
        "Paste your Card Connect profile link",
        "Tap Done to save changes",
        "Verify your link works by tapping it from your bio",
      ],
      color: "from-purple-500 via-pink-500 to-red-500",
      action: "instagram.com/accounts/edit",
    },
    TikTok: {
      steps: [
        "Open TikTok and navigate to your profile",
        "Tap Edit profile from your profile page",
        "Find the Links section (available for 1,000+ followers or Business accounts)",
        "Tap Add link and paste your Card Connect profile URL",
        "Complete the steps to add your link",
        "Save and test your link from your bio",
      ],
      color: "bg-black",
      action: "tiktok.com",
    },
    YouTube: {
      steps: [
        "Go to your YouTube channel and click your profile picture",
        "Select Customize channel from the menu",
        "Click the About tab on your channel",
        "In the Links section, click Add link and paste your Card Connect URL",
        "Save your changes",
        "Test the link from your channel about section",
      ],
      color: "bg-red-600",
      action: "youtube.com",
    },
    X: {
      steps: [
        "Log in to your X account",
        "Click on your profile icon and select Settings and privacy",
        "Go to Account settings and click Profile",
        "Click on the Website field under your bio",
        "Paste your Card Connect profile link",
        "Save changes and verify the link works",
      ],
      color: "bg-black",
      action: "x.com/settings/profile",
    },
  };

  const config = instructions[platform];

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 px-2 md:items-center">
      <div className="w-full max-w-md rounded-t-3xl md:rounded-3xl bg-white p-6 shadow-xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{platform}</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="rounded-full p-2 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={24} />
          </button>
        </div>

        {/* Instructions */}
        <div className="mb-6">
          <p className="text-sm font-semibold text-gray-600 mb-4 uppercase tracking-wide">
            How to add your profile
          </p>
          <ol className="space-y-3">
            {config.steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-gray-100 text-xs font-semibold text-gray-700">
                  {index + 1}
                </span>
                <span className="text-sm text-gray-700 pt-0.5">{step}</span>
              </li>
            ))}
          </ol>
        </div>

        {/* Copy Link Section */}
        <div className="mb-6">
          <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">
            Your profile link
          </p>
          <div className="flex items-center gap-2 rounded-xl border border-gray-300 px-4 py-3 bg-gray-50">
            <input
              type="text"
              value={profileUrl}
              readOnly
              className="flex-1 text-sm text-gray-900 font-mono bg-transparent outline-none"
            />
            <button
              type="button"
              onClick={onCopy}
              className="shrink-0 rounded-lg bg-gray-900 text-white px-3 py-2 text-xs font-semibold transition-colors hover:bg-gray-800"
            >
              Copy
            </button>
          </div>
        </div>

        {/* Go to Platform Button */}
        <a
          href={`https://${config.action}`}
          target="_blank"
          rel="noopener noreferrer"
          className="w-full flex items-center justify-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-900 font-semibold py-3 px-6 rounded-xl transition-colors"
        >
          Go to {platform}
          <svg width="20" height="20" fill="none" viewBox="0 0 24 24">
            <path
              d="M7 17L17 7M17 7H7M17 7V17"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </a>
      </div>
    </div>
  );
};

export default InstructionalModal;
