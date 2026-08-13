import React from "react";
import { Edit2, Trash2 } from "lucide-react";

interface LinkGroupHeaderProps {
  groupName: string;
  linkCount: number;
  onRename: () => void;
  onDelete: () => void;
  isLoading?: boolean;
}

export default function LinkGroupHeader({
  groupName,
  linkCount,
  onRename,
  onDelete,
  isLoading,
}: LinkGroupHeaderProps) {
  return (
    <div className="flex items-center justify-between py-3 px-4 bg-gray-50 rounded-lg border border-gray-200">
      <div>
        <h3 className="font-semibold text-gray-900">{groupName}</h3>
        <p className="text-sm text-gray-600">{linkCount} link(s)</p>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={onRename}
          disabled={isLoading}
          className="p-2 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Rename group"
        >
          <Edit2 size={18} className="text-gray-600" />
        </button>
        <button
          onClick={onDelete}
          disabled={isLoading}
          className="p-2 hover:bg-red-100 rounded-lg transition-colors disabled:opacity-50"
          aria-label="Delete group"
        >
          <Trash2 size={18} className="text-red-600" />
        </button>
      </div>
    </div>
  );
}
