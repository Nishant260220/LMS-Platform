import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string }} 
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
        });

        if(!course){
            return new NextResponse("Not found", { status: 404});
        }

        const unPublishedCourse = await db.course.update({
            where: {
                id: courseId,
                userId,
            },
            data: {
                isPublished: false,
            }
        });

        return NextResponse.json(unPublishedCourse);

    }catch (error){
        console.log("[COURSE_ID_UNPUBLISH]", error);
        return new NextResponse("Internal Error", { status: 500 });
    }
}