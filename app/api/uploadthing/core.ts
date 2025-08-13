import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "../auth/[...nextauth]/route";

const f = createUploadthing();

const handleAuth = async() => {
      const session = await getServerSession(authOptions);
      const user = session?.user?.name; 
      if (!user) throw new UploadThingError("Unauthorized");
      return { userId: user};
    }

export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
  courseAttachments: f(["audio", "pdf", "video", "image", "text"])
    .middleware(()=>handleAuth())
    .onUploadComplete(()=>{}),
  chapterVideo: f({video: {maxFileSize: "512GB", maxFileCount: 1}})  
  .middleware(()=>handleAuth())
  .onUploadComplete(()=>{})  
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;