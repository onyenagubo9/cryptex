import { NextResponse } from "next/server";

export async function GET() {
  try {
    const res = await fetch("https://cryptopanic.com/api/v1/posts/?public=true");
    const data = await res.json();
    return NextResponse.json(data.results || []);
  } catch (error) {
    console.error("Error fetching news:", error);
    return NextResponse.json({ error: "Failed to fetch news" }, { status: 500 });
  }
}
