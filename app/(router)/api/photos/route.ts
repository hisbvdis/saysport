import "dotenv/config";
import { type NextRequest, NextResponse } from "next/server";
import { writeFile } from "node:fs/promises";
import { existsSync, mkdirSync, unlinkSync } from "node:fs";

export async function POST(request:NextRequest) {
  if (!existsSync(`${process.env.PHOTO_UPLOAD_PATH}`)) mkdirSync(`${process.env.PHOTO_UPLOAD_PATH}`);
  const formData = await request.formData();
  const files: File[] = formData.getAll("file") as File[];
  const names: string[] = formData.getAll("name") as string[];
  const photos = files.reduce<{file:File; name:string}[]>((acc, file, i) => acc.concat({file: file, name: names[i]}), []);
  for (const {file, name} of photos) {
    const buffer = Buffer.from(await file.arrayBuffer());
    await writeFile(`${process.env.PHOTO_UPLOAD_PATH}/${name}`, buffer);
    // const compressedFile = await sharp(buffer)
    //   .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    //   .webp({quality: 70})
    //   .toBuffer();
    //   .toFile(`./public/photos/${name}`);
  }
  return NextResponse.json("Ok");
}

export async function DELETE(request:NextRequest) {
  const formData = await request.formData();
  const names = formData.getAll("name");
  for (const name of names) {
    if (existsSync(`${process.env.PHOTO_UPLOAD_PATH}/${name}`)) unlinkSync(`${process.env.PHOTO_UPLOAD_PATH}/${name}`);
  }
  return NextResponse.json("Ok");
}