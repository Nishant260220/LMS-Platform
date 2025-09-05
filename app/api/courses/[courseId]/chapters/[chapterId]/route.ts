import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import Mux from "@mux/mux-node";

const { video } = new Mux({
  tokenId: process.env.MUX_TOKEN_ID!,
  tokenSecret: process.env.MUX_TOKEN_SECRET!,
});

export async function DELETE(
   req: Request,
  { params }: { params: { courseId: string; chapterId: string } }
){
  try{
    const session = await getServerSession(authOptions);
    const { courseId, chapterId} = await params;
    const userId = session?.user?.id;

    if(!userId){
      return new NextResponse("Unauthorized", { status: 401});
    }

    const ownCourse = await db.course.findUnique({
      where: {
        id: courseId,
        userId
      }
    });

    if(!ownCourse){
      return new NextResponse("Unauthorized", { status: 401});
    }

    const chapter = await db.chapter.findUnique({
      where: {
        id: chapterId,
        courseId: courseId,
      }
    });

    if(!chapter){
      return new NextResponse("Not found", { status: 404});
    }

    if(chapter.videoUrl){
      const existingMuxData = await db.muxData.findFirst({
        where: {
          chapterId: chapterId,
        }
      });

      if(existingMuxData){
        await video.assets.delete(existingMuxData.assetId);
        await db.muxData.delete({
          where: {
            id: existingMuxData.id,
          }
        });
      }
    }

    const deletedChapter = await db.chapter.delete({
      where: {
        id: chapterId,
      }
    }) ;

    const publishChaptersInCourse = await db.chapter.findMany({
      where: {
        courseId: courseId,
        isPublished: true,
      }
    });

    if(!publishChaptersInCourse.length){
      await db.course.update({
        where: {
          id: courseId,
        },
        data: {
          isPublished: false,
        }
      });
    }

    return NextResponse.json(deletedChapter);

  }catch (error){
    console.log("[CHAPTER_ID_DELETE",error);
    return new NextResponse("Internal Error", { status: 500});
  }
}
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
        const existingMuxData = await db.muxData.findFirst({
             where: {
                chapterId: chapterId,
            }
        });

        if(existingMuxData){
            await video.assets.delete(existingMuxData.assetId);
            await db.muxData.delete({
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

        await db.muxData.create({
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
