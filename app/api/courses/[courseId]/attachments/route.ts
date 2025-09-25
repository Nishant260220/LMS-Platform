import { authOptions } from "@/lib/auth";
import db from "@/lib/db";
import { isTeacher } from "@/lib/teacher";
import { getServerSession } from "next-auth"
import { NextResponse } from "next/server"

export async function POST(req: Request, {params}: {params: {courseId: string}}){

    try{
        const session = await getServerSession(authOptions);
        const { url } = await req.json();
        const { courseId } = params;
        const userId = session?.user?.id;

        if(!userId){
            return new NextResponse("Unauthorised", {status: 401})
        }

        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        })

        if(!courseOwner){
            return new NextResponse("Unauthorized", {status: 401})
        }
         
        const attachment = await db.attachment.create({
            data: {
                url,
                name: url.split("/").pop(),
                courseId: courseId,
            }
        });

        return NextResponse.json(attachment);
        

    }catch(error){
        console.log("COURSE-ID_ATTACHMENTS", error)
        return new NextResponse("Internal Error", {status: 500})
    }
}