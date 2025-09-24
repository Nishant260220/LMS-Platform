import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";
import { isTeacher } from "@/lib/teacher";

export async function POST(req: Request) {
  
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    const { title } = await req.json();

    
    if (!userId || !isTeacher(userId)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const course = await db.course.create({
      data: {
        userId,
        title,
      },
    });
    return NextResponse.json(course, { status: 201 });
  } catch (error) {
    return new NextResponse("Internal Error", { status: 500 });
  }
}
