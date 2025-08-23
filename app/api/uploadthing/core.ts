import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "../auth/[...nextauth]/route";

const f = createUploadthing();

const handleAuth = async (req: Request) => {
  console.log("Handling auth");
  const session = await getServerSession(authOptions);
  const user = session?.user?.id;
  if (!user) throw new UploadThingError("Unauthorized");
  return { userId: user };
};

export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({ req }) => {
      console.log("🔥 Middleware entered");
      return await handleAuth(req); // ✅ direct return awaited result
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for", file.name);
      return { ufsUrl: file.ufsUrl }; 
    }),
  courseAttachment: f(["audio", "pdf", "video", "image", "text"])
    .middleware(async ({ req }) => {
      console.log("🔥 Middleware entered");
      return await handleAuth(req); // ✅ direct return awaited result
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for", file.name);
      return { ufsUrl: file.ufsUrl }; 
    }),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(async ({ req }) => {
      console.log("🔥 Middleware entered");
      return await handleAuth(req); // ✅ direct return awaited result
    })
    .onUploadComplete(async ({ file }) => {
      console.log("Upload complete for", file.name);
      return { ufsUrl: file.ufsUrl }; 
    }),
    
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
