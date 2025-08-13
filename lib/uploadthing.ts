import { generateUploadDropzone, generateUploadButton } from "@uploadthing/react";
import type { OurFileRouter } from "@/app/api/uploadthing/core";

// Dropzone component (drag & drop style)
export const UploadDropzone = generateUploadDropzone<OurFileRouter>();

// Simple button component (click-to-upload)
export const UploadButton = generateUploadButton<OurFileRouter>();