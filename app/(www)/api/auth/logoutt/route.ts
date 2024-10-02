"use server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET() {
  cookies().delete("isLogin");
  return NextResponse.json("OK")
}