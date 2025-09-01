import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const { courseId, chapterId } = await params;
    const userId = session?.user?.id;
    const { isPublished, ...values } = await req.json();

    if (!userId) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId: userId,
      },
    });

    if (!ownCourse) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const chapter = await db.chapter.update({
      where: {
        id: chapterId,
      },
      data: {
        ...values,
      },
    });

    if(values.videoUrl){
        const existingMuxData = await db.maxData.findFirst({
             where: {
                chapterId: chapterId,
            }
        });

        if(existingMuxData){
            await video.assets.delete(existingMuxData.assetId);
            await db.maxData.delete({
                where: {
                    id: existingMuxData.id,
                }
            })
        }

        const asset = await video.assets.create({
           inputs: [
                {
                    url: values.videoUrl,
                }
           ],
           playback_policies: ["public"],
           test: false,
        });

        await db.maxData.create({
            data: {
                chapterId: chapterId,
                assetId: asset.id,
                playbackId: asset.playback_ids?.[0]?.id,
            }
        });
    }


    return NextResponse.json(chapter);
  } catch (error) {
    console.log("[COURSES_CHAPTER_ID]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}
