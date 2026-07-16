import React from "react";
import { AlertTriangle, X } from "lucide-react";

interface DeleteGroupModalProps {
  open: boolean;
  groupName: string;
  isLoading?: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteGroupModal({
  open,
  groupName,
  isLoading,
  onClose,
  onConfirm,
}: DeleteGroupModalProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-md shadow-lg">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-lg font-semibold text-gray-900">Delete Group</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-600" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex gap-3">
            <div className="flex-shrink-0">
              <AlertTriangle className="text-red-500" size={24} />
            </div>
            <div>
              <p className="font-medium text-gray-900">
                Delete "{groupName}"?
              </p>
              <p className="text-sm text-gray-700 mt-1">
                Links in this group will be ungrouped. This action cannot be
                undone.
              </p>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
              disabled={isLoading}
              className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? "Deleting..." : "Delete"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
