import { NextResponse } from 'next/server';
import { putObject } from '@/utils/s3/api';
import { createClient } from '@/utils/supabase/server';
import { MAX_FILE_SIZE, ALLOWED_MIME_TYPES } from '@/lib/constants';
import { uploadRateLimiter } from '@/lib/rate-limit';

export const runtime = 'nodejs';

// Sanitize filename to prevent path traversal
const sanitizeFilename = (filename: string): string => {
  return filename
    .replace(/[^a-zA-Z0-9._-]/g, '_')
    .replace(/\.{2,}/g, '.')
    .substring(0, 255);
};

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

    // Rate limiting per user
    const { success: withinLimit } = uploadRateLimiter.limit(user.id);
    if (!withinLimit) {
      return NextResponse.json(
        { error: 'Troppe richieste. Riprova tra poco.' },
        { status: 429 }
      );
    }

    const formData = await req.formData();
    const id = formData.get("id") as string;
    const file = formData.get("file") as File;

    if (!id || !file) {
      return NextResponse.json(
        { error: 'ID progetto e file sono richiesti' },
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

    // Validate file type
    if (!(ALLOWED_MIME_TYPES as readonly string[]).includes(file.type)) {
      return NextResponse.json(
        { error: `Tipo file non consentito. Tipi permessi: ${ALLOWED_MIME_TYPES.join(', ')}` },
        { status: 400 }
      );
    }

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        { error: `File troppo grande. Dimensione massima: ${MAX_FILE_SIZE / 1024 / 1024}MB` },
        { status: 400 }
      );
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const reader = new Uint8Array(buffer);
    const sanitizedFilename = sanitizeFilename(file.name);

    await putObject(
      process.env.NEXT_CLOUDFLARE_R2_BUCKET_NAME ?? "",
      id.toString() + "/images/" + sanitizedFilename,
      reader
    );

    return NextResponse.json({ success: true, project: id, file: sanitizedFilename });
  } catch (error) {
    console.error('API Error:', error);
    return NextResponse.json(
      { error: 'Errore durante l\'elaborazione' },
      { status: 500 }
    );
  }
}
