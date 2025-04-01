import { NextResponse } from 'next/server';
import { putObject } from '@/utils/s3/api';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    const file = formData.get("file") as File;
    const buffer = Buffer.from(await file.arrayBuffer());
    const reader = new Uint8Array(buffer);
    console.log(`Uploading image to Cloudflare R2: ${file.name}`);
    await putObject(process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      id.toString() + "/images/" + file.name,
      reader
    );
    console.log(`Image uploaded to Cloudflare R2: ${file.name}`);
    return NextResponse.json({ success: true, project: id, file: file.name });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'elaborazione' },
      { status: 500 }
    );
  }
}
