import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import db from "@/lib/db";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { id } from "zod/v4/locales";

export async function PUT(
    req: Request, 
    { params }: { params: { courseId: string}}
){
    try{
        const session = await getServerSession(authOptions);
        const { courseId } = params;
        const userId = session?.user?.id;

        if(!userId){
            return new NextResponse("Unauthorized", { status: 401 });
        }

        const { list } = await req.json();

        const ownCourse = await db.course.findUnique({
            where: {
                id: courseId,
                userId: userId
            }
        });

        if(!ownCourse) {
             return new NextResponse("Unauthorized", { status: 401 });
        }

        for(let item of list){
            await db.chapter.update({
                where: {id: item.id},
                data: { position: item.position}
            });
        }
        return new NextResponse("Success", { status: 200});
        
    }catch (error){
        console.log("[REORDER]",error);
        return new NextResponse("Internal error", { status: 500 });
    }
}