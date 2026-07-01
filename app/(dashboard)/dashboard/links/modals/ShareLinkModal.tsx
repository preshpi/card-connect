import Image from "next/image";
import { Link as LinkIcon, X } from "lucide-react";
import {
  EmailIcon,
  EmailShareButton,
  FacebookIcon,
  FacebookShareButton,
  LinkedinIcon,
  LinkedinShareButton,
  RedditIcon,
  RedditShareButton,
  TelegramIcon,
  TelegramShareButton,
  TwitterIcon,
  TwitterShareButton,
  WhatsappIcon,
  WhatsappShareButton,
} from "react-share";

type ShareLinkModalProps = {
  open: boolean;
  title: string;
  url: string;
  coverImage: string;
  onClose: () => void;
  onCopy: () => void;
};

const ShareLinkModal = ({
  open,
  title,
  url,
  coverImage,
  onClose,
  onCopy,
}: ShareLinkModalProps) => {
  if (!open) return null;

  const shareTitle = `Check out ${title}`;

  const socialButtons = [
    {
      key: "twitter",
      label: "X",
      node: (
        <TwitterShareButton url={url} title={shareTitle}>
          <TwitterIcon size={56} round />
        </TwitterShareButton>
      ),
    },
    {
      key: "facebook",
      label: "Facebook",
      node: (
        <FacebookShareButton url={url} hashtag="#CardConnect">
          <FacebookIcon size={56} round />
        </FacebookShareButton>
      ),
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      node: (
        <WhatsappShareButton url={url} title={shareTitle}>
          <WhatsappIcon size={56} round />
        </WhatsappShareButton>
      ),
    },
    {
      key: "linkedin",
      label: "LinkedIn",
      node: (
        <LinkedinShareButton url={url} title={shareTitle}>
          <LinkedinIcon size={56} round />
        </LinkedinShareButton>
      ),
    },
    {
      key: "telegram",
      label: "Telegram",
      node: (
        <TelegramShareButton url={url} title={shareTitle}>
          <TelegramIcon size={56} round />
        </TelegramShareButton>
      ),
    },
    {
      key: "reddit",
      label: "Reddit",
      node: (
        <RedditShareButton url={url} title={shareTitle}>
          <RedditIcon size={56} round />
        </RedditShareButton>
      ),
    },
    {
      key: "email",
      label: "Email",
      node: (
        <EmailShareButton
          url={url}
          subject={shareTitle}
          body={`Check this out: ${url}`}
        >
          <EmailIcon size={56} round />
        </EmailShareButton>
      ),
    },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-lg rounded-2xl bg-white p-5 shadow-xl md:p-6">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-xl font-semibold text-[#1D1F2C]">Share link</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close share modal"
            className="rounded p-1 text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-800"
          >
            <X size={22} />
          </button>
        </div>

        <div className="mb-5 overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 p-4">
          <div className="mx-auto mb-3 h-full w-full max-w-40 overflow-hidden">
            <Image
              src={coverImage}
              alt={title}
              width={200}
              height={100}
              className="h-full w-full object-cover"
              unoptimized
            />
          </div>
          <p className="text-center text-2xl font-bold leading-tight text-[#1D1F2C]">
            {title}
          </p>
          <div className="mt-2 overflow-x-auto">
            <p className="whitespace-nowrap text-center text-sm text-gray-600">
              {url}
            </p>
          </div>
        </div>

        <div className="flex items-start gap-4 overflow-x-auto pb-1">
          <div className="min-w-18.5 text-center">
            <button
              type="button"
              onClick={onCopy}
              className="mx-auto mb-2 flex h-14 w-14 items-center justify-center rounded-full bg-gray-200 text-gray-700 transition-colors hover:bg-gray-300"
            >
              <LinkIcon size={24} />
            </button>
            <p className="text-sm text-gray-800">Copy link</p>
          </div>

          {socialButtons.map((item) => (
            <div key={item.key} className="min-w-18.5 text-center">
              <div className="mx-auto mb-2 h-14 w-14">{item.node}</div>
              <p className="text-sm text-gray-800">{item.label}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ShareLinkModal;
