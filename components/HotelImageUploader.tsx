"use client";

import { UploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

export default function HotelImageUploader({ onUploadAction }: { onUploadAction: (url: string) => void }) {
  return (
    <UploadButton<OurFileRouter, "imageUploader">
      endpoint="imageUploader"
      onClientUploadComplete={(res) => {
        console.log('Upload complete:', res);
        if (res && res[0]?.url) {
          console.log('Image URL:', res[0].url);
          onUploadAction(res[0].url);
        }
      }}
      onUploadError={(error) => {
        console.error('Upload error:', error);
        console.error('Error message:', error.message);
        console.error('Error code:', error.code);
        alert(`Upload failed: ${error.message}`);
      }}
      onUploadBegin={() => {
        console.log('Upload starting...');
      }}
    />
  );
}