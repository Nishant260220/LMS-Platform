import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ courseId: string }>}
){
    try{
        const session = await getServerSession(authOptions);
        const { courseId} = await params;
        const userId = session?.user?.id;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401});
        }

        const course = await db.course.findUnique({
            where: {
                id: courseId,
                userId,
            },
            include: {
                chapters: {
                    include: {
                        muxData: true,
                    }
                }
            }
        });

        if(!course){
            return new NextResponse("Not found", { status: 404});
        }

        const hasPublishChapter = course.chapters.some((chapter) => chapter.isPublished);

        if(!course.title || !course.description || !course.imageURL || !course.categoryId || !hasPublishChapter){
            return new NextResponse("Missing required fields", { status: 401});
        }

        const publishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: true,
            }
        });

        return NextResponse.json(publishedCourse);

    }catch (error){
        console.log("[COURSE_ID_PUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}