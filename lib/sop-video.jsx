// SOPVideo: reusable animated explainer for BernCo Assessor SOPs.
// Consumes a scene array; renders a Stage with BernCo-branded chrome,
// title card, screenshot/comparison/bigstat/outro scenes.

const SOP_PALETTE = {
  bosque: '#285952',
  bosqueDark: '#1d4640',
  cypress: '#013942',
  sage: '#96aa94',
  sageSoft: '#c4d2c2',
  terracotta: '#e47756',
  terracottaSoft: '#f3c5af',
  mist: '#e8f1ee',
  mistSoft: '#f4f8f6',
  paper: '#faf8f4',
  ink: '#1a2620',
  line: '#cfd8d3',
  muted: '#5a6b65',
};

const FONT_DISPLAY = '"Gotham Display", "Gotham Black", "Montserrat", system-ui, sans-serif';
const FONT_BODY = '"Montserrat", system-ui, sans-serif';

// ────────────────────────────────────────────────────────────────
// Brand chrome — header strip + footer with progress
// ────────────────────────────────────────────────────────────────

function BrandChrome({ sopId, title, scenes, currentSceneIdx }) {
  return (
    <React.Fragment>
      {/* Top bar */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 72,
        background: SOP_PALETTE.paper,
        display: 'flex', alignItems: 'center',
        padding: '0 40px',
        zIndex: 100,
        borderBottom: `2px solid ${SOP_PALETTE.line}`,
      }}>
        <img src="../assets/bernco-assessor-logo.png" alt="BernCo County Assessor — Damian R. Lara" style={{
          height: 54, width: 'auto', display: 'block',
        }} />
        <div style={{
          marginLeft: 24, paddingLeft: 24,
          borderLeft: `1px solid ${SOP_PALETTE.line}`,
          fontFamily: FONT_BODY, fontSize: 13, fontWeight: 600,
          color: SOP_PALETTE.muted,
          letterSpacing: '0.16em', textTransform: 'uppercase',
        }}>
          Customer Service · SOP {sopId}
        </div>
        <div style={{ flex: 1 }} />
      </div>
      {/* Bottom progress strip */}
      <div style={{
        position: 'absolute', bottom: 0, left: 0, right: 0, height: 36,
        background: SOP_PALETTE.cypress,
        display: 'flex', alignItems: 'center', padding: '0 40px', gap: 8,
        zIndex: 100,
      }}>
        <div style={{
          fontFamily: FONT_BODY, fontSize: 11, fontWeight: 600,
          color: 'rgba(255,255,255,0.55)', letterSpacing: '0.12em',
          textTransform: 'uppercase',
        }}>
          {title}
        </div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 4 }}>
          {scenes.map((s, i) => (
            <div key={i} style={{
              width: i === currentSceneIdx ? 24 : 12,
              height: 4,
              background: i === currentSceneIdx
                ? SOP_PALETTE.terracotta
                : i < currentSceneIdx
                  ? 'rgba(255,255,255,0.4)'
                  : 'rgba(255,255,255,0.12)',
              borderRadius: 2,
              transition: 'all 300ms cubic-bezier(0.4, 0, 0.2, 1)',
            }} />
          ))}
        </div>
      </div>
    </React.Fragment>
  );
}

// ────────────────────────────────────────────────────────────────
// Scene primitives
// ────────────────────────────────────────────────────────────────

// Title card: SOP ID + big headline + subtitle
function TitleScene({ sopId, title, plainTitle, kicker }) {
  const { progress } = useSprite();
  const fadeIn = Easing.easeOutCubic(clamp(progress * 4, 0, 1));
  const slideUp = (1 - fadeIn) * 20;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: `linear-gradient(135deg, ${SOP_PALETTE.mistSoft} 0%, ${SOP_PALETTE.mist} 100%)`,
      display: 'flex', flexDirection: 'column',
      alignItems: 'flex-start', justifyContent: 'center',
      padding: '120px 120px',
    }}>
      {/* Big curve decoration */}
      <div style={{
        position: 'absolute', right: -200, top: -200,
        width: 800, height: 800,
        borderRadius: '50%',
        background: SOP_PALETTE.bosque,
        opacity: 0.06,
      }} />
      <div style={{
        position: 'absolute', right: -100, bottom: -300,
        width: 500, height: 500,
        borderRadius: '50%',
        background: SOP_PALETTE.terracotta,
        opacity: 0.08,
      }} />

      <div style={{
        opacity: fadeIn,
        transform: `translateY(${slideUp}px)`,
        display: 'flex', alignItems: 'center', gap: 28,
        marginBottom: 32,
      }}>
        <img src="../assets/bernco-assessor-logo.png" alt="BernCo County Assessor" style={{
          height: 110, width: 'auto', display: 'block',
        }} />
        <div style={{
          paddingLeft: 28,
          borderLeft: `2px solid ${SOP_PALETTE.line}`,
          fontFamily: FONT_BODY, fontSize: 16, fontWeight: 700,
          color: SOP_PALETTE.terracotta, letterSpacing: '0.24em',
          textTransform: 'uppercase', lineHeight: 1.4,
        }}>
          SOP {sopId}<br/>
          <span style={{ color: SOP_PALETTE.muted, fontWeight: 500, letterSpacing: '0.16em' }}>Customer Service</span>
        </div>
      </div>
      <div style={{
        opacity: clamp((progress - 0.05) * 4, 0, 1),
        transform: `translateY(${(1 - clamp((progress - 0.05) * 4, 0, 1)) * 30}px)`,
        fontFamily: FONT_DISPLAY, fontSize: 96, fontWeight: 900,
        color: SOP_PALETTE.bosque, letterSpacing: '-0.02em',
        lineHeight: 0.95,
        textTransform: 'uppercase',
        maxWidth: 1300,
      }}>
        {title}
      </div>
      {plainTitle && (
        <div style={{
          opacity: clamp((progress - 0.15) * 4, 0, 1),
          transform: `translateY(${(1 - clamp((progress - 0.15) * 4, 0, 1)) * 20}px)`,
          marginTop: 32,
          fontFamily: FONT_BODY, fontSize: 36, fontWeight: 400,
          color: SOP_PALETTE.cypress,
          letterSpacing: '-0.01em',
          maxWidth: 1300,
          lineHeight: 1.25,
        }}>
          {plainTitle}
        </div>
      )}
      {kicker && (
        <div style={{
          opacity: clamp((progress - 0.3) * 4, 0, 1),
          marginTop: 56,
          fontFamily: FONT_BODY, fontSize: 18, fontWeight: 500,
          color: SOP_PALETTE.muted,
          letterSpacing: '0.04em',
          maxWidth: 900,
          lineHeight: 1.55,
        }}>
          {kicker}
        </div>
      )}
    </div>
  );
}

// Screenshot scene: image + caption + optional highlights
// highlights: [{ x, y, w, h, label, color, start, end }] in image-relative %.
function ScreenshotScene({
  src, caption, sub, step,
  imgPos = 'right',          // 'right' | 'left' | 'center'
  imgFit = 'contain',         // 'contain' | 'cover'
  imgBg = SOP_PALETTE.mistSoft,
  imgFrame = 'shadow',        // 'shadow' | 'plain'
  imgAspect = null,            // optional width/height ratio — when set, the highlight overlay sizes to this exact aspect inside the frame (so highlight %s line up with the actual image area, not the letterboxed container)
  highlights = [],
  zoom = null,                 // {x, y, scale} percent — ken burns target
  bullets = null,
}) {
  const { progress, localTime, duration } = useSprite();
  const fadeIn = Easing.easeOutCubic(clamp(progress * 6, 0, 1));
  const exitT = clamp((progress - 0.92) * 12, 0, 1);
  const exitFade = 1 - exitT;

  // Optional smooth ken-burns pan/zoom
  let kbScale = 1, kbX = 0, kbY = 0;
  if (zoom) {
    const t = Easing.easeInOutCubic(clamp(progress, 0, 1));
    kbScale = 1 + (zoom.scale - 1) * t;
    // Pan: when zooming in, translate so the focus point stays centered
    kbX = -(zoom.x - 50) * (kbScale - 1) / 100 * 100;
    kbY = -(zoom.y - 50) * (kbScale - 1) / 100 * 100;
  }

  // Layout
  const isCenter = imgPos === 'center';
  const isLeft = imgPos === 'left';
  const textLeft = isLeft ? 'calc(50% + 60px)' : 120;
  const textWidth = isCenter ? 1680 : 700;
  const textTop = isCenter ? 'auto' : 200;
  const imgLeft = isCenter ? '50%' : (isLeft ? 80 : 'auto');
  const imgRight = isLeft ? 'auto' : (isCenter ? 'auto' : 80);
  const imgWidth = isCenter ? 1400 : 920;
  const imgHeight = isCenter ? 600 : 720;
  const imgTop = isCenter ? 'auto' : 180;

  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: SOP_PALETTE.paper,
      opacity: exitFade,
    }}>
      {/* Text panel */}
      <div style={{
        position: 'absolute',
        left: isCenter ? '50%' : textLeft,
        top: isCenter ? 110 : textTop,
        transform: isCenter ? 'translateX(-50%)' : 'none',
        width: textWidth,
        opacity: fadeIn,
        transform: `${isCenter ? 'translateX(-50%) ' : ''}translateY(${(1 - fadeIn) * 12}px)`,
        textAlign: isCenter ? 'center' : 'left',
      }}>
        {step && (
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 14,
            background: SOP_PALETTE.terracotta,
            color: SOP_PALETTE.paper,
            padding: '8px 18px 8px 14px',
            borderRadius: 999,
            fontFamily: FONT_BODY, fontWeight: 700,
            fontSize: 14, letterSpacing: '0.16em',
            textTransform: 'uppercase',
            marginBottom: 28,
          }}>
            <span style={{
              width: 26, height: 26, borderRadius: '50%',
              background: SOP_PALETTE.paper, color: SOP_PALETTE.terracotta,
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 14, fontWeight: 900,
            }}>{step.num}</span>
            {step.label}
          </div>
        )}
        <div style={{
          fontFamily: FONT_DISPLAY,
          fontSize: isCenter ? 56 : 60,
          fontWeight: 900,
          color: SOP_PALETTE.bosque,
          lineHeight: 1.02,
          letterSpacing: '-0.015em',
          textTransform: 'uppercase',
          overflowWrap: 'anywhere',
          wordBreak: 'break-word',
        }}>{caption}</div>
        {sub && (
          <div style={{
            marginTop: 22,
            fontFamily: FONT_BODY,
            fontSize: 22, fontWeight: 400,
            color: SOP_PALETTE.cypress,
            lineHeight: 1.45,
            letterSpacing: '-0.005em',
            maxWidth: 660,
            marginLeft: isCenter ? 'auto' : 0,
            marginRight: isCenter ? 'auto' : 0,
          }}>{sub}</div>
        )}
        {bullets && (
          <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 14 }}>
            {bullets.map((b, i) => {
              const bp = clamp((progress * 6) - 0.5 - i * 0.4, 0, 1);
              return (
                <div key={i} style={{
                  display: 'flex', gap: 14, alignItems: 'flex-start',
                  opacity: bp,
                  transform: `translateX(${(1 - bp) * -16}px)`,
                  fontFamily: FONT_BODY, fontSize: 19, fontWeight: 500,
                  color: SOP_PALETTE.ink, lineHeight: 1.45,
                }}>
                  <span style={{
                    width: 8, height: 8, marginTop: 11,
                    borderRadius: '50%',
                    background: b.color || SOP_PALETTE.terracotta,
                    flexShrink: 0,
                  }} />
                  <span>{b.text || b}</span>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Image */}
      <div style={{
        position: 'absolute',
        left: imgLeft, right: imgRight,
        top: imgTop,
        bottom: isCenter ? 90 : 'auto',
        transform: isCenter ? 'translateX(-50%)' : 'none',
        width: imgWidth,
        height: isCenter ? 'auto' : imgHeight,
        opacity: clamp((progress - 0.04) * 6, 0, 1),
      }}>
        <div style={{
          position: 'relative',
          width: '100%', height: '100%',
          background: imgBg,
          borderRadius: 12,
          overflow: 'hidden',
          boxShadow: imgFrame === 'shadow'
            ? '0 24px 60px rgba(15,30,27,0.18), 0 4px 12px rgba(15,30,27,0.08)'
            : 'none',
          border: `1px solid ${SOP_PALETTE.line}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {/* Inner aspect-locked stack so highlights align with the actual rendered image */}
          <div style={{
            position: 'relative',
            ...(imgAspect && imgFit === 'contain'
              ? { aspectRatio: String(imgAspect), maxWidth: '100%', maxHeight: '100%', width: 'auto', height: '100%' }
              : { width: '100%', height: '100%' }),
            overflow: 'hidden',
          }}>
          {/* Use a CSS trick: when aspectRatio is set, height=100% forces width = h*aspect, but width is also bounded by max-width:100%. Browsers handle correctly. */}
          <img src={src} alt="" style={{
            width: '100%', height: '100%',
            objectFit: imgFit,
            objectPosition: 'center',
            display: 'block',
            transform: `scale(${kbScale}) translate(${kbX}%, ${kbY}%)`,
            transformOrigin: 'center',
            transition: 'transform 0.1s linear',
          }} />
          {/* Highlights */}
          {highlights.map((h, i) => {
            const hStart = h.start || 0;
            const hEnd = h.end || 0.95;
            const localProg = clamp((progress - hStart) / (hEnd - hStart), 0, 1);
            const visible = progress >= hStart && progress <= hEnd + 0.05;
            const opacity = visible ? Easing.easeOutCubic(clamp(localProg * 3, 0, 1)) * (1 - clamp((progress - hEnd) * 6, 0, 1)) : 0;
            const pulse = 1 + Math.sin(localTime * 3) * 0.015;
            const color = h.color || SOP_PALETTE.terracotta;
            return (
              <div key={i} style={{
                position: 'absolute',
                left: `${h.x}%`, top: `${h.y}%`,
                width: `${h.w}%`, height: `${h.h}%`,
                border: `4px solid ${color}`,
                borderRadius: 8,
                opacity,
                transform: `scale(${pulse})`,
                pointerEvents: 'none',
                boxShadow: `0 0 0 4px ${color}22, 0 4px 16px ${color}55`,
              }}>
                {h.label && (
                  <div style={{
                    position: 'absolute',
                    left: 0, top: '100%', marginTop: 8,
                    background: color, color: SOP_PALETTE.paper,
                    padding: '6px 12px',
                    borderRadius: 6,
                    fontFamily: FONT_BODY, fontSize: 13, fontWeight: 700,
                    letterSpacing: '0.06em',
                    whiteSpace: 'nowrap',
                    textTransform: 'uppercase',
                  }}>{h.label}</div>
                )}
              </div>
            );
          })}
          </div>
        </div>
      </div>
    </div>
  );
}

// Big stat scene: a hero number with caption
function BigStatScene({ stat, caption, sub, accent = SOP_PALETTE.terracotta }) {
  const { progress } = useSprite();
  const fade = Easing.easeOutCubic(clamp(progress * 4, 0, 1));
  const numScale = 0.85 + 0.15 * Easing.easeOutBack(clamp(progress * 3, 0, 1));
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: SOP_PALETTE.paper,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
      padding: '80px',
    }}>
      <div style={{
        opacity: fade,
        fontFamily: FONT_BODY, fontSize: 18, fontWeight: 700,
        color: accent, letterSpacing: '0.24em',
        textTransform: 'uppercase', marginBottom: 32,
      }}>{caption}</div>
      <div style={{
        opacity: fade,
        transform: `scale(${numScale})`,
        fontFamily: FONT_DISPLAY,
        fontSize: 280, fontWeight: 900,
        color: SOP_PALETTE.bosque,
        lineHeight: 0.9, letterSpacing: '-0.04em',
      }}>{stat}</div>
      {sub && (
        <div style={{
          opacity: clamp((progress - 0.2) * 3, 0, 1),
          marginTop: 40,
          fontFamily: FONT_BODY, fontSize: 30, fontWeight: 500,
          color: SOP_PALETTE.cypress,
          maxWidth: 1200, textAlign: 'center',
          lineHeight: 1.35,
        }}>{sub}</div>
      )}
    </div>
  );
}

// Comparison scene: 2–4 cards with image + label
function ComparisonScene({ title, sub, items }) {
  const { progress } = useSprite();
  const fade = Easing.easeOutCubic(clamp(progress * 5, 0, 1));
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: SOP_PALETTE.paper,
      padding: '110px 80px 70px',
    }}>
      <div style={{
        opacity: fade,
        textAlign: 'center', marginBottom: 30,
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 56, fontWeight: 900,
          color: SOP_PALETTE.bosque, letterSpacing: '-0.015em',
          textTransform: 'uppercase', lineHeight: 1,
        }}>{title}</div>
        {sub && (
          <div style={{
            marginTop: 14,
            fontFamily: FONT_BODY, fontSize: 22, fontWeight: 400,
            color: SOP_PALETTE.muted,
          }}>{sub}</div>
        )}
      </div>
      <div style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${items.length}, 1fr)`,
        gap: 28,
        marginTop: 20,
      }}>
        {items.map((item, i) => {
          const cardP = clamp((progress * 5) - 0.6 - i * 0.3, 0, 1);
          const cardFade = Easing.easeOutCubic(clamp(cardP * 1.5, 0, 1));
          return (
            <div key={i} style={{
              opacity: cardFade,
              transform: `translateY(${(1 - cardFade) * 24}px)`,
              background: item.bg || SOP_PALETTE.mistSoft,
              border: `1px solid ${SOP_PALETTE.line}`,
              borderTop: `6px solid ${item.accent || SOP_PALETTE.bosque}`,
              borderRadius: 12,
              padding: 28,
              display: 'flex', flexDirection: 'column',
              boxShadow: '0 8px 24px rgba(15,30,27,0.06)',
              minHeight: 540,
            }}>
              {item.tag && (
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 12, fontWeight: 700,
                  color: item.accent || SOP_PALETTE.bosque,
                  letterSpacing: '0.18em', textTransform: 'uppercase',
                  marginBottom: 12,
                }}>{item.tag}</div>
              )}
              <div style={{
                fontFamily: FONT_DISPLAY, fontSize: 32, fontWeight: 900,
                color: SOP_PALETTE.bosque, lineHeight: 1.02,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
                marginBottom: 16,
              }}>{item.label}</div>
              {item.src && (
                <div style={{
                  flex: 1,
                  background: SOP_PALETTE.paper,
                  borderRadius: 8,
                  overflow: 'hidden',
                  border: `1px solid ${SOP_PALETTE.line}`,
                  marginBottom: 16,
                  minHeight: 240,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <img src={item.src} alt="" style={{
                    width: '100%', height: '100%',
                    objectFit: 'contain', display: 'block',
                  }} />
                </div>
              )}
              {item.desc && (
                <div style={{
                  fontFamily: FONT_BODY, fontSize: 17, fontWeight: 500,
                  color: SOP_PALETTE.cypress,
                  lineHeight: 1.45,
                }}>{item.desc}</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Steps scene: animated numbered list
function StepsScene({ title, sub, steps }) {
  const { progress } = useSprite();
  const fade = Easing.easeOutCubic(clamp(progress * 5, 0, 1));
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: SOP_PALETTE.paper,
      padding: '110px 120px 70px',
    }}>
      <div style={{
        opacity: fade,
        marginBottom: 40,
      }}>
        <div style={{
          fontFamily: FONT_DISPLAY, fontSize: 64, fontWeight: 900,
          color: SOP_PALETTE.bosque, letterSpacing: '-0.015em',
          textTransform: 'uppercase', lineHeight: 1,
        }}>{title}</div>
        {sub && (
          <div style={{
            marginTop: 16,
            fontFamily: FONT_BODY, fontSize: 24, fontWeight: 400,
            color: SOP_PALETTE.muted,
          }}>{sub}</div>
        )}
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        {steps.map((s, i) => {
          const sp = clamp((progress * 4) - 0.4 - i * 0.5, 0, 1);
          const sf = Easing.easeOutCubic(clamp(sp * 1.5, 0, 1));
          return (
            <div key={i} style={{
              opacity: sf,
              transform: `translateX(${(1 - sf) * -20}px)`,
              display: 'flex', alignItems: 'flex-start', gap: 26,
            }}>
              <div style={{
                width: 60, height: 60, borderRadius: '50%',
                background: SOP_PALETTE.bosque,
                color: SOP_PALETTE.paper,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: FONT_DISPLAY, fontSize: 24, fontWeight: 900,
                flexShrink: 0,
              }}>{i + 1}</div>
              <div style={{ flex: 1, paddingTop: 8 }}>
                <div style={{
                  fontFamily: FONT_DISPLAY, fontSize: 30, fontWeight: 900,
                  color: SOP_PALETTE.bosque, lineHeight: 1.05,
                  letterSpacing: '-0.01em',
                  textTransform: 'uppercase',
                }}>{s.label}</div>
                {s.desc && (
                  <div style={{
                    marginTop: 8,
                    fontFamily: FONT_BODY, fontSize: 20, fontWeight: 400,
                    color: SOP_PALETTE.cypress, lineHeight: 1.45,
                    maxWidth: 1400,
                  }}>{s.desc}</div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Outro scene: closing card with tagline
function OutroScene({ title, sub }) {
  const { progress } = useSprite();
  const fade = Easing.easeOutCubic(clamp(progress * 3, 0, 1));
  return (
    <div style={{
      position: 'absolute', inset: 0,
      background: SOP_PALETTE.bosque,
      display: 'flex', flexDirection: 'column',
      alignItems: 'center', justifyContent: 'center',
    }}>
      {/* Decorative curve */}
      <div style={{
        position: 'absolute', left: -300, bottom: -300,
        width: 700, height: 700,
        borderRadius: '50%',
        background: SOP_PALETTE.terracotta,
        opacity: 0.18,
      }} />
      <div style={{
        position: 'absolute', right: -200, top: -200,
        width: 500, height: 500,
        borderRadius: '50%',
        background: SOP_PALETTE.cypress,
        opacity: 0.35,
      }} />
      <div style={{
        opacity: fade,
        fontFamily: FONT_BODY, fontSize: 18, fontWeight: 700,
        color: SOP_PALETTE.terracotta, letterSpacing: '0.24em',
        textTransform: 'uppercase', marginBottom: 32,
        zIndex: 2,
      }}>That's the procedure</div>
      <div style={{
        opacity: fade,
        fontFamily: FONT_DISPLAY, fontSize: 76, fontWeight: 900,
        color: SOP_PALETTE.paper, letterSpacing: '-0.02em',
        textTransform: 'uppercase', textAlign: 'center',
        maxWidth: 1500, lineHeight: 1, zIndex: 2,
      }}>{title}</div>
      {sub && (
        <div style={{
          opacity: clamp((progress - 0.15) * 3, 0, 1),
          marginTop: 28,
          fontFamily: FONT_BODY, fontSize: 22, fontWeight: 400,
          color: 'rgba(232,241,238,0.85)',
          maxWidth: 1100, textAlign: 'center', lineHeight: 1.5, zIndex: 2,
        }}>{sub}</div>
      )}
      {/* Logo on a paper chip */}
      <div style={{
        opacity: clamp((progress - 0.32) * 3, 0, 1),
        marginTop: 56,
        background: SOP_PALETTE.paper,
        padding: '20px 40px',
        borderRadius: 16,
        boxShadow: '0 16px 40px rgba(0,0,0,0.28)',
        zIndex: 2,
      }}>
        <img src="../assets/bernco-assessor-logo.png" alt="BernCo County Assessor — Damian R. Lara"
          style={{ height: 110, width: 'auto', display: 'block' }} />
      </div>
      <div style={{
        opacity: clamp((progress - 0.5) * 3, 0, 1),
        marginTop: 28,
        fontFamily: FONT_DISPLAY, fontSize: 44, fontWeight: 900,
        color: SOP_PALETTE.terracotta, letterSpacing: '0',
        textTransform: 'lowercase', zIndex: 2,
      }}>Count on us.</div>
    </div>
  );
}

// ────────────────────────────────────────────────────────────────
// Scene dispatcher
// ────────────────────────────────────────────────────────────────

function Scene({ scene }) {
  switch (scene.kind) {
    case 'title': return <TitleScene {...scene} />;
    case 'screenshot': return <ScreenshotScene {...scene} />;
    case 'bigstat': return <BigStatScene {...scene} />;
    case 'comparison': return <ComparisonScene {...scene} />;
    case 'steps': return <StepsScene {...scene} />;
    case 'outro': return <OutroScene {...scene} />;
    default: return null;
  }
}

// ────────────────────────────────────────────────────────────────
// Main SOPVideo component
// ────────────────────────────────────────────────────────────────

function SOPVideo({ sopId, title, scenes }) {
  // Compute scene start/end times
  let t = 0;
  const timed = scenes.map(s => {
    const start = t;
    const end = t + s.duration;
    t = end;
    return { ...s, start, end };
  });
  const totalDuration = t;

  function ScreenLabel() {
    const time = useTime();
    React.useEffect(() => {
      const root = document.getElementById('video-root');
      if (root) {
        const sec = Math.floor(time);
        root.setAttribute('data-screen-label', `${sopId} · ${sec.toString().padStart(2,'0')}s`);
      }
    }, [Math.floor(time)]);
    return null;
  }

  function ChromeWrapper() {
    const time = useTime();
    const currentSceneIdx = timed.findIndex(s => time >= s.start && time < s.end);
    return <BrandChrome sopId={sopId} title={title} scenes={timed} currentSceneIdx={currentSceneIdx === -1 ? timed.length - 1 : currentSceneIdx} />;
  }

  return (
    <div id="video-root" data-screen-label={`${sopId} · 00s`}>
      <Stage
        width={1920} height={1080}
        duration={totalDuration}
        background={SOP_PALETTE.paper}
        persistKey={`sop-${sopId}`}
      >
        <ScreenLabel />
        {timed.map((s, i) => (
          <Sprite key={i} start={s.start} end={s.end}>
            <Scene scene={s} />
          </Sprite>
        ))}
        <ChromeWrapper />
      </Stage>
    </div>
  );
}

Object.assign(window, {
  SOPVideo, SOP_PALETTE,
  TitleScene, ScreenshotScene, BigStatScene, ComparisonScene, StepsScene, OutroScene,
});
