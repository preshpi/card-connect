"use client";

import { useState, useCallback } from "react";
import Cropper from "react-easy-crop";
import { X, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

type CroppedAreaPixels = {
  x: number;
  y: number;
  width: number;
  height: number;
};

type ImageCropModalProps = {
  open: boolean;
  imageSrc: string;
  aspect?: number;
  cropShape?: "round" | "rect";
  onCropComplete: (croppedImage: string) => void;
  onClose: () => void;
};

export default function ImageCropModal({
  open,
  imageSrc,
  aspect = 1,
  cropShape = "round",
  onCropComplete,
  onClose,
}: ImageCropModalProps) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CroppedAreaPixels | null>(null);

  const onCropAreaChange = useCallback(
    (_croppedArea: CroppedAreaPixels, croppedAreaPixels: CroppedAreaPixels) => {
      setCroppedAreaPixels(croppedAreaPixels);
    },
    [],
  );

  const handleSaveCrop = async () => {
    if (!croppedAreaPixels) return;

    try {
      const image = new Image();
      image.src = imageSrc;

      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");

      if (!ctx) return;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
      );

      canvas.toBlob((blob) => {
        if (blob) {
          const croppedImageUrl = URL.createObjectURL(blob);
          onCropComplete(croppedImageUrl);
          onClose();
        }
      }, "image/jpeg");
    } catch (error) {
      console.error("Error cropping image:", error);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="w-full max-w-2xl bg-white rounded-2xl shadow-xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Adjust Your Photo</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Cropper */}
        <div className="relative w-full h-96 bg-black">
          <Cropper
            image={imageSrc}
            crop={crop}
            zoom={zoom}
            rotation={rotation}
            aspect={aspect}
            cropShape={cropShape}
            showGrid={false}
            onCropChange={setCrop}
            onCropAreaChange={onCropAreaChange}
            onZoomChange={setZoom}
            onRotationChange={setRotation}
          />
        </div>

        {/* Controls */}
        <div className="p-6 bg-gray-50 space-y-4">
          {/* Zoom */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Zoom
            </label>
            <div className="flex items-center gap-3">
              <ZoomOut size={20} className="text-gray-500" />
              <input
                type="range"
                min="1"
                max="3"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-1"
              />
              <ZoomIn size={20} className="text-gray-500" />
              <span className="text-sm text-gray-600 w-12">
                {zoom.toFixed(2)}x
              </span>
            </div>
          </div>

          {/* Rotation */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Rotation
            </label>
            <div className="flex items-center gap-3">
              <RotateCw size={20} className="text-gray-500" />
              <input
                type="range"
                min="0"
                max="360"
                step="1"
                value={rotation}
                onChange={(e) => setRotation(parseInt(e.target.value))}
                className="flex-1"
              />
              <span className="text-sm text-gray-600 w-12">{rotation}°</span>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="flex gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSaveCrop}
            className="flex-1 px-4 py-3 bg-[#7269E3] text-white font-medium rounded-lg hover:bg-[#5a52c8] transition-colors"
          >
            Save Photo
          </button>
        </div>
      </div>
    </div>
  );
}
