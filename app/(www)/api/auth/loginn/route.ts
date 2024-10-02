"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  cookies().set("isLogin", "true");
  return NextResponse.json("OK")
}