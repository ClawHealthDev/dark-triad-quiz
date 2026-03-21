export const runtime = 'edge';

import { ImageResponse } from '@vercel/og';
import { NextRequest } from 'next/server';

const TRAIT_COLORS: Record<string, string> = {
  narcissism: '#f0c040',
  psychopathy: '#c0392b',
  machiavellianism: '#8e44ad',
};

const LANDING_PAGES: Record<string, { title: string; subtitle: string; color: string; badge: string }> = {
  'dark-triad': {
    title: 'Dark Triad\nPersonality Test',
    subtitle: 'Based on NPI-16 · Levenson SRPS · MACH-IV',
    color: '#c0392b',
    badge: 'Validated Psychological Assessment',
  },
  'scroll-audit': {
    title: 'Scroll Addiction\nTest',
    subtitle: 'Discover WHY you scroll — 4 profiles · 10 questions · 2 minutes',
    color: '#c0392b',
    badge: 'The Automated Doctor · Free Diagnostic',
  },
  'gaslighting': {
    title: "You're Not Crazy —\nGaslighting Test",
    subtitle: '14 questions · Free Reality Grounding Guide',
    color: '#2980b9',
    badge: 'The Automated Doctor · Awareness Quiz',
  },
};

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);

  // Landing page OG image mode
  const page = searchParams.get('page');
  if (page && LANDING_PAGES[page]) {
    const { title, subtitle, color, badge } = LANDING_PAGES[page];
    const [line1, line2] = title.split('\n');
    return new ImageResponse(
      (
        <div
          style={{
            width: '1200px',
            height: '630px',
            background: '#0a0a0a',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'sans-serif',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              background: `radial-gradient(ellipse 80% 60% at 50% 40%, ${color}18 0%, transparent 70%)`,
            }}
          />
          {/* Badge */}
          <div
            style={{
              position: 'absolute',
              top: 40,
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '100px',
              border: `1px solid ${color}50`,
              background: `${color}15`,
            }}
          >
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: color }} />
            <span style={{ color, fontSize: '13px', fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
              {badge}
            </span>
          </div>
          {/* Title */}
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0px' }}>
            <span style={{ color: 'white', fontSize: '80px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05 }}>
              {line1}
            </span>
            {line2 && (
              <span style={{ color, fontSize: '80px', fontWeight: 900, letterSpacing: '-2px', lineHeight: 1.05 }}>
                {line2}
              </span>
            )}
            <span style={{ color: 'rgba(255,255,255,0.45)', fontSize: '22px', fontWeight: 400, marginTop: '20px', textAlign: 'center' }}>
              {subtitle}
            </span>
          </div>
          {/* Footer */}
          <div style={{ position: 'absolute', bottom: 36, display: 'flex', justifyContent: 'center' }}>
            <span style={{ color: 'rgba(255,255,255,0.2)', fontSize: '16px' }}>
              theautomateddoctor.com
            </span>
          </div>
        </div>
      ),
      { width: 1200, height: 630 }
    );
  }

  const score = parseInt(searchParams.get('score') ?? '0', 10);
  const dominant = searchParams.get('dominant') ?? '';
  const name = searchParams.get('name') ?? '';

  const traitColor = TRAIT_COLORS[dominant.toLowerCase()] ?? '#c0392b';
  const dominantLabel =
    dominant.charAt(0).toUpperCase() + dominant.slice(1).toLowerCase();
  const displayName = name ? name.slice(0, 30) : null;

  return new ImageResponse(
    (
      <div
        style={{
          width: '1200px',
          height: '630px',
          background: '#0a0a0a',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          fontFamily: 'sans-serif',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Background glow */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `radial-gradient(ellipse 70% 60% at 50% 40%, ${traitColor}20 0%, transparent 70%)`,
          }}
        />

        {/* Top branding */}
        <div
          style={{
            position: 'absolute',
            top: 40,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '6px 16px',
              borderRadius: '100px',
              border: `1px solid ${traitColor}50`,
              background: `${traitColor}15`,
            }}
          >
            <div
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: traitColor,
              }}
            />
            <span
              style={{
                color: traitColor,
                fontSize: '14px',
                fontWeight: 700,
                letterSpacing: '0.15em',
                textTransform: 'uppercase',
              }}
            >
              Dark Triad Profiler
            </span>
          </div>
        </div>

        {/* Main content */}
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '16px',
          }}
        >
          {displayName && (
            <div
              style={{
                color: 'rgba(255,255,255,0.5)',
                fontSize: '22px',
                fontWeight: 500,
              }}
            >
              {displayName}
            </div>
          )}

          {/* Score */}
          <div
            style={{
              fontSize: '160px',
              fontWeight: 900,
              color: '#c0392b',
              lineHeight: 1,
              letterSpacing: '-4px',
            }}
          >
            {score || '—'}
          </div>

          <div
            style={{
              color: 'rgba(255,255,255,0.4)',
              fontSize: '20px',
              fontWeight: 400,
              marginTop: '-8px',
            }}
          >
            Composite Dark Triad Score
          </div>

          {/* Dominant trait badge */}
          {dominantLabel && (
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 24px',
                borderRadius: '100px',
                border: `2px solid ${traitColor}60`,
                background: `${traitColor}20`,
                marginTop: '8px',
              }}
            >
              <span
                style={{
                  color: 'rgba(255,255,255,0.5)',
                  fontSize: '15px',
                  fontWeight: 500,
                }}
              >
                Dominant Trait:
              </span>
              <span
                style={{
                  color: traitColor,
                  fontSize: '18px',
                  fontWeight: 800,
                  letterSpacing: '0.05em',
                }}
              >
                {dominantLabel}
              </span>
            </div>
          )}
        </div>

        {/* Bottom domain */}
        <div
          style={{
            position: 'absolute',
            bottom: 36,
            left: 0,
            right: 0,
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <span
            style={{
              color: 'rgba(255,255,255,0.2)',
              fontSize: '16px',
              fontWeight: 400,
            }}
          >
            theautomateddoctor.com
          </span>
        </div>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
