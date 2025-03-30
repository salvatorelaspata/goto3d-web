import { v4 as uuidv4 } from 'uuid';
import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/client';
import { Database } from '@/types/supabase';
import { putObject } from '@/utils/s3/api';
import { sendToQueue } from '@/utils/amqpClient';
import { PutObjectCommandOutput } from '@aws-sdk/client-s3';

export const runtime = 'nodejs';


type detail = Database["public"]["Enums"]["details"];
type order = Database["public"]["Enums"]["orders"];
type feature = Database["public"]["Enums"]["features"];

export async function POST(req: Request) {
  console.time('Processing time'); // Monitoraggio
  const authHeader = req.headers.get('Authorization');
  const token = authHeader?.replace('Bearer ', '');
  const supabase = createClient(token);
  try {
    console.log('Step 1: Parsing multipart form data'); // Monitoraggio
    const formData = await req.formData();

    const files = formData.getAll("files") as File[];
    const name = formData.get("name") as string;
    const description = formData.get("description") as string;
    const detail = formData.get("detail") as detail;
    const order = formData.get("order") as order;
    const feature = formData.get("feature") as feature;

    const filesArray = Array.from(files).map((f) => f.name) as string[];

    const images = formData.getAll('files') as File[];

    console.log('Step 2: Creating Supabase record'); // Monitoraggio
    const { data: project, error } = await supabase
      .from('project')
      .insert([{
        name,
        description,
        detail,
        order,
        feature,
        files: filesArray,
        status: "in queue"
      }])
      .select()
      .single();

    if (error) throw error;

    console.log('Step 3: Processing images'); // Monitoraggio
    const processedImages: string[] = [];
    let thumbnailName = '';
    const pAll: Promise<PutObjectCommandOutput>[] = []
    for (const image of images) {
      console.log(`Processing image: ${image.name}`); // Monitoraggio
      let buffer = Buffer.from(await image.arrayBuffer());

      const fileName = `${project.id}/${uuidv4()}-${image.name}`;

      const reader = new Uint8Array(buffer);
      console.log(`Uploading image to Cloudflare R2: ${image.name}`); // Monitoraggio
      pAll.push(putObject(process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
        project.id.toString() + "/images/" + image.name,
        reader
      ));

      // if (processedImages.length === 0) {
      //   console.log('Generating and uploading thumbnail'); // Monitoraggio
      //   const thumbnail = await _convertHeicToJpg(image);
      //   thumbnailName = `${project.id}/thumbnail.jpg`;
      //   await putObject(process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      //     thumbnailName,
      //     new Uint8Array(await thumbnail.arrayBuffer())
      //   );
      // }

      processedImages.push(`${fileName}`);
    }

    await Promise.all(pAll);

    console.log('Step 4: Updating Supabase record with thumbnail'); // Monitoraggio
    await supabase
      .from("project")
      .update({ thumbnail: thumbnailName })
      .eq("id", project.id);

    console.log('Step 5: Sending project to queue'); // Monitoraggio
    await sendToQueue(project.id);
    console.timeEnd('Processing time'); // Monitoraggio
    console.log('Process completed successfully'); // Monitoraggio
    return NextResponse.json({ success: true, project });
  } catch (error) {
    console.error('API Error:', error); // Monitoraggio errori
    console.timeEnd('Processing time'); // Monitoraggio
    return NextResponse.json(
      { error: 'Errore durante l\'elaborazione' },
      { status: 500 }
    );
  }
}

// const _convertHeicToJpg = async (file: File) => {
//   console.log(`Converting HEIC to JPG: ${file.name}`); // Monitoraggio
//   const formData = new FormData();
//   formData.append("file", file);
//   console.time('heic_to_jpg'); // Monitoraggio
//   const response = await fetch(
//     "https://heic_to_jpg.salvatorelaspata.dev/convert",
//     {
//       method: "POST",
//       body: formData,
//     },
//   );
//   console.timeEnd('heic_to_jpg'); // Monitoraggio
//   if (!response.ok) throw new Error("Error converting heic to jpg");
//   const blob = await response.blob();
//   const filename = file.name.toLowerCase().replace("heic", "jpg");
//   return new File([blob], filename, { type: "image/jpeg" });
// };
