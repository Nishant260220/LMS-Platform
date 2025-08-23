import { NextResponse } from "next/server";
import db from "@/lib/db";
// import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { name, email, password } = await req.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const existingUser = await db.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: "User already exists" },
        { status: 400 }
      );
    }

    const user = await db.user.create({
      data: {
        name,
        email,
        password, 
      },
    });

    return NextResponse.json(user, { status: 201 });
  } catch (error) {
    console.error("SIGNUP_ERROR", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
