import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string; chapterId: string}>}
){
    try{
        const session = await getServerSession(authOptions);
        const { courseId, chapterId } = await params;
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

        const muxData = await db.muxData.findUnique({
            where: {
                chapterId: chapterId,
            }
        });

        if(!chapter || !muxData || !chapter.title || !chapter.description || !chapter.videoUrl){
            return new NextResponse("Missing required fields", { status: 400});
        }

        const publishedChater = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedChater);

    }catch (error){
        console.log("[CHAPTER_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}