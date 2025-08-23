import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

export async function Delete(
    req: Request,
    { params }: {params: {courseId: string, attachmentId: string}}
){
    try{
        const session = await getServerSession(authOptions);
        const userId = session?.user?.id;
        const { courseId } = await params;
        const { attachmentId } = await params;
        if(!session?.user){
            return new NextResponse("Unauthorised", { status: 401})
        }
        const courseOwner = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId,
            }
        })
        if(!courseOwner){
            return new NextResponse("Unauhtorized", { status: 401000});
        }

        const attachment = await db.attachment.delete({
            where: {
                courseId: courseId,
                id: attachmentId,
            }
        })

        return NextResponse.json(attachment);
    }catch(error) {
        console.log("ATACHMENT_ID", error);
        return new NextResponse("Internal Error", { status: 500} );
    }
}