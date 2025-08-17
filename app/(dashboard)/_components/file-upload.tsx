"use client";

import { UploadButton, UploadDropzone } from "@/lib/uploadthing";
import { ourFileRouter } from "@/app/api/uploadthing/core";
import toast from "react-hot-toast";

interface FileUploadProps{
    onChange: (url?: string)=> void,
    endpoint: keyof typeof ourFileRouter;
}

export const FileUpload = ({onChange, endpoint}: FileUploadProps) => {
    return (
        <UploadDropzone
         endpoint={endpoint}
         onClientUploadComplete={(res)=>{
            console.log("res:..........................",res?.[0].ufsUrl);
            onChange(res?.[0].ufsUrl);
         }}
         onUploadError={(error: Error) => {
            toast.error(`${error?.message}`);
         }}
         className="w-full h-80"
        />
    )
}