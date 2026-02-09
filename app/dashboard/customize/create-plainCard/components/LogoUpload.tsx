"use client";

import React, { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X } from "lucide-react";
import Image from "next/image";

interface LogoUploadProps {
  value: any;
  onChange: (file: File | null) => void;
}

export const LogoUpload = ({ value, onChange }: LogoUploadProps) => {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length > 0) {
        onChange(acceptedFiles[0]);
      }
    },
    [onChange],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [".jpeg", ".jpg", ".png", ".svg"] },
    multiple: false,
  });

  const removeFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(null);
  };

  return (
    <div className="animate-in fade-in slide-in-from-top-2 duration-200">
      <label className="block text-sm font-bold mb-2 text-gray-700">
        Upload Logo
      </label>

      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-xl p-8 flex flex-col items-center justify-center transition-all cursor-pointer
          ${isDragActive ? "border-indigo-500 bg-indigo-50" : "border-gray-200 bg-gray-50 hover:bg-gray-100"}`}
      >
        <input {...getInputProps()} />

        {value ? (
          <div className="relative group">
            <div className="w-20 h-20 relative rounded-lg overflow-hidden border bg-white">
              <Image
                src={value instanceof File ? URL.createObjectURL(value) : value}
                alt="Logo Preview"
                fill
                className="object-contain p-2"
              />
            </div>
            <button
              onClick={removeFile}
              className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 shadow-md hover:bg-red-600 transition-colors"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <>
            <div className="w-10 h-10 bg-white rounded-lg shadow-sm flex items-center justify-center mb-3">
              <Upload size={20} className="text-gray-400" />
            </div>
            <p className="text-xs text-gray-500 max-w-[200px] text-center">
              {isDragActive
                ? "Drop the file here"
                : "Drag and drop or choose a file to upload. All JPG, SVG and PNG are supported."}
            </p>
          </>
        )}
      </div>
    </div>
  );
};
