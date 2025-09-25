import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string; chapterId: string}} 
){
    try{
        const session = await getServerSession(authOptions);
        const { courseId, chapterId } = params;
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

        const unPublishedChapter = await db.chapter.update({
            where: {
                id: chapterId,
                courseId: courseId
            },
            data: {
                isPublished: false,
            }
        });

        const publishedChaptersInCourse = await db.chapter.findMany({
            where: {
                courseId: courseId,
                isPublished: true,
            }
        });

        if(!publishedChaptersInCourse.length){
            await db.course.update({
                where: {
                    id: courseId,
                },
                data: {
                    isPublished: false,
                }
            });
        }

        return NextResponse.json(unPublishedChapter);

    }catch (error){
        console.log("[CHAPTER_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}