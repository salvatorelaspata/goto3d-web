import { NextResponse } from 'next/server';
import { sendToQueue } from '@/utils/amqpClient';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const id = formData.get("id") as string;
    await sendToQueue(parseInt(id));
    return NextResponse.json({ success: true, project: id });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'elaborazione' },
      { status: 500 }
    );
  }
}
