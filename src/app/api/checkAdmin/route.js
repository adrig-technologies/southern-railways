import { NextResponse } from "next/server";
import { getAuth, clerkClient } from "@clerk/nextjs/server";

export async function GET(request) {
  const { userId } = getAuth(request);

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await clerkClient.users.getUser(userId);
    const isAdmin = user.emailAddresses.some(email => email.emailAddress === "nishaanthms1@gmail.com");

    return NextResponse.json({ isAdmin });
  } catch (error) {
    console.error("Error fetching user:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}