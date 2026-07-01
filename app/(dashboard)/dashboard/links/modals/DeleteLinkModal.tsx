type DeleteLinkModalProps = {
  open: boolean;
  isDeletingLink: boolean;
  onClose: () => void;
  onConfirm: () => void;
};

const DeleteLinkModal = ({
  open,
  isDeletingLink,
  onClose,
  onConfirm,
}: DeleteLinkModalProps) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl md:p-7">
        <h2 className="mb-2 text-xl font-semibold text-[#1D1F2C]">
          Delete Link
        </h2>
        <p className="mb-6 text-sm text-gray-600">
          Are you sure you want to delete this link? This action cannot be
          undone.
        </p>

        <div className="mt-2 flex items-center gap-3">
          <button
            onClick={onClose}
            disabled={isDeletingLink}
            className="flex-1 rounded-xl bg-gray-100 px-4 py-2.5 font-medium text-gray-700 transition-colors hover:bg-gray-200 disabled:cursor-not-allowed disabled:opacity-60"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            disabled={isDeletingLink}
            className="flex-1 rounded-xl bg-[#BF010A] px-4 py-2.5 font-medium text-white transition-colors hover:bg-[#8F0008] disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isDeletingLink ? "Deleting..." : "Delete"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteLinkModal;
