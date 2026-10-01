// src/components/dashboard/image-upload.tsx
"use client";

import { CldUploadWidget } from "next-cloudinary";
import { ImagePlus, X, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value: string[];
  onChange: (urls: string[]) => void;
  maxFiles?: number;
  folder?: string;
};

export function ImageUpload({
  value = [],
  onChange,
  maxFiles = 5,
  folder = "listings",
}: Props) {
  function handleSuccess(result: any) {
    if (result.info && typeof result.info !== "string") {
      const newUrl = result.info.secure_url;
      if (value.length < maxFiles) {
        onChange([...value, newUrl]);
      }
    }
  }

  function handleRemove(url: string) {
    onChange(value.filter((v) => v !== url));
  }

  return (
    <div className="space-y-4">
      {/* گالری تصاویر */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {value.map((url, idx) => (
            <div key={idx} className="relative group">
              <img
                src={url}
                alt={`تصویر ${idx + 1}`}
                className="w-full h-24 object-cover rounded-md border"
              />
              <button
                type="button"
                onClick={() => handleRemove(url)}
                className="absolute -top-2 -end-2 bg-destructive text-destructive-foreground rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}

      {/* دکمه آپلود */}
      {value.length < maxFiles && (
        <CldUploadWidget
          signatureEndpoint="/api/cloudinary/sign"
          uploadPreset={process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET}
          options={{
            folder,
            maxFiles: 1,
            sources: ["local", "url"],
            multiple: false,
          }}
          onSuccess={handleSuccess}
        >
          {({ open, isLoading }) => (
            <Button
              type="button"
              variant="outline"
              onClick={() => open()}
              disabled={isLoading}
              className="w-full"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 me-2 animate-spin" />
              ) : (
                <ImagePlus className="h-4 w-4 me-2" />
              )}
              افزودن تصویر ({value.length}/{maxFiles})
            </Button>
          )}
        </CldUploadWidget>
      )}
    </div>
  );
}