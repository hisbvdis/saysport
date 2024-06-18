import sharp from "sharp";
import { NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync, unlinkSync } from "fs";

export async function POST(request:NextRequest) {
  if (!existsSync("./public/photos")) mkdirSync("./public/photos");
  const formData = await request.formData();
  const files: File[] = formData.getAll("file") as File[];
  const names: string[] = formData.getAll("name") as string[];
  const photos = files.reduce<{file:File; name:string}[]>((acc, file, i) => acc.concat({file: file, name: names[i]}), []);
  for (let {file, name} of photos) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await sharp(buffer)
      .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
      .webp({quality: 70})
      .toFile(`./public/photos/${name}`);
  }
  return NextResponse.json("Ok");
}

export async function DELETE(request:NextRequest) {
  const formData = await request.formData();
  const names = formData.getAll("name");
  for (let name of names) {
    if (existsSync(`./public/photos/${name}`)) unlinkSync(`./public/photos/${name}`);
  }
  return NextResponse.json("Ok");
}