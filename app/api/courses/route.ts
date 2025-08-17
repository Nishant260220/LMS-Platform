import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/route";
import db from "@/lib/db";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  try {
    if (!session || !session.user?.name) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.name;
    const { title } = await req.json();

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
