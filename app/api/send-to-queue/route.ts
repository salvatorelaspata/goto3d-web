import { NextResponse } from 'next/server';
import { sendToQueue } from '@/utils/amqpClient';
import { createClient } from '@/utils/supabase/server';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    // Verify authentication
    const supabase = createClient();
    const { data: { user }, error: authError } = await supabase.auth.getUser();

    if (authError || !user) {
      return NextResponse.json(
        { error: 'Non autorizzato' },
        { status: 401 }
      );
    }

    const formData = await req.formData();
    const id = formData.get("id") as string;

    if (!id) {
      return NextResponse.json(
        { error: 'ID progetto richiesto' },
        { status: 400 }
      );
    }

    // Verify project ownership
    const { data: project, error: projectError } = await supabase
      .from('project')
      .select('id, user_id')
      .eq('id', parseInt(id))
      .single();

    if (projectError || !project) {
      return NextResponse.json(
        { error: 'Progetto non trovato' },
        { status: 404 }
      );
    }

    if (project.user_id !== user.id) {
      return NextResponse.json(
        { error: 'Non autorizzato ad accedere a questo progetto' },
        { status: 403 }
      );
    }

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
