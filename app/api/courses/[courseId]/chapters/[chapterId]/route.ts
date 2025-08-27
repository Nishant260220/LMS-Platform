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
        const { courseId, chapterId } = await params;
        const userId = session?.user?.id;
        const {isPublished, ...values} = await req.json();

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

       

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });

        if(!ownCourse) {
             return new NextResponse("Unauthorized", { status: 401 });
        }

        
           const chapter = await db.chapter.update({
                where: {
                    id: chapterId
                },
                data: { 
                    ...values
                }
            });
        
        return NextResponse.json(chapter);
        //TODO: Handle Video Upload
        
    }catch (error){
        console.log("[COURSES_CHAPTER_ID]",error);
        return new NextResponse("Internal error", { status: 500 });
    }
}