import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/route";
import db from "@/lib/db";

export async function PATCH(
  req: Request,
  { params }: { params: { courseId: string } }
) {
  const session = await getServerSession(authOptions);
 
  const values = await req.json(); 
   
   
  try {
    if (!session?.user) {
      return new NextResponse("Unauthorised", { status: 401 });
    }
    const userId = session?.user?.id;
    const { courseId } = await params;


    const existingCourse = await db.course.findUnique({
      where: { id: courseId },
    });

    if (!existingCourse || existingCourse.userId !== userId) {
      return new NextResponse("Forbidden", { status: 403 });
    }

    const course = await db.course.update({
      where: {
        id: courseId,
        userId,
      },
      data: {
        ...values
      }
    });
    return new NextResponse("course updated successfully");
  } catch (error) {
    return new NextResponse("Internal error", { status: 500 });
  }
}
