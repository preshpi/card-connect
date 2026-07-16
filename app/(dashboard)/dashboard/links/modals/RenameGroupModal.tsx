import React, { useEffect, useState } from "react";
import { X } from "lucide-react";

interface RenameGroupModalProps {
  open: boolean;
  currentName: string;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (name: string) => void;
}

export default function RenameGroupModal({
  open,
  currentName,
  isLoading,
  onClose,
  onSubmit,
}: RenameGroupModalProps) {
  const [groupName, setGroupName] = useState(currentName);

  useEffect(() => {
    setGroupName(currentName);
  }, [currentName, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (groupName.trim() && groupName !== currentName) {
      onSubmit(groupName);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Rename Group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-2">
              Group Name
            </label>
            <input
              type="text"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#7269E3]/20"
              maxLength={100}
              autoFocus
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={
                !groupName.trim() || groupName === currentName || isLoading
              }
              className="px-4 py-2 bg-[#7269E3] text-white rounded-lg hover:bg-[#5a52c8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
