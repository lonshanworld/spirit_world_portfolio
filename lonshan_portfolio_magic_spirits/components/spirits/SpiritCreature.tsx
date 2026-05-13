'use client';

/**
 * SpiritCreature — Full elemental creature visual system.
 *
 * Each spirit is a living creature with:
 *   - Unique SVG silhouette (14 distinct body shapes)
 *   - 2 expressive eyes tracking the user's cursor
 *   - 2 arms + 3 fingers per hand (raised on hover)
 *   - Emotion-driven visual state (eye scale, body tilt, glow, bounce)
 *   - Blinking, speaking mouth animation
 */

import { motion } from 'framer-motion';
import { useRef, useState, useEffect, useCallback } from 'react';
import { ElementType, EmotionType } from '../../types/spirit.types';
import { SPIRIT_DEFINITIONS } from '../../systems/elementData';
import { useWorldStore } from '../../store/worldStore';
import { CURSOR } from '../../utils/cursorRef';

// ─── Emotion → Visual Mapping ──────────────────────────────────────────────────

const EV: Record<
  EmotionType,
  { eyeScaleY: number; eyeOffsetY: number; glow: number; tilt: number; bounce: boolean }
> = {
  neutral:    { eyeScaleY: 1.00, eyeOffsetY:  0, glow: 0.60, tilt:  0, bounce: false },
  excited:    { eyeScaleY: 1.40, eyeOffsetY: -2, glow: 1.00, tilt:  0, bounce: true  },
  calm:       { eyeScaleY: 0.70, eyeOffsetY:  1, glow: 0.40, tilt:  0, bounce: false },
  mysterious: { eyeScaleY: 0.60, eyeOffsetY:  0, glow: 0.45, tilt: -4, bounce: false },
  playful:    { eyeScaleY: 1.25, eyeOffsetY: -1, glow: 0.80, tilt:  7, bounce: true  },
  happy:      { eyeScaleY: 1.20, eyeOffsetY: -1, glow: 0.85, tilt:  3, bounce: true  },
  sad:        { eyeScaleY: 0.55, eyeOffsetY:  3, glow: 0.30, tilt: -3, bounce: false },
  surprised:  { eyeScaleY: 1.50, eyeOffsetY: -3, glow: 0.95, tilt:  0, bounce: false },
  angry:      { eyeScaleY: 0.65, eyeOffsetY:  0, glow: 0.90, tilt: -2, bounce: false },
  embarrassed:{ eyeScaleY: 0.80, eyeOffsetY:  2, glow: 0.55, tilt:  5, bounce: false },
  sleepy:     { eyeScaleY: 0.35, eyeOffsetY:  2, glow: 0.25, tilt:  3, bounce: false },
  confused:   { eyeScaleY: 1.10, eyeOffsetY: -1, glow: 0.65, tilt: 10, bounce: false },
  proud:      { eyeScaleY: 0.90, eyeOffsetY: -2, glow: 0.95, tilt: -6, bounce: false },
  curious:    { eyeScaleY: 1.30, eyeOffsetY: -2, glow: 0.75, tilt:  5, bounce: false },
  scared:     { eyeScaleY: 1.55, eyeOffsetY: -4, glow: 0.80, tilt: -2, bounce: false },
};

// ─── Per-Spirit Config ─────────────────────────────────────────────────────────

interface EyeCfg {
  cx: number; cy: number; rx: number; ry: number; pr: number;
  eyeCol: string; pupilCol: string;
}
interface ArmCfg { x: number; y: number; }
interface SCfg   { eL: EyeCfg; eR: EyeCfg; aL: ArmCfg; aR: ArmCfg; mCx: number; mCy: number; }

const SC: Record<ElementType, SCfg> = {
  fire:      { eL:{cx:35,cy:56,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(255,240,220,.95)',pupilCol:'#3a1200'},   eR:{cx:65,cy:56,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(255,240,220,.95)',pupilCol:'#3a1200'},   aL:{x:15,y:68},aR:{x:85,y:68},mCx:50,mCy:72 },
  water:     { eL:{cx:35,cy:68,rx:7.5,ry:9,  pr:4,  eyeCol:'rgba(220,240,255,.95)',pupilCol:'#001440'},   eR:{cx:65,cy:68,rx:7.5,ry:9,  pr:4,  eyeCol:'rgba(220,240,255,.95)',pupilCol:'#001440'},   aL:{x:10,y:82},aR:{x:90,y:82},mCx:50,mCy:86 },
  ice:       { eL:{cx:35,cy:52,rx:7,  ry:7.5,pr:3.5,eyeCol:'rgba(230,248,255,.90)',pupilCol:'#0a3060'},   eR:{cx:65,cy:52,rx:7,  ry:7.5,pr:3.5,eyeCol:'rgba(230,248,255,.90)',pupilCol:'#0a3060'},   aL:{x:16,y:63},aR:{x:84,y:63},mCx:50,mCy:70 },
  wind:      { eL:{cx:35,cy:52,rx:6.5,ry:7.5,pr:3.5,eyeCol:'rgba(220,255,240,.85)',pupilCol:'#0a3020'},   eR:{cx:65,cy:52,rx:6.5,ry:7.5,pr:3.5,eyeCol:'rgba(220,255,240,.85)',pupilCol:'#0a3020'},   aL:{x:12,y:62},aR:{x:88,y:62},mCx:50,mCy:68 },
  soil:      { eL:{cx:35,cy:70,rx:7.5,ry:7.5,pr:4,  eyeCol:'rgba(255,245,220,.90)',pupilCol:'#3a2000'},   eR:{cx:65,cy:70,rx:7.5,ry:7.5,pr:4,  eyeCol:'rgba(255,245,220,.90)',pupilCol:'#3a2000'},   aL:{x:10,y:82},aR:{x:90,y:82},mCx:50,mCy:88 },
  trees:     { eL:{cx:35,cy:62,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(220,255,220,.90)',pupilCol:'#0a3010'},   eR:{cx:65,cy:62,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(220,255,220,.90)',pupilCol:'#0a3010'},   aL:{x:12,y:76},aR:{x:88,y:76},mCx:50,mCy:82 },
  lightning: { eL:{cx:35,cy:58,rx:7,  ry:8,  pr:4,  eyeCol:'rgba(255,255,220,.95)',pupilCol:'#2a2000'},   eR:{cx:65,cy:58,rx:7,  ry:8,  pr:4,  eyeCol:'rgba(255,255,220,.95)',pupilCol:'#2a2000'},   aL:{x:14,y:66},aR:{x:86,y:66},mCx:50,mCy:74 },
  dark:      { eL:{cx:33,cy:60,rx:9,  ry:10, pr:5,  eyeCol:'rgba(30,20,50,.60)',   pupilCol:'rgba(200,150,255,.95)'}, eR:{cx:67,cy:60,rx:9,  ry:10, pr:5,  eyeCol:'rgba(30,20,50,.60)',   pupilCol:'rgba(200,150,255,.95)'}, aL:{x:10,y:72},aR:{x:90,y:72},mCx:50,mCy:80 },
  light:     { eL:{cx:35,cy:56,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(255,255,240,.98)',pupilCol:'#3a3000'},   eR:{cx:65,cy:56,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(255,255,240,.98)',pupilCol:'#3a3000'},   aL:{x:10,y:66},aR:{x:90,y:66},mCx:50,mCy:74 },
  healing:   { eL:{cx:35,cy:62,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(220,255,235,.95)',pupilCol:'#0a3018'},   eR:{cx:65,cy:62,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(220,255,235,.95)',pupilCol:'#0a3018'},   aL:{x:12,y:76},aR:{x:88,y:76},mCx:50,mCy:82 },
  void:      { eL:{cx:32,cy:58,rx:10, ry:11, pr:5.5,eyeCol:'rgba(15,10,30,.80)',   pupilCol:'rgba(180,120,255,1)'},  eR:{cx:68,cy:58,rx:10, ry:11, pr:5.5,eyeCol:'rgba(15,10,30,.80)',   pupilCol:'rgba(180,120,255,1)'},  aL:{x:10,y:68},aR:{x:90,y:68},mCx:50,mCy:78 },
  space:     { eL:{cx:35,cy:58,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(20,15,50,.80)',   pupilCol:'rgba(200,200,255,.95)'},eR:{cx:65,cy:58,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(20,15,50,.80)',   pupilCol:'rgba(200,200,255,.95)'},aL:{x:10,y:68},aR:{x:90,y:68},mCx:50,mCy:76 },
  time:      { eL:{cx:35,cy:44,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(255,248,220,.95)',pupilCol:'#2a1800'},   eR:{cx:65,cy:44,rx:7.5,ry:8.5,pr:4,  eyeCol:'rgba(255,248,220,.95)',pupilCol:'#2a1800'},   aL:{x:12,y:55},aR:{x:88,y:55},mCx:50,mCy:58 },
  robot:     { eL:{cx:33,cy:52,rx:10, ry:11, pr:5.5,eyeCol:'rgba(20,30,60,.90)',   pupilCol:'rgba(80,180,255,1)'},   eR:{cx:67,cy:52,rx:10, ry:11, pr:5.5,eyeCol:'rgba(20,30,60,.90)',   pupilCol:'rgba(80,180,255,1)'},   aL:{x:12,y:72},aR:{x:88,y:72},mCx:50,mCy:82 },
};

// ─── Body SVG per Element ───────────────────────────────────────────────────────

function SpiritBody({
  element, primary, secondary, glow, gId,
}: {
  element: ElementType; primary: string; secondary: string; glow: string; gId: string;
}) {
  // gId is a per-instance unique gradient ID to prevent cross-instance gradient leakage
  const g = gId;

  switch (element) {
    case 'fire':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="65%" r="65%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.95" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.88" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.50" />
            </radialGradient>
          </defs>
          {/* Flame body */}
          <path
            d="M 50 108 C 25 100 12 80 16 58 C 20 42 28 26 36 14 C 40 6 60 6 64 14 C 72 26 80 42 84 58 C 88 80 75 100 50 108 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.8" strokeOpacity="0.4"
          />
          {/* Inner flame core */}
          <path
            d="M 50 96 C 36 90 28 76 32 60 C 35 50 42 38 46 26 C 48 20 52 20 54 26 C 58 38 65 50 68 60 C 72 76 64 90 50 96 Z"
            fill="rgba(255,255,200,0.20)"
          />
          {/* Flame tip glow */}
          <ellipse cx="50" cy="11" rx="5" ry="7" fill="rgba(255,255,180,0.45)" />
        </>
      );

    case 'water':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="42%" cy="45%" r="65%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.95" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.85" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.50" />
            </radialGradient>
          </defs>
          {/* Droplet body */}
          <path
            d="M 50 108 C 22 108 8 90 8 70 C 8 48 20 30 33 18 C 40 11 46 7 50 5 C 54 7 60 11 67 18 C 80 30 92 48 92 70 C 92 90 78 108 50 108 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.8" strokeOpacity="0.3"
          />
          {/* Shimmer highlight */}
          <ellipse cx="38" cy="40" rx="11" ry="7" fill="rgba(255,255,255,0.14)" transform="rotate(-20,38,40)" />
        </>
      );

    case 'ice':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="45%" cy="45%" r="60%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.90" />
              <stop offset="60%"  stopColor={primary}   stopOpacity="0.75" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.40" />
            </radialGradient>
          </defs>
          {/* Hexagonal body */}
          <polygon
            points="50,8 72,22 84,50 84,78 72,100 50,110 28,100 16,78 16,50 28,22"
            fill={`url(#${g})`} stroke={secondary} strokeWidth="1.2" strokeOpacity="0.7"
          />
          {/* Facet lines */}
          <line x1="50" y1="8"  x2="50" y2="110" stroke={secondary} strokeWidth="0.5" strokeOpacity="0.25" />
          <line x1="16" y1="50" x2="84" y2="50"  stroke={secondary} strokeWidth="0.5" strokeOpacity="0.25" />
          {/* Frost sparkle */}
          <ellipse cx="44" cy="38" rx="11" ry="7" fill="rgba(255,255,255,0.13)" transform="rotate(-10,44,38)" />
          {/* Ice spike tips */}
          <polygon points="50,2 52,10 48,10"   fill={secondary} opacity="0.6" />
          <polygon points="84,50 90,52 90,48"  fill={secondary} opacity="0.5" />
          <polygon points="16,50 10,52 10,48"  fill={secondary} opacity="0.5" />
        </>
      );

    case 'wind':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.70" />
              <stop offset="100%" stopColor={primary}   stopOpacity="0.28" />
            </radialGradient>
          </defs>
          {/* Wispy elongated body — ethereal and transparent */}
          <path
            d="M 50 8 C 30 8 12 26 12 55 C 12 82 30 108 50 108 C 70 108 88 82 88 55 C 88 26 70 8 50 8 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.5" strokeOpacity="0.40"
          />
          {/* Wind swirl lines */}
          <path d="M 28 44 Q 50 37 72 44" stroke={secondary} strokeWidth="1.2" fill="none" strokeOpacity="0.50" strokeLinecap="round" />
          <path d="M 26 62 Q 50 55 74 62" stroke={secondary} strokeWidth="1.0" fill="none" strokeOpacity="0.35" strokeLinecap="round" />
          <path d="M 30 80 Q 50 73 70 80" stroke={secondary} strokeWidth="0.8" fill="none" strokeOpacity="0.25" strokeLinecap="round" />
        </>
      );

    case 'soil':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="60%" r="65%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.90" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.85" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.55" />
            </radialGradient>
          </defs>
          {/* Wide squat rocky body */}
          <path
            d="M 50 110 C 20 110 8 94 8 76 C 8 54 18 38 30 30 C 36 26 42 24 50 24 C 58 24 64 26 70 30 C 82 38 92 54 92 76 C 92 94 80 110 50 110 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="1" strokeOpacity="0.50"
          />
          {/* Rock texture cracks */}
          <path d="M 22 72 Q 28 68 36 74" stroke={secondary} strokeWidth="1.5" fill="none" strokeOpacity="0.40" strokeLinecap="round" />
          <path d="M 60 36 Q 68 33 74 40"  stroke={secondary} strokeWidth="1.5" fill="none" strokeOpacity="0.35" strokeLinecap="round" />
          {/* Ground shadow */}
          <ellipse cx="50" cy="100" rx="32" ry="4" fill="rgba(0,0,0,0.12)" />
        </>
      );

    case 'trees':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="55%" r="60%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.90" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.85" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.50" />
            </radialGradient>
          </defs>
          {/* Leaf ears */}
          <path d="M 30 36 C 18 26 14 12 24 8 C 34 4 40 18 34 30 Z" fill={primary} opacity="0.85" />
          <path d="M 70 36 C 82 26 86 12 76 8 C 66 4 60 18 66 30 Z" fill={primary} opacity="0.85" />
          {/* Leaf veins */}
          <line x1="24" y1="18" x2="34" y2="28" stroke={secondary} strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          <line x1="76" y1="18" x2="66" y2="28" stroke={secondary} strokeWidth="0.8" strokeOpacity="0.6" strokeLinecap="round" />
          {/* Round body */}
          <path
            d="M 50 108 C 24 108 10 90 10 68 C 10 46 24 32 50 32 C 76 32 90 46 90 68 C 90 90 76 108 50 108 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.8" strokeOpacity="0.50"
          />
          {/* Leaf accent on body */}
          <path d="M 38 92 Q 50 88 62 92" stroke={secondary} strokeWidth="1" fill="none" strokeOpacity="0.4" strokeLinecap="round" />
        </>
      );

    case 'lightning':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="50%" r="60%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.95" />
              <stop offset="50%"  stopColor={primary}   stopOpacity="0.88" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.55" />
            </radialGradient>
          </defs>
          {/* 8-pointed star burst */}
          <polygon
            points="50,10 57,36 80,28 67,50 90,58 67,66 76,92 50,78 24,92 33,66 10,58 33,50 20,28 43,36"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.8" strokeOpacity="0.60"
          />
          {/* Electric core glow */}
          <ellipse cx="50" cy="58" rx="14" ry="14" fill="rgba(255,255,180,0.18)" />
          <ellipse cx="50" cy="58" rx="6"  ry="6"  fill="rgba(255,255,220,0.30)" />
        </>
      );

    case 'dark':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="50%" r="60%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.60" />
              <stop offset="65%"  stopColor={primary}   stopOpacity="0.85" />
              <stop offset="100%" stopColor="#050008"    stopOpacity="0.97" />
            </radialGradient>
          </defs>
          {/* Amorphous smoky body */}
          <path
            d="M 50 12 C 32 10 15 22 12 40 C 9 56 16 70 10 82 C 5 96 18 114 36 112 C 44 114 56 114 64 112 C 82 114 95 96 90 82 C 84 70 91 56 88 40 C 85 22 68 10 50 12 Z"
            fill={`url(#${g})`}
          />
          {/* Smoky wisps */}
          <path d="M 18 36 Q 26 26 34 34" stroke={glow} strokeWidth="2" fill="none" strokeOpacity="0.30" strokeLinecap="round" />
          <path d="M 82 36 Q 74 26 66 34" stroke={glow} strokeWidth="2" fill="none" strokeOpacity="0.25" strokeLinecap="round" />
          {/* Dark edge vignette */}
          <ellipse cx="50" cy="62" rx="44" ry="52" fill="none" stroke="#000008" strokeWidth="4" strokeOpacity="0.30" />
        </>
      );

    case 'light':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="45%" r="65%">
              <stop offset="0%"   stopColor="rgba(255,255,255,0.98)" />
              <stop offset="40%"  stopColor={secondary} stopOpacity="0.90" />
              <stop offset="100%" stopColor={primary}   stopOpacity="0.70" />
            </radialGradient>
          </defs>
          {/* Pure radiant oval */}
          <path
            d="M 50 8 C 26 8 8 28 8 58 C 8 88 26 108 50 108 C 74 108 92 88 92 58 C 92 28 74 8 50 8 Z"
            fill={`url(#${g})`} stroke="rgba(255,255,255,0.5)" strokeWidth="1"
          />
          {/* Radiance bloom highlight */}
          <ellipse cx="44" cy="36" rx="12" ry="8" fill="rgba(255,255,255,0.22)" transform="rotate(-15,44,36)" />
          {/* Holy cross sparkle */}
          <line x1="50" y1="16" x2="50" y2="28" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
          <line x1="44" y1="22" x2="56" y2="22" stroke="rgba(255,255,255,0.6)" strokeWidth="1.5" strokeLinecap="round" />
        </>
      );

    case 'healing':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="55%" r="60%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.90" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.82" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.48" />
            </radialGradient>
          </defs>
          {/* Cloud puff cheeks */}
          <circle cx="12" cy="70" r="11" fill={primary} opacity="0.60" />
          <circle cx="88" cy="70" r="11" fill={primary} opacity="0.60" />
          {/* Round body */}
          <path
            d="M 50 108 C 26 108 10 90 10 70 C 10 50 26 34 50 34 C 74 34 90 50 90 70 C 90 90 74 108 50 108 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.8" strokeOpacity="0.40"
          />
          {/* Heart glow on chest */}
          <path
            d="M 50 76 L 42 69 Q 40 64 44 62 Q 48 60 50 65 Q 52 60 56 62 Q 60 64 58 69 Z"
            fill="rgba(255,140,180,0.28)"
          />
        </>
      );

    case 'void':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="50%" r="55%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.40" />
              <stop offset="60%"  stopColor={primary}   stopOpacity="0.72" />
              <stop offset="100%" stopColor="#000008"    stopOpacity="0.98" />
            </radialGradient>
          </defs>
          {/* Dark sphere */}
          <path
            d="M 50 14 C 24 14 8 34 8 60 C 8 86 24 106 50 106 C 76 106 92 86 92 60 C 92 34 76 14 50 14 Z"
            fill={`url(#${g})`}
          />
          {/* Event horizon rings */}
          <ellipse cx="50" cy="60" rx="44" ry="44" fill="none" stroke={glow}    strokeWidth="2.0" strokeOpacity="0.30" />
          <ellipse cx="50" cy="60" rx="40" ry="40" fill="none" stroke={secondary} strokeWidth="0.6" strokeOpacity="0.18" />
        </>
      );

    case 'space':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="42%" r="65%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.80" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.92" />
              <stop offset="100%" stopColor="#04020e"    stopOpacity="0.97" />
            </radialGradient>
          </defs>
          {/* Sphere */}
          <path
            d="M 50 14 C 24 14 8 34 8 60 C 8 86 24 106 50 106 C 76 106 92 86 92 60 C 92 34 76 14 50 14 Z"
            fill={`url(#${g})`}
          />
          {/* Orbital ring (3D perspective ellipse) */}
          <ellipse
            cx="50" cy="60" rx="48" ry="12" fill="none"
            stroke={secondary} strokeWidth="2.2" strokeOpacity="0.55"
            transform="rotate(-20,50,60)"
          />
          {/* Nebula wisps */}
          <path d="M 20 50 Q 35 44 50 50" stroke={glow} strokeWidth="1.2" fill="none" strokeOpacity="0.30" strokeLinecap="round" />
          {/* Star freckles */}
          <circle cx="34" cy="36" r="1" fill="white" opacity="0.6" />
          <circle cx="62" cy="32" r="0.8" fill="white" opacity="0.5" />
          <circle cx="72" cy="70" r="0.8" fill="white" opacity="0.4" />
        </>
      );

    case 'time':
      return (
        <>
          <defs>
            <radialGradient id={g} cx="50%" cy="40%" r="65%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.92" />
              <stop offset="55%"  stopColor={primary}   stopOpacity="0.85" />
              <stop offset="100%" stopColor={glow}       stopOpacity="0.52" />
            </radialGradient>
          </defs>
          {/* Hourglass */}
          <path
            d="M 22 12 L 78 12 C 86 12 88 22 82 32 L 58 58 L 82 84 C 88 94 86 108 78 108 L 22 108 C 14 108 12 94 18 84 L 42 58 L 18 32 C 12 22 14 12 22 12 Z"
            fill={`url(#${g})`} stroke={primary} strokeWidth="0.9" strokeOpacity="0.50"
          />
          {/* Sand/particle at waist */}
          <ellipse cx="50" cy="58" rx="5" ry="2.5" fill={secondary} opacity="0.55" />
          {/* Clock tick marks at top */}
          <line x1="50" y1="14" x2="50" y2="21" stroke={secondary} strokeWidth="1.8" strokeOpacity="0.65" strokeLinecap="round" />
          <line x1="50" y1="99" x2="50" y2="106" stroke={secondary} strokeWidth="1.8" strokeOpacity="0.65" strokeLinecap="round" />
          {/* Frame edge lines */}
          <line x1="22" y1="12" x2="78" y2="12"  stroke={secondary} strokeWidth="2" strokeOpacity="0.50" />
          <line x1="22" y1="108" x2="78" y2="108" stroke={secondary} strokeWidth="2" strokeOpacity="0.50" />
        </>
      );

    case 'robot':
      return (
        <>
          <defs>
            <linearGradient id={g} x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%"   stopColor={secondary} stopOpacity="0.90" />
              <stop offset="100%" stopColor={primary}   stopOpacity="0.78" />
            </linearGradient>
          </defs>
          {/* Rounded rect chassis */}
          <path
            d="M 26 20 L 74 20 C 82 20 88 26 88 36 L 88 88 C 88 98 82 108 72 108 L 28 108 C 18 108 12 98 12 88 L 12 36 C 12 26 18 20 26 20 Z"
            fill={`url(#${g})`} stroke={secondary} strokeWidth="1" strokeOpacity="0.60"
          />
          {/* Panel division line */}
          <line x1="12" y1="68" x2="88" y2="68" stroke={secondary} strokeWidth="0.7" strokeOpacity="0.40" />
          {/* Antennas */}
          <line x1="40" y1="20" x2="36" y2="9"  stroke={secondary} strokeWidth="1.8" strokeOpacity="0.75" strokeLinecap="round" />
          <circle cx="36" cy="7" r="2.8" fill={glow} opacity="0.90" />
          <line x1="60" y1="20" x2="64" y2="9"  stroke={secondary} strokeWidth="1.8" strokeOpacity="0.75" strokeLinecap="round" />
          <circle cx="64" cy="7" r="2.8" fill={glow} opacity="0.90" />
          {/* Chest status indicator */}
          <rect x="43" y="80" width="14" height="7" rx="2" fill={glow} opacity="0.40" />
          <rect x="45" y="82" width="4" height="3" rx="1" fill={glow} opacity="0.80" />
        </>
      );

    default:
      return null;
  }
}

// ─── Gesture System ────────────────────────────────────────────────────────────
// Determines arm / hand / finger animation targets from emotion + context.

type GestureId =
  | 'rest'          // floating relaxed
  | 'wave'          // single arm wave
  | 'cheer'         // both arms raised wide
  | 'explain'       // one arm out, gesturing
  | 'point'         // one arm pointed forward
  | 'facepalm'      // left hand to face
  | 'cross'         // arms folded over chest
  | 'cast'          // magical spell pose
  | 'nod'           // listening bob — head/arm gentle pulse
  | 'sag'           // arms hanging low (sad)
  | 'shrug'         // arms slightly raised + shrug tilt
  | 'recoil'        // arms pulled in close (embarrassed)
  | 'clap'          // both hands together (happy)
  | 'lean'          // one arm forward (curious)
  | 'bristle'       // arms wide + rigid (angry)
  | 'thumbsUp';     // proud 3-finger thumbs-up equivalent

/** Pick the dominant gesture for this context, in priority order. */
function pickGesture(
  emotion: EmotionType,
  isSpeaking: boolean,
  isHovered: boolean,
  isListening: boolean,
  isCasting: boolean,
): GestureId {
  // Arms raise into casting pose while a spell is actively firing
  if (isCasting) return 'cast';
  if (isHovered) return 'wave';
  if (isSpeaking) {
    switch (emotion) {
      case 'excited':    return 'cheer';
      case 'angry':      return 'bristle';
      case 'happy':      return 'clap';
      case 'sad':        return 'sag';
      case 'embarrassed':return 'recoil';
      case 'curious':    return 'lean';
      case 'surprised':  return 'shrug';
      case 'proud':      return 'cheer';
      default:           return 'explain';
    }
  }
  // Listening to another spirit speaking — gentle nod
  if (isListening) return 'nod';
  // Idle
  switch (emotion) {
    case 'excited':    return 'cheer';
    case 'happy':      return 'thumbsUp';
    case 'sad':        return 'sag';
    case 'angry':      return 'bristle';
    case 'scared':     return 'recoil';
    case 'embarrassed':return 'recoil';
    case 'sleepy':     return 'sag';
    case 'confused':   return 'shrug';
    case 'proud':      return 'thumbsUp';
    case 'curious':    return 'lean';
    case 'mysterious': return 'cast';
    case 'playful':    return 'wave';
    default:           return 'rest';
  }
}

/** Per-element personality: how expressive/animated the gestures are.
 *  speed = animation duration divisor; amplitude = motion scale. */
const ELEM_PERSONALITY: Record<ElementType, { speed: number; amplitude: number; organic: boolean }> = {
  fire:      { speed: 1.5, amplitude: 1.35, organic: true  },
  water:     { speed: 0.7, amplitude: 0.80, organic: true  },
  ice:       { speed: 0.6, amplitude: 0.65, organic: false },
  wind:      { speed: 1.2, amplitude: 1.10, organic: true  },
  soil:      { speed: 0.5, amplitude: 0.55, organic: true  },
  trees:     { speed: 0.7, amplitude: 0.80, organic: true  },
  lightning: { speed: 2.2, amplitude: 1.50, organic: false },
  dark:      { speed: 0.6, amplitude: 0.70, organic: true  },
  light:     { speed: 1.0, amplitude: 1.00, organic: true  },
  healing:   { speed: 0.8, amplitude: 0.90, organic: true  },
  void:      { speed: 0.3, amplitude: 0.45, organic: true  },
  space:     { speed: 0.6, amplitude: 0.75, organic: true  },
  time:      { speed: 0.9, amplitude: 0.90, organic: true  },
  robot:     { speed: 1.1, amplitude: 0.70, organic: false },
};

// ─── Spirit Arms ───────────────────────────────────────────────────────────────

function SpiritArms({
  element, aL, aR, strokeColor, isHovered, emotion, isSpeaking, isListening, isCasting,
}: {
  element: ElementType;
  aL: ArmCfg; aR: ArmCfg;
  strokeColor: string;
  isHovered: boolean;
  emotion: EmotionType;
  isSpeaking: boolean;
  isListening: boolean;
  isCasting: boolean;
}) {
  const pers    = ELEM_PERSONALITY[element];
  const organic = pers.organic;
  const lineCap = organic ? 'round' : ('square' as const);
  const strokeW = organic ? 2.6 : 2.2;
  const gesture = pickGesture(emotion, isSpeaking, isHovered, isListening, isCasting);
  const amp     = pers.amplitude;
  const spd     = pers.speed;

  // Compute hand centre positions from shoulder roots
  const lhXBase = aL.x - 14;
  const lhYBase = aL.y + 13;
  const rhXBase = aR.x + 14;
  const rhYBase = aR.y + 13;

  // ── Gesture → per-arm animated targets ──────────────────────────────────────
  // (dx, dy) offset applied to the entire arm group via motion.g translate
  // armRot: rotation around shoulder root (deg)
  // fingerSplay: 0 = neutral fan, 1 = open spread, -1 = closed/point
  // fingerRot: base rotation of the finger cluster (deg)

  type ArmTarget = { dx: number; dy: number; rot: number; fingerSplay: number; fingerRot: number };

  const targets: Record<GestureId, { L: ArmTarget; R: ArmTarget }> = {
    rest:     { L:{ dx:0,           dy:0,           rot:0,   fingerSplay:0,    fingerRot:0   }, R:{ dx:0,           dy:0,           rot:0,   fingerSplay:0,    fingerRot:0   } },
    wave:     { L:{ dx:-4*amp,      dy:-10*amp,     rot:-25, fingerSplay:0.8,  fingerRot:30  }, R:{ dx:6*amp,       dy:-14*amp,     rot:28,  fingerSplay:0.9,  fingerRot:-25 } },
    cheer:    { L:{ dx:-8*amp,      dy:-16*amp,     rot:-40, fingerSplay:1.0,  fingerRot:45  }, R:{ dx:8*amp,       dy:-16*amp,     rot:40,  fingerSplay:1.0,  fingerRot:-45 } },
    explain:  { L:{ dx:-2*amp,      dy:-5*amp,      rot:-10, fingerSplay:0.4,  fingerRot:10  }, R:{ dx:10*amp,      dy:-8*amp,      rot:20,  fingerSplay:0.5,  fingerRot:-15 } },
    point:    { L:{ dx:0,           dy:0,           rot:0,   fingerSplay:-0.8, fingerRot:0   }, R:{ dx:14*amp,      dy:-6*amp,      rot:18,  fingerSplay:-1.0, fingerRot:-5  } },
    facepalm: { L:{ dx:8*amp,       dy:-18*amp,     rot:55,  fingerSplay:0.3,  fingerRot:-20 }, R:{ dx:0,           dy:4*amp,       rot:-5,  fingerSplay:0,    fingerRot:0   } },
    cross:    { L:{ dx:8*amp,       dy:-5*amp,      rot:30,  fingerSplay:0,    fingerRot:10  }, R:{ dx:-8*amp,      dy:-5*amp,      rot:-30, fingerSplay:0,    fingerRot:-10 } },
    cast:     { L:{ dx:-6*amp,      dy:-10*amp,     rot:-20, fingerSplay:0.7,  fingerRot:30  }, R:{ dx:4*amp,       dy:-18*amp,     rot:50,  fingerSplay:0.6,  fingerRot:-50 } },
    // Nod: arms loosely at sides, slight upward drift — listening attentiveness
    nod:      { L:{ dx:-2*amp,      dy:-4*amp,      rot:-8,  fingerSplay:0.1,  fingerRot:5   }, R:{ dx:2*amp,       dy:-4*amp,      rot:8,   fingerSplay:0.1,  fingerRot:-5  } },
    sag:      { L:{ dx:-4*amp,      dy:8*amp,       rot:15,  fingerSplay:-0.5, fingerRot:-15 }, R:{ dx:4*amp,       dy:8*amp,       rot:-15, fingerSplay:-0.5, fingerRot:15  } },
    shrug:    { L:{ dx:-6*amp,      dy:-8*amp,      rot:-30, fingerSplay:0.7,  fingerRot:25  }, R:{ dx:6*amp,       dy:-8*amp,      rot:30,  fingerSplay:0.7,  fingerRot:-25 } },
    recoil:   { L:{ dx:5*amp,       dy:-6*amp,      rot:35,  fingerSplay:-0.3, fingerRot:-10 }, R:{ dx:-5*amp,      dy:-6*amp,      rot:-35, fingerSplay:-0.3, fingerRot:10  } },
    clap:     { L:{ dx:8*amp,       dy:-10*amp,     rot:40,  fingerSplay:0.3,  fingerRot:20  }, R:{ dx:-8*amp,      dy:-10*amp,     rot:-40, fingerSplay:0.3,  fingerRot:-20 } },
    lean:     { L:{ dx:-2*amp,      dy:-4*amp,      rot:-8,  fingerSplay:0.2,  fingerRot:5   }, R:{ dx:12*amp,      dy:-12*amp,     rot:30,  fingerSplay:0.4,  fingerRot:-20 } },
    bristle:  { L:{ dx:-10*amp,     dy:-4*amp,      rot:-20, fingerSplay:0.9,  fingerRot:15  }, R:{ dx:10*amp,      dy:-4*amp,      rot:20,  fingerSplay:0.9,  fingerRot:-15 } },
    // ThumbsUp: right arm raised, middle finger (f1) up, outer fingers curled back
    thumbsUp: { L:{ dx:-2*amp,      dy:0,           rot:-5,  fingerSplay:-0.3, fingerRot:5   }, R:{ dx:6*amp,       dy:-12*amp,     rot:35,  fingerSplay:-0.6, fingerRot:-80 } },
  };

  const t     = targets[gesture];
  const dur   = (0.45 / spd);
  const ease  = organic ? 'easeInOut' : 'linear';

  // ── Wave is a looping oscillation, not a snap-to-target ────────────────────
  const isWave    = gesture === 'wave';
  const isCheer   = gesture === 'cheer';
  const isClap    = gesture === 'clap';
  const isCast    = gesture === 'cast';
  const isBristle = gesture === 'bristle';
  const isNod     = gesture === 'nod';

  function renderArm(
    side: 'L' | 'R',
    shoulderX: number, shoulderY: number,
    handXBase: number, handYBase: number,
    target: ArmTarget,
  ) {
    const hx = handXBase;
    const hy = handYBase;
    const isLeft = side === 'L';

    // Arm path (bezier for organic, angular for mechanical)
    const path = organic
      ? `M ${shoulderX},${shoulderY} C ${shoulderX + (isLeft ? -5 : 5)},${shoulderY + 3} ${shoulderX + (isLeft ? -9 : 9)},${shoulderY + 7} ${hx},${hy}`
      : `M ${shoulderX},${shoulderY} L ${shoulderX + (isLeft ? -6 : 6)},${shoulderY + 4} L ${hx},${hy}`;

    // Finger base directions spread by fingerSplay and rotated by fingerRot
    // splay=1 → fingers widely spread; splay=-1 → fingers closed/point forward
    const splay = target.fingerSplay;
    const fRot  = target.fingerRot;
    const dir   = isLeft ? -1 : 1;

    // Three finger endpoint offsets relative to hand centre
    // finger 0 (top), 1 (middle), 2 (bottom) in neutral fan
    const f0Spread = (1 + splay) * 0.5;   // 0..1 — top finger opens outward
    const f2Spread = (1 + splay) * 0.5;
    const baseLen  = 8.5;
    const f0x = hx + dir * (baseLen * Math.cos(((fRot - 35 * f0Spread) * Math.PI) / 180));
    const f0y = hy + baseLen * Math.sin(((fRot - 35 * f0Spread) * Math.PI) / 180) - 6;
    const f1x = hx + dir * (baseLen * Math.cos(((fRot) * Math.PI) / 180) + (splay < 0 ? 1 : 0));
    const f1y = hy + baseLen * Math.sin(((fRot) * Math.PI) / 180) - 2;
    const f2x = hx + dir * (baseLen * Math.cos(((fRot + 35 * f2Spread) * Math.PI) / 180));
    const f2y = hy + baseLen * Math.sin(((fRot + 35 * f2Spread) * Math.PI) / 180) + 9;

    // Animation targets
    const animateG: Record<string, number[] | number> = isWave && side === 'R'
      ? { x: [0, target.dx, 0, target.dx * 0.7, 0], y: [0, target.dy, 0, target.dy * 0.8, 0] }
      : isCheer
      ? { x: [target.dx * 0.7, target.dx, target.dx * 0.85, target.dx], y: [target.dy * 0.9, target.dy, target.dy * 0.95, target.dy] }
      : isClap
      ? { x: [0, target.dx, 0, target.dx, 0], y: [0, target.dy, 0, target.dy, 0] }
      : isCast && side === 'R'
      ? { x: [target.dx * 0.8, target.dx, target.dx * 0.9, target.dx], y: [target.dy, target.dy - 3 * amp, target.dy, target.dy - 2 * amp] }
      : isBristle
      ? { x: [target.dx * 0.9, target.dx, target.dx * 0.95, target.dx], y: [target.dy, target.dy + 2 * amp, target.dy, target.dy] }
      : isNod
      ? { x: target.dx, y: [target.dy, target.dy - 4 * amp, target.dy, target.dy - 3 * amp, target.dy] }
      : { x: target.dx, y: target.dy };

    const transDur = isWave || isClap ? (1.2 / spd) : isCheer ? (0.9 / spd) : isNod ? (1.6 / spd) : dur;
    const looping  = isWave || isCheer || isClap || isCast || isBristle || isNod;

    // Idle finger micro-animation: subtle slow drift even when not speaking
    // Scale is much smaller than speaking animation to stay subtle
    const idleFingerAmp = 0.6;
    const idleFingerDur = 3.2 / spd;

    return (
      <motion.g
        animate={animateG}
        transition={{
          duration: transDur,
          repeat: looping ? Infinity : 0,
          repeatType: 'mirror',
          ease,
        }}
      >
        {/* Arm */}
        <path d={path} stroke={strokeColor} strokeWidth={strokeW} fill="none" strokeLinecap={lineCap} />
        {/* Hand knuckle */}
        <circle cx={hx} cy={hy} r="3.2" fill={strokeColor} opacity="0.72" />
        {/* Finger 0 (top) — speaking: expressive; idle: subtle micro-drift */}
        <motion.line
          x1={hx} y1={hy} x2={f0x} y2={f0y}
          stroke={strokeColor} strokeWidth="1.9" strokeLinecap={lineCap}
          animate={isSpeaking
            ? { x2: [f0x, f0x + dir * 1.5, f0x], y2: [f0y, f0y - 1.5, f0y] }
            : { x2: [f0x, f0x + dir * idleFingerAmp, f0x], y2: [f0y, f0y - idleFingerAmp * 0.5, f0y] }
          }
          transition={{ duration: isSpeaking ? 0.7 / spd : idleFingerDur, repeat: Infinity, repeatType: 'mirror', ease, delay: 0 }}
        />
        {/* Finger 1 (middle) */}
        <motion.line
          x1={hx} y1={hy} x2={f1x} y2={f1y}
          stroke={strokeColor} strokeWidth="2.1" strokeLinecap={lineCap}
          animate={isSpeaking
            ? { x2: [f1x, f1x + dir * 2, f1x], y2: [f1y, f1y - 2, f1y] }
            : { x2: [f1x, f1x + dir * idleFingerAmp * 0.7, f1x], y2: [f1y, f1y - idleFingerAmp * 0.7, f1y] }
          }
          transition={{ duration: isSpeaking ? 0.7 / spd : idleFingerDur, repeat: Infinity, repeatType: 'mirror', ease, delay: isSpeaking ? 0.12 : 0.55 }}
        />
        {/* Finger 2 (bottom/thumb-equivalent) */}
        <motion.line
          x1={hx} y1={hy} x2={f2x} y2={f2y}
          stroke={strokeColor} strokeWidth="1.7" strokeLinecap={lineCap}
          animate={isSpeaking
            ? { x2: [f2x, f2x + dir * 1, f2x], y2: [f2y, f2y - 1, f2y] }
            : { x2: [f2x, f2x + dir * idleFingerAmp * 0.5, f2x], y2: [f2y, f2y - idleFingerAmp * 0.3, f2y] }
          }
          transition={{ duration: isSpeaking ? 0.7 / spd : idleFingerDur, repeat: Infinity, repeatType: 'mirror', ease, delay: isSpeaking ? 0.25 : 1.1 }}
        />
      </motion.g>
    );
  }

  return (
    <>
      {renderArm('L', aL.x, aL.y, lhXBase, lhYBase, t.L)}
      {renderArm('R', aR.x, aR.y, rhXBase, rhYBase, t.R)}
    </>
  );
}

// ─── Spirit Eyes ───────────────────────────────────────────────────────────────

interface EyesProps {
  eL: EyeCfg; eR: EyeCfg;
  emotion: EmotionType;
  blinking: boolean;
  pupilOffset: { x: number; y: number };
  isSpeaking: boolean;
  mCx: number; mCy: number;
  element: ElementType;
}

function SpiritEyes({ eL, eR, emotion, blinking, pupilOffset, isSpeaking, mCx, mCy, element }: EyesProps) {
  const ev        = EV[emotion];
  const eyeSY     = blinking ? 0.04 : ev.eyeScaleY;
  const eyeOffY   = ev.eyeOffsetY;
  const isRobot   = element === 'robot';
  // Smiling crescent eyes: happy / excited / playful render top-arc only
  const smilingEye = !blinking && (emotion === 'happy' || emotion === 'excited' || emotion === 'playful');
  // Sparkle: excited / playful / proud get radiant starburst lines around pupils
  const sparkleEye = !blinking && (emotion === 'excited' || emotion === 'playful' || emotion === 'surprised');

  function renderEye(e: EyeCfg, px: number) {
    const ey  = e.cy + eyeOffY;
    const pX  = e.cx + px;
    const pY  = ey   + pupilOffset.y;

    if (isRobot) {
      // Rectangular LED panel eye
      return (
        <g key={e.cx}>
          <rect
            x={e.cx - e.rx} y={ey - e.ry} width={e.rx * 2} height={e.ry * 2} rx="3"
            fill={e.eyeCol}
            style={{ transform: `scaleY(${eyeSY})`, transformOrigin: `${e.cx}px ${ey}px`, transition: 'transform 0.08s' }}
          />
          {/* Scan line */}
          <motion.rect
            x={e.cx - e.rx + 3} width={(e.rx - 3) * 2} height="3" rx="1" fill={e.pupilCol} opacity="0.95"
            animate={{ y: [ey - e.ry + 3, ey + e.ry - 6, ey - e.ry + 3] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
          />
          {/* Corner glint */}
          <rect x={e.cx - e.rx + 3} y={ey - e.ry + 3} width="4" height="2" rx="0.5" fill="rgba(255,255,255,0.45)" />
        </g>
      );
    }

    if (smilingEye) {
      // Crescent (top-arc only) — happy squinting eyes ˆ
      // Drawn as top half-ellipse arc: M left A rx ry ... right L left Z
      return (
        <g key={e.cx}>
          {/* Crescent arc (top dome of the ellipse) */}
          <path
            d={`M ${e.cx - e.rx},${ey} A ${e.rx},${e.ry * eyeSY} 0 0 1 ${e.cx + e.rx},${ey} Z`}
            fill={e.eyeCol}
            style={{ transformOrigin: `${e.cx}px ${ey}px`, transition: 'transform 0.12s' }}
          />
          {/* Small cheek highlight */}
          <ellipse cx={e.cx - e.rx * 0.25} cy={ey - e.ry * 0.25 * eyeSY} rx={e.pr * 0.5} ry={e.pr * 0.3}
            fill="rgba(255,255,255,0.65)" />
          {/* Sparkle burst for excited/playful */}
          {sparkleEye && (
            <>
              <motion.line x1={e.cx} y1={ey - e.ry - 3} x2={e.cx} y2={ey - e.ry - 7}
                stroke={e.eyeCol} strokeWidth="1.2" strokeLinecap="round"
                animate={{ opacity: [0.9, 0.3, 0.9] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut' }} />
              <motion.line x1={e.cx + e.rx + 2} y1={ey} x2={e.cx + e.rx + 6} y2={ey}
                stroke={e.eyeCol} strokeWidth="1.2" strokeLinecap="round"
                animate={{ opacity: [0.7, 0.2, 0.7] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.2 }} />
              <motion.line x1={e.cx + e.rx * 0.7} y1={ey - e.ry * 0.7} x2={e.cx + e.rx * 0.7 + 3} y2={ey - e.ry * 0.7 - 3}
                stroke={e.eyeCol} strokeWidth="1.1" strokeLinecap="round"
                animate={{ opacity: [0.8, 0.2, 0.8] }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'easeInOut', delay: 0.4 }} />
            </>
          )}
        </g>
      );
    }

    return (
      <g key={e.cx}>
        {/* Eye white */}
        <ellipse
          cx={e.cx} cy={ey} rx={e.rx} ry={e.ry}
          fill={e.eyeCol}
          style={{ transform: `scaleY(${eyeSY})`, transformOrigin: `${e.cx}px ${ey}px`, transition: 'transform 0.08s' }}
        />
        {/* Pupil */}
        <ellipse
          cx={pX} cy={pY} rx={e.pr} ry={e.pr * eyeSY}
          fill={e.pupilCol}
        />
        {/* Catchlight */}
        <ellipse
          cx={e.cx - e.rx * 0.32} cy={ey - e.ry * 0.35}
          rx={e.pr * 0.55} ry={e.pr * 0.40}
          fill="rgba(255,255,255,0.72)"
          style={{ transform: `scaleY(${eyeSY})`, transformOrigin: `${e.cx}px ${ey}px`, transition: 'transform 0.08s' }}
        />
        {/* Sparkle for surprised — 4-point starburst from pupil */}
        {sparkleEye && (
          <>
            <motion.circle cx={pX} cy={pY} r={e.pr * 1.6} fill="none"
              stroke={e.eyeCol} strokeWidth="0.8" strokeOpacity="0.55"
              animate={{ r: [e.pr * 1.4, e.pr * 2.2, e.pr * 1.4], opacity: [0.55, 0, 0.55] }}
              transition={{ duration: 0.9, repeat: Infinity, ease: 'easeOut' }} />
          </>
        )}
      </g>
    );
  }

  return (
    <g>
      {renderEye(eL, pupilOffset.x)}
      {renderEye(eR, pupilOffset.x)}

      {/* Mouth — shape varies by emotion */}
      {!isSpeaking ? (
        emotion === 'sad' ? (
          // Frown (curve down)
          <path d={`M ${mCx - 7},${mCy + 3} Q ${mCx},${mCy - 3} ${mCx + 7},${mCy + 3}`}
            stroke={eL.eyeCol} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.65" />
        ) : emotion === 'angry' ? (
          // Flat tight line
          <line x1={mCx - 7} y1={mCy} x2={mCx + 7} y2={mCy}
            stroke={eL.eyeCol} strokeWidth="1.6" strokeLinecap="round" opacity="0.55" />
        ) : emotion === 'surprised' ? (
          // Open O — small ellipse
          <ellipse cx={mCx} cy={mCy + 3} rx={4} ry={5.5} fill="none"
            stroke={eL.eyeCol} strokeWidth="1.3" opacity="0.65" />
        ) : emotion === 'scared' ? (
          // Wide open O — bigger than surprised, trembling
          <motion.ellipse cx={mCx} cy={mCy + 3} rx={5.5} ry={7} fill="none"
            stroke={eL.eyeCol} strokeWidth="1.4" opacity="0.80"
            animate={{ rx: [5.5, 6.2, 5.5], ry: [7, 7.8, 7] }}
            transition={{ duration: 0.25, repeat: Infinity, ease: 'easeInOut' }}
          />
        ) : emotion === 'happy' || emotion === 'excited' || emotion === 'proud' ? (
          // Wide open smile
          <path d={`M ${mCx - 9},${mCy - 1} Q ${mCx},${mCy + 9} ${mCx + 9},${mCy - 1}`}
            stroke={eL.eyeCol} strokeWidth="1.4" fill="none" strokeLinecap="round" opacity="0.70" />
        ) : emotion === 'sleepy' ? (
          // Tiny droopy half-smile
          <path d={`M ${mCx - 5},${mCy} Q ${mCx},${mCy + 3} ${mCx + 5},${mCy}`}
            stroke={eL.eyeCol} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.38" />
        ) : emotion === 'embarrassed' ? (
          // Wavy nervous line
          <path d={`M ${mCx - 6},${mCy} Q ${mCx - 2},${mCy + 3} ${mCx + 2},${mCy} Q ${mCx + 6},${mCy - 2} ${mCx + 6},${mCy}`}
            stroke={eL.eyeCol} strokeWidth="1.2" fill="none" strokeLinecap="round" opacity="0.60" />
        ) : (
          // Default gentle smile
          <path d={`M ${mCx - 7},${mCy} Q ${mCx},${mCy + 5} ${mCx + 7},${mCy}`}
            stroke={eL.eyeCol} strokeWidth="1.3" fill="none" strokeLinecap="round" opacity="0.65" />
        )
      ) : (
        /* Speaking: 3 bouncing dots */
        [0, 1, 2].map((i) => (
          <motion.circle
            key={i}
            cx={mCx - 5 + i * 5} cy={mCy + 2} r={1.6}
            fill={eL.eyeCol}
            animate={{ cy: [mCy + 2, mCy - 3, mCy + 2] }}
            transition={{ duration: 0.50, repeat: Infinity, delay: i * 0.17, ease: 'easeInOut' }}
          />
        ))
      )}
    </g>
  );
}

// ─── Emotion Facial Overlays ───────────────────────────────────────────────────
// Eyebrows, tears, blush, zzz, etc. rendered into the creature SVG.

function EmotionFace({ emotion, eL, eR }: { emotion: EmotionType; eL: EyeCfg; eR: EyeCfg }) {
  switch (emotion) {
    case 'sad':
      return (
        <>
          {/* Furrowed brows angled toward center — sad V shape */}
          <line x1={eL.cx - eL.rx * 0.8} y1={eL.cy - eL.ry - 4} x2={eL.cx + eL.rx * 0.7} y2={eL.cy - eL.ry - 1}
            stroke="rgba(200,220,255,0.50)" strokeWidth="1.6" strokeLinecap="round" />
          <line x1={eR.cx - eR.rx * 0.7} y1={eR.cy - eR.ry - 1} x2={eR.cx + eR.rx * 0.8} y2={eR.cy - eR.ry - 4}
            stroke="rgba(200,220,255,0.50)" strokeWidth="1.6" strokeLinecap="round" />
          {/* Falling teardrops */}
          <motion.ellipse cx={eL.cx - 1} cy={eL.cy + eL.ry + 5} rx={1.8} ry={3.2}
            fill="rgba(150,200,255,0.78)"
            animate={{ cy: [eL.cy + eL.ry + 5, eL.cy + eL.ry + 22], opacity: [0.78, 0] }}
            transition={{ duration: 2.0, repeat: Infinity, repeatDelay: 1.0 }}
          />
          <motion.ellipse cx={eR.cx + 1} cy={eR.cy + eR.ry + 5} rx={1.8} ry={3.2}
            fill="rgba(150,200,255,0.78)"
            animate={{ cy: [eR.cy + eR.ry + 5, eR.cy + eR.ry + 22], opacity: [0.78, 0] }}
            transition={{ duration: 2.0, repeat: Infinity, repeatDelay: 1.8, delay: 0.7 }}
          />
        </>
      );

    case 'angry':
      return (
        <>
          {/* Sharp angled V brows — inner corners raised aggressively */}
          <line x1={eL.cx - eL.rx} y1={eL.cy - eL.ry - 4} x2={eL.cx + eL.rx * 0.6} y2={eL.cy - eL.ry - 9}
            stroke="rgba(255,80,60,0.65)" strokeWidth="2.0" strokeLinecap="round" />
          <line x1={eR.cx - eR.rx * 0.6} y1={eR.cy - eR.ry - 9} x2={eR.cx + eR.rx} y2={eR.cy - eR.ry - 4}
            stroke="rgba(255,80,60,0.65)" strokeWidth="2.0" strokeLinecap="round" />
        </>
      );

    case 'embarrassed':
      return (
        <>
          {/* Rosy blush on cheeks */}
          <ellipse cx={eL.cx - 5} cy={eL.cy + eL.ry + 6} rx={9.5} ry={4.5} fill="rgba(255,100,130,0.22)" />
          <ellipse cx={eR.cx + 5} cy={eR.cy + eR.ry + 6} rx={9.5} ry={4.5} fill="rgba(255,100,130,0.22)" />
        </>
      );

    case 'surprised':
      return (
        <>
          {/* Highly raised arched brows */}
          <path d={`M ${eL.cx - eL.rx},${eL.cy - eL.ry - 5} Q ${eL.cx},${eL.cy - eL.ry - 13} ${eL.cx + eL.rx},${eL.cy - eL.ry - 5}`}
            stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M ${eR.cx - eR.rx},${eR.cy - eR.ry - 5} Q ${eR.cx},${eR.cy - eR.ry - 13} ${eR.cx + eR.rx},${eR.cy - eR.ry - 5}`}
            stroke="rgba(255,255,255,0.45)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        </>
      );

    case 'curious':
      return (
        <>
          {/* One raised brow (left higher than right) */}
          <path d={`M ${eL.cx - eL.rx},${eL.cy - eL.ry - 3} Q ${eL.cx},${eL.cy - eL.ry - 10} ${eL.cx + eL.rx},${eL.cy - eL.ry - 4}`}
            stroke="rgba(255,255,255,0.38)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d={`M ${eR.cx - eR.rx},${eR.cy - eR.ry - 3} Q ${eR.cx},${eR.cy - eR.ry - 6} ${eR.cx + eR.rx},${eR.cy - eR.ry - 3}`}
            stroke="rgba(255,255,255,0.28)" strokeWidth="1.2" fill="none" strokeLinecap="round" />
        </>
      );

    case 'confused':
      return (
        <>
          {/* One brow raised (left), one furrowed (right) — classic confusion asymmetry */}
          <path d={`M ${eL.cx - eL.rx},${eL.cy - eL.ry - 3} Q ${eL.cx},${eL.cy - eL.ry - 11} ${eL.cx + eL.rx},${eL.cy - eL.ry - 5}`}
            stroke="rgba(255,255,255,0.42)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          <path d={`M ${eR.cx - eR.rx * 0.7},${eR.cy - eR.ry - 5} Q ${eR.cx},${eR.cy - eR.ry - 2} ${eR.cx + eR.rx},${eR.cy - eR.ry - 4}`}
            stroke="rgba(255,255,255,0.38)" strokeWidth="1.6" fill="none" strokeLinecap="round" />
          {/* Tiny question-mark squiggle above head */}
          <motion.text x="62" y="4" textAnchor="middle" fontSize="6" fill="rgba(255,255,255,0.55)"
            animate={{ opacity: [0.55, 0.85, 0.55], y: [4, 2, 4] }}
            transition={{ duration: 2.2, repeat: Infinity, ease: 'easeInOut' }}
          >?</motion.text>
        </>
      );

    case 'proud':
      return (
        <>
          {/* Both brows slightly raised and even — confident look */}
          <path d={`M ${eL.cx - eL.rx},${eL.cy - eL.ry - 5} Q ${eL.cx},${eL.cy - eL.ry - 9} ${eL.cx + eL.rx},${eL.cy - eL.ry - 6}`}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          <path d={`M ${eR.cx - eR.rx},${eR.cy - eR.ry - 6} Q ${eR.cx},${eR.cy - eR.ry - 9} ${eR.cx + eR.rx},${eR.cy - eR.ry - 5}`}
            stroke="rgba(255,255,255,0.35)" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Tiny star sparkle above head */}
          <motion.text x="50" y="5" textAnchor="middle" fontSize="7" fill="rgba(255,255,220,0.75)"
            animate={{ opacity: [0.75, 1, 0.75], scale: [1, 1.15, 1] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: 'easeInOut' }}
          >✦</motion.text>
        </>
      );

    case 'sleepy':
      return (
        <>
          {/* Floating Z's drifting upward */}
          <motion.text x={eR.cx + 11} y={eR.cy - 8} textAnchor="middle" fontSize="7"
            fill="rgba(180,180,255,0.55)"
            animate={{ y: [eR.cy - 8, eR.cy - 24], opacity: [0.55, 0], x: [eR.cx + 11, eR.cx + 20] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.4 }}
          >z</motion.text>
          <motion.text x={eR.cx + 18} y={eR.cy - 18} textAnchor="middle" fontSize="10"
            fill="rgba(180,180,255,0.38)"
            animate={{ y: [eR.cy - 18, eR.cy - 36], opacity: [0.38, 0], x: [eR.cx + 18, eR.cx + 28] }}
            transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.4, delay: 1.0 }}
          >z</motion.text>
        </>
      );

    case 'scared':
      return (
        <>
          {/* Wide arched brows pulled high and inward — fear V-shape */}
          <motion.line
            x1={eL.cx - eL.rx * 0.7} y1={eL.cy - eL.ry - 3}
            x2={eL.cx + eL.rx * 0.9} y2={eL.cy - eL.ry - 10}
            stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"
            animate={{ y1: [eL.cy - eL.ry - 3, eL.cy - eL.ry - 5, eL.cy - eL.ry - 3] }}
            transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut' }}
          />
          <motion.line
            x1={eR.cx - eR.rx * 0.9} y1={eR.cy - eR.ry - 10}
            x2={eR.cx + eR.rx * 0.7} y2={eR.cy - eR.ry - 3}
            stroke="rgba(255,255,255,0.55)" strokeWidth="1.8" strokeLinecap="round"
            animate={{ y2: [eR.cy - eR.ry - 3, eR.cy - eR.ry - 5, eR.cy - eR.ry - 3] }}
            transition={{ duration: 0.22, repeat: Infinity, ease: 'easeInOut', delay: 0.05 }}
          />
          {/* Trembling sweat drop */}
          <motion.ellipse cx={eL.cx - 2} cy={eL.cy - eL.ry - 18} rx={2} ry={3.5}
            fill="rgba(150,200,255,0.72)"
            animate={{ cy: [eL.cy - eL.ry - 18, eL.cy - eL.ry - 10], opacity: [0.72, 0] }}
            transition={{ duration: 1.2, repeat: Infinity, repeatDelay: 0.6 }}
          />
        </>
      );

    default:
      return null;
  }
}

// ─── Main Component ────────────────────────────────────────────────────────────

export interface SpiritCreatureProps {
  element: ElementType;
  emotion: EmotionType;
  isSpeaking: boolean;
  isHovered: boolean;
  /** True while a magic spell is actively being cast — adds SVG energy glows */
  isCasting?: boolean;
  size?: number;
  /** Unique per-instance ID — prevents SVG gradient ID collisions across multi-instance elements. */
  instanceId?: string;
  /** Mirror the body SVG horizontally when the spirit is moving leftward. */
  facingLeft?: boolean;
}

export function SpiritCreature({
  element, emotion, isSpeaking, isHovered, isCasting = false, size = 1,
  instanceId = '0', facingLeft = false,
}: SpiritCreatureProps) {
  // Unique gradient ID per instance — fixes cross-instance gradient bleeding
  const gId = `sbg-${element}-${instanceId}`;
  const def          = SPIRIT_DEFINITIONS[element];
  const cfg          = SC[element];
  const ev           = EV[emotion];
  const containerRef = useRef<HTMLDivElement>(null);
  const blinkTimer   = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [blinking,      setBlinking]      = useState(false);
  const [pupilOffset,   setPupilOffset]   = useState({ x: 0, y: 0 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [tapFlash,      setTapFlash]      = useState(false);

  // allSpirits for social tracking only — cursor tracking uses CURSOR ref directly (no re-renders)
  const allSpirits = useWorldStore((s) => s.spirits);
  const allSpiritsRef = useRef(allSpirits);
  useEffect(() => { allSpiritsRef.current = allSpirits; }, [allSpirits]);

  // This spirit is "listening" when any OTHER element type is speaking
  const isListening = !isSpeaking && Array.from(allSpirits.values()).some(
    (inst) => inst.element !== element && inst.isSpeaking,
  );

  // Reduced-motion detection
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(mq.matches);
  }, []);

  // ── Pupil tracking via rAF — reads from CURSOR ref, not Zustand state ──────
  // This avoids 60+ re-renders/sec (one per mousemove × 35+ spirits = catastrophic).
  // Pupils update at ~15 fps (every 4 rAF frames) — perceptually smooth, performant.
  useEffect(() => {
    if (typeof window === 'undefined') return;

    let frameCount = 0;
    let rafId = 0;
    let lastPx = 0;
    let lastPy = 0;

    function tick() {
      rafId = requestAnimationFrame(tick);
      frameCount++;
      if (frameCount % 4 !== 0) return; // ~15 fps cap

      if (!containerRef.current) return;
      const rect = containerRef.current.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const cx2  = CURSOR.x;
      const cy2  = CURSOR.y;

      // Cursor hasn't moved — try social tracking instead
      if (cx2 < -8000) {
        // No cursor data yet — check for a speaking spirit to look at
        const speaker = Array.from(allSpiritsRef.current.values()).find(
          (inst) => inst.element !== element && inst.isSpeaking,
        );
        const nx = speaker ? (speaker.element < element ? -2.6 : 2.6) : 0;
        const ny = speaker ? 0.8 : 0;
        if (Math.abs(nx - lastPx) > 0.1 || Math.abs(ny - lastPy) > 0.1) {
          setPupilOffset({ x: nx, y: ny });
          lastPx = nx; lastPy = ny;
        }
        return;
      }

      const dx   = cx2 - cx;
      const dy   = cy2 - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);
      const proximity = Math.min(1, dist / 320);
      const maxOff = 3.5;

      let nx: number, ny: number;

      if (proximity < 0.25) {
        // Cursor very close — social look toward a speaking spirit
        const speaker = Array.from(allSpiritsRef.current.values()).find(
          (inst) => inst.element !== element && inst.isSpeaking,
        );
        if (speaker) {
          nx = speaker.element < element ? -2.6 : 2.6;
          ny = 0.8;
        } else {
          nx = 0; ny = 0;
        }
      } else {
        const angle = Math.atan2(dy, dx);
        nx = Math.cos(angle) * maxOff * proximity;
        ny = Math.sin(angle) * maxOff * proximity;
      }

      // Only fire setPupilOffset when the value has actually changed meaningfully
      if (Math.abs(nx - lastPx) > 0.15 || Math.abs(ny - lastPy) > 0.15) {
        setPupilOffset({ x: nx, y: ny });
        lastPx = nx; lastPy = ny;
      }
    }

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  // element is needed for social heuristic; no cursor deps — read from CURSOR ref
  }, [element]);

  // Tap/hover-enter: brief surprised-eye flash
  useEffect(() => {
    if (isHovered) {
      setTapFlash(true);
      const t = setTimeout(() => setTapFlash(false), 320);
      return () => clearTimeout(t);
    }
  }, [isHovered]);

  // Blinking
  // Emotion ref lets scheduleBlink read current emotion without restarting the timer chain
  const emotionRef = useRef(emotion);
  useEffect(() => { emotionRef.current = emotion; }, [emotion]);

  const scheduleBlink = useCallback(() => {
    const em = emotionRef.current;
    // Emotion-based blink timing: excited/surprised blink fast, sleepy/angry blink slow
    const delay =
      em === 'surprised'                          ? 800  + Math.random() * 1400 :
      em === 'excited'  || em === 'playful'       ? 1400 + Math.random() * 1800 :
      em === 'happy'    || em === 'curious'       ? 1800 + Math.random() * 2200 :
      em === 'angry'                              ? 5000 + Math.random() * 5000 :
      em === 'sleepy'                             ? 6000 + Math.random() * 7000 :
      em === 'calm'     || em === 'mysterious'   ? 4000 + Math.random() * 4000 :
                                                   2800 + Math.random() * 3500;
    blinkTimer.current = setTimeout(() => {
      setBlinking(true);
      // Close duration also varies: excited = snappy, sleepy = droopy
      const closeDur = em === 'sleepy' ? 280 : em === 'excited' ? 80 : 130;
      setTimeout(() => { setBlinking(false); scheduleBlink(); }, closeDur);
    }, delay);
  }, []); // intentionally no deps — reads emotion via ref to avoid restarting chain

  useEffect(() => {
    scheduleBlink();
    return () => { if (blinkTimer.current) clearTimeout(blinkTimer.current); };
  }, [scheduleBlink]);

  const w   = 32 * size;  // spirits are tiny companions (≈1/3 of original size)
  const h   = w * 1.25;
  // Glow reacts to emotion (excited/angry = intense, sleepy/sad = dim)
  const emotionGlowMult = emotion === 'excited' || emotion === 'angry' || emotion === 'proud'
    ? 1.45
    : emotion === 'sad' || emotion === 'sleepy' || emotion === 'embarrassed'
    ? 0.50
    : 1.0;
  const glow = 28 * ev.glow * emotionGlowMult * (isSpeaking ? 1.6 : isCasting ? 1.45 : isHovered ? 1.25 : 1);

  // Idle breathing: gentle scale oscillation
  const breathDur = emotion === 'sleepy' ? 4.5 : emotion === 'excited' || emotion === 'angry' ? 0.9 : 2.8;

  return (
    <div
      ref={containerRef}
      className="relative select-none pointer-events-none"
      style={{
        width: w, height: h,
        filter: `drop-shadow(0 ${Math.round(h * 0.06)}px ${Math.round(h * 0.14)}px ${def.glowColor}55) drop-shadow(0 4px 9px rgba(0,0,0,0.30))`,
      }}
    >
      {/* Ambient glow bloom */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background: `radial-gradient(circle, ${def.glowColor} 0%, transparent 72%)`,
          filter: `blur(${glow * 0.8}px)`,
          transform: 'scale(1.35)',
          opacity: ev.glow,
        }}
      />

      {/* Creature SVG — with idle breathing micro-animation */}
      <motion.svg
        viewBox="0 0 100 120"
        width="100%" height="100%"
        overflow="visible"
        style={{ position: 'relative', zIndex: 2, scaleX: facingLeft ? -1 : 1 }}
        animate={{
          rotate: ev.tilt,
          y: ev.bounce ? [0, -5, 0, -4, 0] : 0,
          scale: isSpeaking ? [1, 1.02, 1] : [1, 1 + 0.018, 1],  // breathing
        }}
        transition={
          ev.bounce
            ? { duration: 1.3, repeat: Infinity, ease: 'easeInOut' }
            : {
                rotate: { duration: 0.55, ease: 'easeOut' },
                scale:  { duration: breathDur, repeat: Infinity, ease: 'easeInOut' },
              }
        }
      >
        {/* Body shape */}
        <SpiritBody
          element={element}
          primary={def.primaryColor}
          secondary={def.secondaryColor}
          glow={def.glowColor}
          gId={gId}
        />

        {/* ── 3D Volume Lighting ────────────────────────────────────────────── */}
        {/* Shared gradient defs — IDs are instance-unique to avoid collisions   */}
        <defs>
          {/* Key light: directional highlight from upper-left simulates depth  */}
          <radialGradient id={`${gId}-kl`} cx="34%" cy="26%" r="64%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.42)" />
            <stop offset="55%"  stopColor="rgba(255,255,255,0.10)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>
          {/* Rim light: element secondary color from lower-right fill light     */}
          <radialGradient id={`${gId}-rl`} cx="72%" cy="74%" r="52%">
            <stop offset="0%"   stopColor={def.secondaryColor} stopOpacity="0.26" />
            <stop offset="100%" stopColor={def.secondaryColor} stopOpacity="0" />
          </radialGradient>
        </defs>
        {/* Rim light ellipse — subtle element-color bounce light from below     */}
        <ellipse cx="63" cy="78" rx="34" ry="28" fill={`url(#${gId}-rl)`} style={{ pointerEvents: 'none' }} />
        {/* Key light ellipse — white top-left highlight for volume and form     */}
        <ellipse cx="38" cy="36" rx="30" ry="22" fill={`url(#${gId}-kl)`} style={{ pointerEvents: 'none' }} />

        {/* Arms + 3 fingers each with gesture system */}
        <SpiritArms
          element={element}
          aL={cfg.aL} aR={cfg.aR}
          strokeColor={def.primaryColor}
          isHovered={isHovered}
          emotion={emotion}
          isSpeaking={isSpeaking}
          isListening={isListening}
          isCasting={isCasting}
        />

        {/* Eyes + mouth + emotion facial overlays */}
        <SpiritEyes
          eL={cfg.eL} eR={cfg.eR}
          emotion={tapFlash ? 'surprised' : emotion}
          blinking={blinking}
          pupilOffset={pupilOffset}
          isSpeaking={isSpeaking}
          mCx={cfg.mCx} mCy={cfg.mCy}
          element={element}
        />

        {/* Emotion face overlays — tears, blush, brows, zzz */}
        <EmotionFace emotion={emotion} eL={cfg.eL} eR={cfg.eR} />

        {/* ── Casting energy overlays ── */}
        {isCasting && (
          <>
            {/* Expanding energy ring radiating from body core */}
            <motion.circle
              cx="50" cy="65" r="30"
              fill="none"
              stroke={def.glowColor}
              strokeWidth="1.6"
              animate={{ r: [26, 48, 26], opacity: [0.55, 0, 0.55], strokeWidth: [1.6, 0.2, 1.6] }}
              transition={{ duration: 0.78, repeat: Infinity, ease: 'easeOut' }}
            />
            {/* Left hand magic charge */}
            <motion.circle
              cx={cfg.aL.x - 14} cy={cfg.aL.y + 13} r="4"
              fill={def.glowColor}
              animate={{ r: [3, 6.5, 3], opacity: [0.88, 0.30, 0.88] }}
              transition={{ duration: 0.48, repeat: Infinity, ease: 'easeInOut' }}
            />
            {/* Right hand magic charge */}
            <motion.circle
              cx={cfg.aR.x + 14} cy={cfg.aR.y + 13} r="4"
              fill={def.glowColor}
              animate={{ r: [3, 6.5, 3], opacity: [0.88, 0.30, 0.88] }}
              transition={{ duration: 0.48, repeat: Infinity, ease: 'easeInOut', delay: 0.24 }}
            />
          </>
        )}

        {/* Eye glow bloom — intensity driven by emotion */}
        {(emotion === 'excited' || emotion === 'angry' || emotion === 'surprised' || isSpeaking) && (
          <motion.ellipse
            cx="50" cy={cfg.eL.cy}
            rx={cfg.eL.rx * 2.8}
            ry={cfg.eL.ry * 1.8}
            fill={def.glowColor}
            animate={{ opacity: [0.18, 0.36, 0.18] }}
            transition={{ duration: emotion === 'angry' ? 0.4 : 1.2, repeat: Infinity, ease: 'easeInOut' }}
          />
        )}
      </motion.svg>

      {/* Speaking pulse ring */}
      {isSpeaking && (
        <motion.div
          className="absolute inset-0 pointer-events-none"
          style={{ borderRadius: '50%', border: `2px solid ${def.primaryColor}` }}
          animate={{ scale: [1, 1.18, 1], opacity: [0.45, 0.08, 0.45] }}
          transition={{ duration: 0.85, repeat: Infinity }}
        />
      )}

      {/* Ground shadow — soft ellipse anchors the spirit in 3D space */}
      <div
        className="absolute pointer-events-none"
        style={{
          bottom: -5,
          left: '50%',
          transform: 'translateX(-50%)',
          width: w * 0.68,
          height: 6,
          background: `radial-gradient(ellipse, rgba(0,0,0,0.28) 0%, transparent 70%)`,
          borderRadius: '50%',
          opacity: emotion === 'excited' || emotion === 'proud' ? 0.6 : 0.85,
        }}
      />
    </div>
  );
}
