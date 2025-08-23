"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter, OurFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof OurFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  console.log("FileUploaderComponent");
  return (
    <UploadDropzone
      endpoint={endpoint}
      onUploadBegin={(name) => {
        console.log("🚀 Upload started for:", name);
      }}
      onClientUploadComplete={(res) => {
        console.log("✅ Upload complete response:", res);
        /*  console.log("res:..",res?.[0].url);
            onChange(res?.[0].ufsUrl); */
        const fileUrl = res?.[0]?.ufsUrl ?? res?.[0]?.url; // ✅ new field pehle, fallback purana
        console.log("File uploaded at:", fileUrl);
        onChange(fileUrl);
      }}
      onUploadError={(error: Error) => {
        console.error("❌ Upload error:", error);
        toast.error(`${error?.message}`);
      }}
      className="w-full h-80"
    />
  );
};
