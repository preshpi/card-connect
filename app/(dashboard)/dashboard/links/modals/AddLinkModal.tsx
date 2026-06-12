type AddLinkModalProps = {
  open: boolean;
  titleInput: string;
  urlInput: string;
  iconPreview: string;
  fileInputKey: number;
  isCreatingLink: boolean;
  onTitleChange: (value: string) => void;
  onUrlChange: (value: string) => void;
  onIconFileChange: (file: File | null) => void;
  onClose: () => void;
  onSubmit: () => void;
};

const AddLinkModal = ({
  open,
  titleInput,
  urlInput,
  iconPreview,
  fileInputKey,
  isCreatingLink,
  onTitleChange,
  onUrlChange,
  onIconFileChange,
  onClose,
  onSubmit,
}: AddLinkModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-7">
        <h2 className="mb-2 text-xl font-semibold text-[#1D1F2C]">Add Link</h2>
        <p className="mb-6 text-sm text-gray-600">
          Add the link title and URL. We will automatically use a thumbnail from
          the link domain.
        </p>

        <div className="space-y-4">
          <div>
            <label
              htmlFor="link-title"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Title
            </label>
            <input
              id="link-title"
              value={titleInput}
              onChange={(event) => onTitleChange(event.target.value)}
              placeholder="LinkedIn"
              disabled={isCreatingLink}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]/20"
            />
          </div>

          <div>
            <label
              htmlFor="link-url"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              URL
            </label>
            <input
              id="link-url"
              value={urlInput}
              onChange={(event) => onUrlChange(event.target.value)}
              placeholder="https://linkedin.com/in/username"
              disabled={isCreatingLink}
              className="w-full rounded-xl border border-gray-300 px-4 py-2.5 text-sm text-gray-800 focus:border-[#111827] focus:outline-none focus:ring-2 focus:ring-[#111827]/20"
            />
          </div>

          <div>
            <label
              htmlFor="link-icon"
              className="mb-1.5 block text-sm font-medium text-gray-700"
            >
              Upload Icon (Optional)
            </label>
            <input
              key={fileInputKey}
              id="link-icon"
              type="file"
              accept="image/*"
              disabled={isCreatingLink}
              onChange={(event) =>
                onIconFileChange(event.target.files?.[0] || null)
              }
              className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm text-gray-700 file:mr-3 file:rounded-md file:border-0 file:bg-gray-100 file:px-3 file:py-1.5 file:text-gray-800"
            />
            {iconPreview ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={iconPreview}
                alt="Uploaded icon preview"
                className="mt-3 h-12 w-12 rounded object-cover border border-gray-200"
              />
            ) : null}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isCreatingLink}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onSubmit}
            disabled={isCreatingLink}
            className="flex-1 rounded-xl bg-[#111827] px-4 py-2.5 font-medium text-white transition-colors hover:bg-black disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isCreatingLink ? "Creating..." : "Create Link"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AddLinkModal;
