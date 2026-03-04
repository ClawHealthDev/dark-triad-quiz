// PDF Report Generator using @react-pdf/renderer
// Server-side only — do NOT import in client components

import React from 'react';
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,

} from '@react-pdf/renderer';

interface TraitScores {
  narcissism: number;
  psychopathy: number;
  machiavellianism: number;
  composite: number;
}

interface TraitPercentiles {
  narcissism: number;
  psychopathy: number;
  machiavellianism: number;
  composite: number;
}

interface ReportData {
  scores: TraitScores;
  percentiles: TraitPercentiles;
  subjectName?: string | null;
}

const COLORS = {
  black: '#000000',
  darkBg: '#0a0a0a',
  red: '#c0392b',
  gold: '#f0c040',
  purple: '#8e44ad',
  white: '#ffffff',
  gray: '#666666',
  lightGray: '#999999',
  border: '#e0e0e0',
};

const styles = StyleSheet.create({
  page: {
    backgroundColor: '#ffffff',
    padding: 48,
    fontFamily: 'Helvetica',
  },
  // Title page
  titlePage: {
    backgroundColor: '#0a0a0a',
    padding: 48,
    flexDirection: 'column',
    justifyContent: 'center',
    minHeight: '100%',
  },
  brandBadge: {
    fontSize: 9,
    color: '#c0392b',
    letterSpacing: 3,
    textTransform: 'uppercase',
    marginBottom: 32,
  },
  reportTitle: {
    fontSize: 32,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 12,
    lineHeight: 1.2,
  },
  reportSubtitle: {
    fontSize: 14,
    color: '#999999',
    marginBottom: 48,
  },
  divider: {
    height: 2,
    backgroundColor: '#c0392b',
    width: 60,
    marginBottom: 32,
  },
  titleScoreRow: {
    flexDirection: 'row',
    gap: 24,
    marginBottom: 48,
  },
  titleScoreBox: {
    flex: 1,
    padding: 16,
    borderWidth: 1,
    borderColor: '#333333',
    borderRadius: 8,
  },
  titleScoreLabel: {
    fontSize: 8,
    color: '#666666',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  titleScoreValue: {
    fontSize: 28,
    fontFamily: 'Helvetica-Bold',
  },
  titleFooter: {
    fontSize: 9,
    color: '#444444',
    marginTop: 'auto',
  },
  // Content pages
  sectionHeader: {
    marginBottom: 24,
  },
  sectionTag: {
    fontSize: 8,
    color: '#c0392b',
    letterSpacing: 2,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#0a0a0a',
    marginBottom: 8,
  },
  sectionSubtitle: {
    fontSize: 11,
    color: '#666666',
    lineHeight: 1.5,
  },
  traitCard: {
    marginBottom: 24,
    padding: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    borderLeftWidth: 4,
  },
  traitCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 10,
  },
  traitName: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    marginBottom: 2,
  },
  traitScore: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    textAlign: 'right',
  },
  traitPercentile: {
    fontSize: 9,
    color: '#999999',
    textAlign: 'right',
  },
  barContainer: {
    height: 6,
    backgroundColor: '#e0e0e0',
    borderRadius: 3,
    marginBottom: 10,
    overflow: 'hidden',
  },
  barFill: {
    height: 6,
    borderRadius: 3,
  },
  traitBody: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.7,
  },
  strategiesBox: {
    marginTop: 12,
    padding: 14,
    backgroundColor: '#ffffff',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  strategiesTitle: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#333333',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 8,
  },
  strategyItem: {
    fontSize: 10,
    color: '#444444',
    lineHeight: 1.6,
    marginBottom: 4,
  },
  ctaBox: {
    marginTop: 32,
    padding: 24,
    backgroundColor: '#0a0a0a',
    borderRadius: 10,
  },
  ctaTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#ffffff',
    marginBottom: 8,
  },
  ctaBody: {
    fontSize: 10,
    color: '#999999',
    lineHeight: 1.7,
    marginBottom: 16,
  },
  ctaUrl: {
    fontSize: 12,
    color: '#c0392b',
    fontFamily: 'Helvetica-Bold',
  },
  disclaimer: {
    fontSize: 8,
    color: '#bbbbbb',
    lineHeight: 1.5,
    marginTop: 12,
  },
});

// Trait content based on scores
function getTraitContent(
  trait: 'narcissism' | 'psychopathy' | 'machiavellianism',
  score: number
): { heading: string; body: string; strategies: string[] } {
  const isHigh = score > 60;

  if (trait === 'narcissism') {
    if (isHigh) {
      return {
        heading: 'Understanding and Managing Your Narcissistic Traits',
        body: `Your narcissism score of ${score}/100 places you in the higher range, indicating a strong sense of self-importance, a desire for admiration, and confidence in your own abilities. These traits can be powerful assets — high-narcissism individuals often display natural leadership, charm, and the kind of bold self-belief that drives achievement.\n\nHowever, the same traits that make you compelling can create friction in close relationships. You may sometimes struggle with empathy, find criticism difficult to process, or prioritise your own needs in ways that others experience as dismissive. Awareness of these tendencies is the first step toward channelling them constructively.`,
        strategies: [
          '→ Practice active listening: pause before responding to give others space to feel heard.',
          '→ When receiving feedback, delay your first reaction by 24 hours before deciding how to respond.',
          '→ Build a small circle of trusted advisors who will tell you hard truths.',
          '→ Channel competitive drive into goals that benefit your team, not just yourself.',
          '→ Cultivate empathy deliberately: ask people about their experience before offering your perspective.',
        ],
      };
    } else {
      return {
        heading: 'What Your Narcissism Profile Says About Your Vulnerabilities',
        body: `Your narcissism score of ${score}/100 sits in the lower range, suggesting you are more self-effacing, collaborative, and focused on others' needs than the average person. You likely value harmony, may struggle to advocate for yourself, and can find it hard to receive compliments or take credit for your successes.\n\nWhile humility is a genuine strength, a very low narcissism score can leave you vulnerable to exploitation by those with higher scores. Understanding how high-narcissism individuals operate is essential for protecting your interests in professional and personal settings.`,
        strategies: [
          '→ Practice stating your needs directly — "I need X" rather than hinting.',
          '→ Learn to recognise flattery and love-bombing as potential manipulation tactics.',
          '→ Set and enforce clear boundaries; say no without extensive justification.',
          '→ Build your self-advocacy skills: keep a record of your achievements.',
          '→ Surround yourself with people who reciprocate care, not just receive it.',
        ],
      };
    }
  }

  if (trait === 'psychopathy') {
    if (isHigh) {
      return {
        heading: 'Understanding and Managing Your Psychopathic Traits',
        body: `Your psychopathy score of ${score}/100 is elevated, reflecting traits such as emotional detachment, risk tolerance, and a capacity for calculated decision-making. In controlled contexts — surgery, finance, law, crisis management — these traits can underpin exceptional performance.\n\nThe challenge lies in the collateral damage these traits can create when left unchecked: relationships may feel transactional to others, promises may feel less binding to you than to those around you, and your comfort with rule-bending may occasionally cross lines with serious consequences. Self-regulation and ethical guardrails are your most important tools.`,
        strategies: [
          '→ Develop a personal code of ethics that you commit to in writing — treat it like a contract.',
          '→ Slow down major decisions that affect others: force a 48-hour deliberation window.',
          '→ Cultivate at least two relationships where you invest emotionally without transactional expectation.',
          '→ Find high-stimulation, rule-bounded outlets (competitive sport, entrepreneurship) for your risk appetite.',
          '→ Seek feedback from trusted people about how your decisions impact them.',
        ],
      };
    } else {
      return {
        heading: 'What Your Psychopathy Profile Says About Your Vulnerabilities',
        body: `Your psychopathy score of ${score}/100 is in the lower range, indicating you are likely high in empathy, emotionally responsive, and deeply affected by conflict or moral violations. These are admirable qualities — you are the kind of person others feel safe around.\n\nHowever, individuals with lower psychopathy scores are particularly susceptible to emotional manipulation, guilt-tripping, and being used as emotional support without reciprocation. High-psychopathy individuals can identify and exploit empathic people with precision. Awareness of these dynamics is your primary defence.`,
        strategies: [
          '→ Trust your gut when something feels "off" about a person — your empathy picks up on inconsistencies.',
          '→ Watch for patterns of behaviour, not just isolated incidents.',
          '→ Learn to detach emotionally when making decisions that affect your security.',
          '→ Don\'t mistake charm for trustworthiness — track what people do, not just what they say.',
          '→ Build your assertiveness: you can care about people while still enforcing consequences.',
        ],
      };
    }
  }

  // Machiavellianism
  if (isHigh) {
    return {
      heading: 'Understanding and Managing Your Machiavellian Traits',
      body: `Your Machiavellianism score of ${score}/100 is high, suggesting a strategic, calculating approach to relationships and goals. You likely think several moves ahead, understand power dynamics intuitively, and are comfortable with strategic deception when you believe it serves a larger purpose.\n\nThese traits, when well-managed, produce exceptional strategists, negotiators, and leaders. The risk is that chronic manipulation erodes trust — even when the manipulation isn't detected, the relationships built on it tend to be shallow and transactional. Long-term success depends on building genuine alliances alongside your strategic ones.`,
      strategies: [
        '→ Distinguish between strategic thinking (healthy) and manipulation (corrosive) — write down your intent.',
        '→ Invest deliberately in relationships that are not instrumental to any current goal.',
        '→ Audit your network: are most of your relationships transactional? Rebalance.',
        '→ Practise radical honesty in at least one close relationship.',
        '→ Ask yourself before each strategic move: "Would I be comfortable if this person knew exactly what I was doing?"',
      ],
    };
  } else {
    return {
      heading: 'What Your Machiavellianism Profile Says About Your Vulnerabilities',
      body: `Your Machiavellianism score of ${score}/100 indicates you tend toward straightforwardness, emotional transparency, and a preference for honest dealing. You likely expect others to operate with the same good faith you bring — which is admirable, but leaves you exposed.\n\nHighly Machiavellian individuals are skilled at reading and exploiting open, trusting people. They will use your transparency against you, cultivate your loyalty while maintaining their own flexibility, and often leave you confused about why relationships that felt genuine ended badly.`,
      strategies: [
        '→ Assume that in competitive contexts (work, dating, negotiation), not everyone shares your values.',
        '→ Don\'t disclose your full hand in negotiations — share information strategically.',
        '→ Learn to ask: "What does this person gain from this interaction?" before committing.',
        '→ Study basic negotiation principles: anchor high, don\'t accept first offers.',
        '→ Protect information about your plans, finances, and relationships from people you haven\'t fully vetted.',
      ],
    };
  }
}

function ScoreBar({
  score,
  color,
}: {
  score: number;
  color: string;
}) {
  return (
    <View style={styles.barContainer}>
      <View
        style={[
          styles.barFill,
          { width: `${score}%`, backgroundColor: color },
        ]}
      />
    </View>
  );
}

export function DarkTriadReport({ scores, percentiles, subjectName }: ReportData) {
  const traits = [
    { key: 'narcissism' as const, label: 'Narcissism', color: COLORS.gold },
    { key: 'psychopathy' as const, label: 'Psychopathy', color: COLORS.red },
    { key: 'machiavellianism' as const, label: 'Machiavellianism', color: COLORS.purple },
  ];

  const dominantTrait = traits.reduce((a, b) =>
    scores[a.key] > scores[b.key] ? a : b
  );

  return (
    <Document>
      {/* ── Page 1: Title ── */}
      <Page size="A4" style={styles.titlePage}>
        <Text style={styles.brandBadge}>The Automated Doctor · Dark Triad Profiler</Text>
        <Text style={styles.reportTitle}>
          {subjectName ? `${subjectName}'s` : 'Your'}{'\n'}Dark Triad{'\n'}Action Plan
        </Text>
        <Text style={styles.reportSubtitle}>
          Personalised psychological profile and strategy guide
        </Text>
        <View style={styles.divider} />

        <View style={styles.titleScoreRow}>
          <View style={styles.titleScoreBox}>
            <Text style={styles.titleScoreLabel}>Composite Score</Text>
            <Text style={[styles.titleScoreValue, { color: COLORS.red }]}>
              {scores.composite}
            </Text>
          </View>
          <View style={styles.titleScoreBox}>
            <Text style={styles.titleScoreLabel}>Dominant Trait</Text>
            <Text style={[styles.titleScoreValue, { color: dominantTrait.color, fontSize: 18 }]}>
              {dominantTrait.label}
            </Text>
          </View>
          <View style={styles.titleScoreBox}>
            <Text style={styles.titleScoreLabel}>Percentile</Text>
            <Text style={[styles.titleScoreValue, { color: COLORS.white }]}>
              {percentiles.composite}th
            </Text>
          </View>
        </View>

        <Text style={styles.titleFooter}>
          quiz.theautomateddoctor.com · Generated {new Date().toLocaleDateString('en-AU', { day: 'numeric', month: 'long', year: 'numeric' })}
        </Text>
      </Page>

      {/* ── Page 2: Score Summary ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>Score Summary</Text>
          <Text style={styles.sectionTitle}>Your Dark Triad Profile</Text>
          <Text style={styles.sectionSubtitle}>
            Based on validated psychological scales (NPI-16, Levenson SRPS, MACH-IV).
            Your scores reflect tendencies measured against published normative data.
          </Text>
        </View>

        {traits.map(({ key, label, color }) => (
          <View key={key} style={[styles.traitCard, { borderLeftColor: color }]}>
            <View style={styles.traitCardHeader}>
              <View>
                <Text style={[styles.traitName, { color }]}>{label}</Text>
              </View>
              <View>
                <Text style={[styles.traitScore, { color }]}>{scores[key]}</Text>
                <Text style={styles.traitPercentile}>Top {100 - percentiles[key]}% · {percentiles[key]}th percentile</Text>
              </View>
            </View>
            <ScoreBar score={scores[key]} color={color} />
          </View>
        ))}

        <View style={[styles.traitCard, { borderLeftColor: COLORS.red }]}>
          <View style={styles.traitCardHeader}>
            <View>
              <Text style={[styles.traitName, { color: COLORS.red }]}>Composite Dark Triad</Text>
            </View>
            <View>
              <Text style={[styles.traitScore, { color: COLORS.red }]}>{scores.composite}</Text>
              <Text style={styles.traitPercentile}>{percentiles.composite}th percentile overall</Text>
            </View>
          </View>
          <ScoreBar score={scores.composite} color={COLORS.red} />
          <Text style={styles.traitBody}>
            Your composite score represents the equal-weighted average of all three Dark Triad traits.
            {scores.composite > 70
              ? ' A score in this range indicates a pronounced dark triad profile — your results carry meaningful implications for how you engage in relationships and competitive environments.'
              : scores.composite > 40
              ? ' A score in the mid-range suggests a blend of dark and conventional traits. Context matters: you likely shift between approaches depending on the stakes involved.'
              : ' A lower composite score suggests you lean toward conventional, prosocial personality traits — though this also means understanding how higher-scoring individuals operate is especially valuable for you.'}
          </Text>
        </View>
      </Page>

      {/* ── Pages 3–5: Per-Trait Deep Dives ── */}
      {traits.map(({ key, label, color }) => {
        const content = getTraitContent(key, scores[key]);
        return (
          <Page key={key} size="A4" style={styles.page}>
            <View style={styles.sectionHeader}>
              <Text style={[styles.sectionTag, { color }]}>{label} · Score {scores[key]}/100</Text>
              <Text style={styles.sectionTitle}>{content.heading}</Text>
            </View>

            <Text style={[styles.traitBody, { marginBottom: 20 }]}>{content.body}</Text>

            <View style={styles.strategiesBox}>
              <Text style={styles.strategiesTitle}>
                {scores[key] > 60 ? 'Management Strategies' : 'Protection Strategies'}
              </Text>
              {content.strategies.map((s, i) => (
                <Text key={i} style={styles.strategyItem}>{s}</Text>
              ))}
            </View>
          </Page>
        );
      })}

      {/* ── Final Page: CTA ── */}
      <Page size="A4" style={styles.page}>
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTag}>What&apos;s Next</Text>
          <Text style={styles.sectionTitle}>Continue Your Journey</Text>
          <Text style={styles.sectionSubtitle}>
            Self-knowledge is the foundation of every meaningful change.
            You&apos;ve taken the first step — here&apos;s how to go deeper.
          </Text>
        </View>

        <View style={[styles.traitCard, { borderLeftColor: COLORS.red, marginBottom: 16 }]}>
          <Text style={[styles.traitName, { color: COLORS.red, marginBottom: 8 }]}>
            Recommended Reading
          </Text>
          <Text style={styles.traitBody}>
            {'· The Mask of Sanity — Hervey Cleckley (psychopathy foundations)\n'}
            {'· The Prince — Niccolò Machiavelli (strategic realism)\n'}
            {'· Why Is It Always About You? — Sandy Hotchkiss (narcissism in relationships)\n'}
            {'· Snakes in Suits — Paul Babiak & Robert Hare (dark triad in the workplace)\n'}
            {'· The Gift of Fear — Gavin de Becker (recognising manipulation)'}
          </Text>
        </View>

        <View style={[styles.traitCard, { borderLeftColor: '#333333', marginBottom: 32 }]}>
          <Text style={[styles.traitName, { marginBottom: 8 }]}>Challenge a Friend</Text>
          <Text style={styles.traitBody}>
            The real insight often comes from comparison. Challenge someone in your life to take the test —
            a partner, a colleague, a rival. The comparison view reveals dynamics you might not otherwise notice.
          </Text>
        </View>

        <View style={styles.ctaBox}>
          <Text style={styles.ctaTitle}>The Automated Doctor</Text>
          <Text style={styles.ctaBody}>
            Evidence-based psychology for people who want to understand themselves and the people around them.
            No jargon. No fluff. Just the science, applied.
          </Text>
          <Text style={styles.ctaUrl}>quiz.theautomateddoctor.com</Text>
          <Text style={styles.disclaimer}>
            This report is for educational and self-reflection purposes only. It is not a clinical assessment
            and should not be used as a basis for medical or psychological diagnosis. If you have concerns
            about your mental health, please consult a qualified mental health professional.
          </Text>
        </View>
      </Page>
    </Document>
  );
}
