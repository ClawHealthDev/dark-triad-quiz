export const runtime = 'nodejs';

import { NextRequest, NextResponse } from 'next/server';
import pool from '@/lib/db';
import { kitSubscribeWithTag } from '@/lib/kitApi';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { sessionId, email } = body as { sessionId?: string; email?: string };

    if (!sessionId || !email) {
      return NextResponse.json({ error: 'sessionId and email required' }, { status: 400 });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json({ error: 'Invalid email address' }, { status: 400 });
    }

    const client = await pool.connect();
    try {
      // Fetch session to get scores
      const sessionResult = await client.query(
        'SELECT id, scores, tier2_unlocked_at FROM quiz.sessions WHERE id = $1',
        [sessionId]
      );

      if (sessionResult.rows.length === 0) {
        return NextResponse.json({ error: 'Session not found' }, { status: 404 });
      }

      const session = sessionResult.rows[0];
      const scores = session.scores as Record<string, number>;

      // Determine dominant trait
      const traits = ['narcissism', 'psychopathy', 'machiavellianism'] as const;
      const dominantTrait = traits.reduce((a, b) =>
        (scores[a] ?? 0) > (scores[b] ?? 0) ? a : b
      );
      const compositeScore = scores.composite ?? 0;

      // Update DB: save email + mark tier2 unlocked
      await client.query(
        `UPDATE quiz.sessions
         SET email = $1, tier2_unlocked_at = COALESCE(tier2_unlocked_at, NOW())
         WHERE id = $2`,
        [email, sessionId]
      );

      // Subscribe to Kit (fire and forget on error — don't block Tier 2 unlock)
      const kitResult = await kitSubscribeWithTag(email, {
        dominant_trait: dominantTrait,
        composite_score: compositeScore,
      });

      return NextResponse.json({
        success: true,
        tier2Unlocked: true,
        kitSuccess: kitResult.success,
        kitError: kitResult.error ?? null,
      });
    } finally {
      client.release();
    }
  } catch (err) {
    console.error('[quiz/email]', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
