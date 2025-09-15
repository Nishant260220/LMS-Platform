"use client";

import { UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps {
  onChange: (url?: string) => void;
  endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({ onChange, endpoint }: FileUploadProps) => {
  console.log("FileUploaderComponent");
  return (
    <UploadDropzone
      endpoint={endpoint}
      onClientUploadComplete={(res) => {
        console.log("✅ Upload complete response:", res);
        console.log(res?.[0].ufsUrl, res?.[0].name)
        onChange(res?.[0].ufsUrl);
      }}
      onUploadError={(error: Error) => {
        toast.error(`${error?.message}`);
      }}
      className="w-full h-80"
    />
  );
};
