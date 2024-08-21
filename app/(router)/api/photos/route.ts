import "dotenv/config";
import sharp from "sharp";
import { type NextRequest, NextResponse } from "next/server";
import { existsSync, mkdirSync } from "node:fs";
import { S3Client, PutObjectCommand, DeleteObjectsCommand } from '@aws-sdk/client-s3';

const s3Client = new S3Client({
  forcePathStyle: true,
  region: 'eu-central-1',
  endpoint: 'https://sgowovgzmzoyktqflswl.supabase.co/storage/v1/s3',
  credentials: {
    accessKeyId: process.env.ACCESS_KEY_ID as string,
    secretAccessKey: process.env.SECRET_ACCESS_KEY as string,
  }
})

export async function POST(request:NextRequest) {
  // if (!existsSync("./public/photos")) mkdirSync("./public/photos");
  const formData = await request.formData();
  const files: File[] = formData.getAll("file") as File[];
  const names: string[] = formData.getAll("name") as string[];
  const photos = files.reduce<{file:File; name:string}[]>((acc, file, i) => acc.concat({file: file, name: names[i]}), []);
  for (const {file, name} of photos) {
    const buffer = Buffer.from(await file.arrayBuffer());
    // const compressedFile = await sharp(buffer)
    //   .resize({ width: 2560, height: 2560, fit: "inside", withoutEnlargement: true })
    //   .webp({quality: 70})
    //   .toBuffer();
      // .toFile(`./public/photos/${name}`);
    const uploadCommand = new PutObjectCommand({
      Bucket: 'photos',
      Key: name,
      Body: buffer,
      ContentType: 'image/webp',
    })
    await s3Client.send(uploadCommand)
  }
  return NextResponse.json("Ok");
}

export async function DELETE(request:NextRequest) {
  const formData = await request.formData();
  const names = formData.getAll("name");
  // for (const name of names) {
    // if (existsSync(`./public/photos/${name}`)) unlinkSync(`./public/photos/${name}`);
  // }
  s3Client.send(new DeleteObjectsCommand({
    Bucket: 'photos',
    Delete: {
      Objects: names.map((name) => ({Key: name as string})),
    },
  }))
  return NextResponse.json("Ok");
}