export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';

export async function GET(
  _req: NextRequest,
  { params }: { params: { session_id: string } }
) {
  const { session_id } = params;

  if (!session_id) {
    return NextResponse.json({ error: 'session_id required' }, { status: 400 });
  }

  const client = await pool.connect();
  let session;
  try {
    const result = await client.query(
      'SELECT id, scores, percentiles, subject_name, paid_report_unlocked FROM quiz.sessions WHERE id = $1',
      [session_id]
    );
    if (result.rows.length === 0) {
      return NextResponse.json({ error: 'Session not found' }, { status: 404 });
    }
    session = result.rows[0];
  } finally {
    client.release();
  }

  // Auth gate: only serve if payment confirmed
  if (!session.paid_report_unlocked) {
    return NextResponse.json({ error: 'Report not unlocked. Complete payment first.' }, { status: 403 });
  }

  // Dynamically import to keep bundle size down and avoid Edge runtime issues
  const { renderToBuffer } = await import('@react-pdf/renderer');
  const { DarkTriadReport } = await import('@/lib/pdfReport');
  const React = (await import('react')).default;

  const scores = session.scores as {
    narcissism: number;
    psychopathy: number;
    machiavellianism: number;
    composite: number;
  };
  const percentiles = session.percentiles as {
    narcissism: number;
    psychopathy: number;
    machiavellianism: number;
    composite: number;
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const element = React.createElement(DarkTriadReport as any, {
    scores,
    percentiles,
    subjectName: session.subject_name ?? null,
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfBuffer = await renderToBuffer(element as any);

  // Update pdf_generated_at
  await pool.query(
    'UPDATE quiz.sessions SET pdf_generated_at = NOW() WHERE id = $1',
    [session_id]
  );

  const pdfBytes = new Uint8Array(pdfBuffer);

  return new NextResponse(pdfBytes, {
    status: 200,
    headers: {
      'Content-Type': 'application/pdf',
      'Content-Disposition': `attachment; filename="dark-triad-report-${session_id}.pdf"`,
      'Content-Length': String(pdfBytes.byteLength),
    },
  });
}
