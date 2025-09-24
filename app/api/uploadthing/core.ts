import { getServerSession } from "next-auth";
import { createUploadthing, type FileRouter } from "uploadthing/next";
import { UploadThingError } from "uploadthing/server";
import { authOptions } from "../auth/[...nextauth]/route";
import { isTeacher } from "@/lib/teacher";

const f = createUploadthing();

const handleAuth = async () => {
  console.log("Handling auth");
  const session = await getServerSession(authOptions);
  const userId = session?.user?.id;
  const isAuthorized = isTeacher(userId);
  if (!userId || !isAuthorized) throw new UploadThingError("Unauthorized");
  return { userId: userId };
};

export const ourFileRouter = {
  courseImage: f({
    image: { maxFileSize: "4MB", maxFileCount: 1 },
  })
    .middleware(async ({}) => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for", metadata.userId);
      console.log("file url", file.ufsUrl);
    }),
  courseAttachment: f(["audio", "pdf", "video", "image", "text"])
    .middleware(async ({}) => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for", metadata.userId);
      console.log("file url", file.ufsUrl);
    }),
  chapterVideo: f({ video: { maxFileCount: 1, maxFileSize: "512GB" } })
    .middleware(async ({}) => await handleAuth())
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("Upload complete for", metadata.userId);
      console.log("file url", file.ufsUrl);
    }),
} satisfies FileRouter;

export type OurFileRouter = typeof ourFileRouter;
