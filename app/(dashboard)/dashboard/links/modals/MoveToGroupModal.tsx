import React, { useEffect, useState } from "react";
import { X } from "lucide-react";
import { LinkGroup } from "@/app/types/links";

interface MoveToGroupModalProps {
  open: boolean;
  linkTitle: string;
  groups: LinkGroup[];
  selectedGroupId: string | undefined;
  isLoading?: boolean;
  onClose: () => void;
  onSubmit: (groupId: string | null) => void;
}

export default function MoveToGroupModal({
  open,
  linkTitle,
  groups,
  selectedGroupId,
  isLoading,
  onClose,
  onSubmit,
}: MoveToGroupModalProps) {
  const [groupId, setGroupId] = useState<string | null>(
    selectedGroupId || null
  );

  useEffect(() => {
    setGroupId(selectedGroupId || null);
  }, [selectedGroupId, open]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(groupId);
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Move Link</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <p className="text-sm text-gray-900 mb-4">
              Moving: <span className="font-medium">{linkTitle}</span>
            </p>

            <label className="block text-sm font-medium text-gray-900 mb-2">
              Group
            </label>
            <select
              value={groupId || ""}
              onChange={(e) => setGroupId(e.target.value || null)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-[#7269E3]/20"
            >
              <option value="">No Group (Ungrouped)</option>
              {groups.map((group) => (
                <option key={group.id} value={group.id}>
                  {group.name}
                </option>
              ))}
            </select>
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
              disabled={isLoading}
              className="px-4 py-2 bg-[#7269E3] text-white rounded-lg hover:bg-[#5a52c8] disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Moving..." : "Move"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
