import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const { email, password } = await req.json();
    const adminEmail = process.env.ADMIN_EMAIL;
    const adminPassword = process.env.ADMIN_PASSWORD;

    if (!adminEmail || !adminPassword) {
      console.error("Admin credentials not configured in environment variables.");
      return NextResponse.json(
        { error: "Configuration error. Please contact server administrator." },
        { status: 500 }
      );
    }

    if (email === adminEmail && password === adminPassword) {
      const response = NextResponse.json({ success: true });
      
      // Set secure HTTP-only cookie for session management
      response.cookies.set("admin_token", "baliyo_admin_authenticated", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
        maxAge: 60 * 60 * 24, // 1 day session
      });
      
      return response;
    }

    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  } catch (error) {
    console.error("Error in login handler:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}
