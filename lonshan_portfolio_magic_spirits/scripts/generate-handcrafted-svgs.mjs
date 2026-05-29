import { promises as fs } from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const SPIRIT_DIR = path.join(ROOT, 'public', 'design', 'spirits');
const SEAL_DIR = path.join(ROOT, 'public', 'design', 'seals');

const ELEMENTS = [
  'fire', 'water', 'ice', 'wind',
  'soil', 'trees', 'lightning', 'light',
  'void', 'dark', 'healing', 'space',
  'time', 'robot',
];

const PALETTE = {
  fire: ['#ff6a00', '#ffbb58', '#fff0b8'],
  water: ['#04b8ff', '#75e5ff', '#e8fbff'],
  ice: ['#5dc8ff', '#d7f4ff', '#f0fdff'],
  wind: ['#68d7ff', '#baf4ff', '#e8feff'],
  soil: ['#8e5a34', '#d6a06d', '#ffe1b8'],
  trees: ['#3ec85f', '#9af171', '#dcffd2'],
  lightning: ['#ffe100', '#fff593', '#fffcd4'],
  light: ['#ffd96f', '#fff3cb', '#fffdf0'],
  void: ['#7a31ff', '#bf7bff', '#e8d3ff'],
  dark: ['#8d37ff', '#cf89ff', '#f1dcff'],
  healing: ['#4ce97f', '#b9ffd5', '#effff2'],
  space: ['#2cb8ff', '#7a62ff', '#d7e9ff'],
  time: ['#d7a24a', '#f1d58f', '#fff2cc'],
  robot: ['#7a98ad', '#c4d7e5', '#ebf5ff'],
};

function radial(id, c0, c1, c2) {
  return `<radialGradient id="${id}" cx="40%" cy="30%" r="76%">
  <stop offset="0%" stop-color="${c1}"/>
  <stop offset="58%" stop-color="${c0}"/>
  <stop offset="100%" stop-color="${c2}" stop-opacity="0.16"/>
</radialGradient>`;
}

function glowFilter(id = 'g', blur = 2.6) {
  return `<filter id="${id}" x="-50%" y="-50%" width="200%" height="200%">
  <feGaussianBlur in="SourceGraphic" stdDeviation="${blur}" result="b"/>
  <feMerge>
    <feMergeNode in="b"/>
    <feMergeNode in="SourceGraphic"/>
  </feMerge>
</filter>`;
}

function wrapSvg(content, defs) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <defs>
    ${defs}
  </defs>
  <rect width="128" height="128" fill="transparent"/>
  ${content}
</svg>
`;
}

function faceCute({ leftX, rightX, y = 62, eye = '#fff7ea', pupil = '#2e2238', smileY = 80, blush = false }) {
  return `
  <ellipse cx="${leftX}" cy="${y}" rx="8" ry="8.8" fill="${eye}"/>
  <ellipse cx="${rightX}" cy="${y}" rx="8" ry="8.8" fill="${eye}"/>
  <circle cx="${leftX}" cy="${y + 1}" r="3.2" fill="${pupil}"/>
  <circle cx="${rightX}" cy="${y + 1}" r="3.2" fill="${pupil}"/>
  <circle cx="${leftX - 1.3}" cy="${y - 0.6}" r="1.1" fill="#fff"/>
  <circle cx="${rightX - 1.3}" cy="${y - 0.6}" r="1.1" fill="#fff"/>
  ${blush ? `<ellipse cx="${leftX - 6}" cy="${smileY - 2}" rx="5" ry="2.6" fill="#ffb8c6" opacity="0.45"/><ellipse cx="${rightX + 6}" cy="${smileY - 2}" rx="5" ry="2.6" fill="#ffb8c6" opacity="0.45"/>` : ''}
  <path d="M52 ${smileY} Q64 ${smileY + 8} 76 ${smileY}" stroke="#fff8ec" stroke-width="2.3" fill="none" stroke-linecap="round"/>
  `;
}

function spiritArtwork(element) {
  const [c0, c1, c2] = PALETTE[element];
  const defs = `${radial('body', c0, c1, c2)}\n${glowFilter('glow', 2.7)}`;

  const spirits = {
    fire: `
      <g filter="url(#glow)">
        <path d="M64 116 C34 109 18 84 23 59 C28 41 41 29 51 13 C55 7 73 7 77 13 C87 29 100 41 105 59 C110 84 94 109 64 116 Z" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <path d="M64 102 C48 95 41 79 45 64 C48 52 56 42 60 31 C61 28 67 28 68 31 C72 42 80 52 83 64 C87 79 80 95 64 102 Z" fill="#fff2ae" fill-opacity="0.26"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#fff2d9', pupil: '#351808', smileY: 79 })}
      </g>
    `,

    water: `
      <g filter="url(#glow)">
        <path d="M64 116 C32 116 15 95 15 72 C15 47 31 30 46 17 C54 10 60 7 64 6 C68 7 74 10 82 17 C97 30 113 47 113 72 C113 95 96 116 64 116 Z" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <path d="M24 100 Q40 90 55 100 Q64 106 73 100 Q88 90 104 100" fill="none" stroke="${c1}" stroke-width="4" stroke-linecap="round" opacity="0.74"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 63, eye: '#eaf9ff', pupil: '#07315f', smileY: 80 })}
      </g>
    `,

    ice: `
      <g filter="url(#glow)">
        <polygon points="64,8 86,22 104,50 101,82 84,109 64,121 44,109 27,82 24,50 42,22" fill="url(#body)" stroke="${c1}" stroke-width="2"/>
        <line x1="64" y1="9" x2="64" y2="120" stroke="${c1}" opacity="0.45"/>
        <line x1="25" y1="50" x2="103" y2="50" stroke="${c1}" opacity="0.32"/>
        <line x1="39" y1="21" x2="89" y2="109" stroke="${c1}" opacity="0.25"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#effbff', pupil: '#11446d', smileY: 80 })}
      </g>
    `,

    wind: `
      <g filter="url(#glow)">
        <path d="M64 14 C39 14 17 33 17 62 C17 93 39 115 64 115 C89 115 111 93 111 62 C111 33 89 14 64 14 Z" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <path d="M20 64 C8 62 7 49 17 45 C26 41 34 48 31 57 Z" fill="${c1}" opacity="0.6"/>
        <path d="M108 64 C120 62 121 49 111 45 C102 41 94 48 97 57 Z" fill="${c1}" opacity="0.6"/>
        <path d="M37 46 Q64 35 91 46" stroke="${c1}" stroke-width="3" fill="none" stroke-linecap="round" opacity="0.8"/>
        <path d="M34 63 Q64 53 94 63" stroke="${c1}" stroke-width="2.3" fill="none" stroke-linecap="round" opacity="0.66"/>
        <path d="M40 80 Q64 72 88 80" stroke="${c1}" stroke-width="1.7" fill="none" stroke-linecap="round" opacity="0.52"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#f0fdff', pupil: '#154060', smileY: 78 })}
      </g>
    `,

    soil: `
      <g filter="url(#glow)">
        <path d="M64 116 C28 116 12 96 12 76 C12 52 24 37 38 29 C46 24 55 22 64 22 C73 22 82 24 90 29 C104 37 116 52 116 76 C116 96 100 116 64 116 Z" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <circle cx="28" cy="42" r="5.3" fill="#4ea2ff"/><circle cx="100" cy="43" r="5.1" fill="#7dff97"/>
        <circle cx="20" cy="60" r="4.3" fill="#ff625c"/><circle cx="108" cy="60" r="4.3" fill="#63d8ff"/>
        <circle cx="37" cy="97" r="4.8" fill="#d66bff"/><circle cx="95" cy="96" r="5.0" fill="#ffd86e"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 66, eye: '#fff1de', pupil: '#3a2514', smileY: 83 })}
      </g>
    `,

    trees: `
      <g filter="url(#glow)">
        <path d="M64 115 C34 115 18 94 18 68 C18 42 36 24 64 24 C92 24 110 42 110 68 C110 94 94 115 64 115 Z" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <path d="M45 30 C34 18 31 8 40 5 C49 2 55 16 51 26 Z" fill="${c0}"/>
        <path d="M83 30 C94 18 97 8 88 5 C79 2 73 16 77 26 Z" fill="${c0}"/>
        <path d="M64 113 L64 94" stroke="#724515" stroke-width="5" stroke-linecap="round" opacity="0.82"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 63, eye: '#ecffea', pupil: '#194218', smileY: 80 })}
      </g>
    `,

    lightning: `
      <g filter="url(#glow)">
        <polygon points="64,10 72,34 96,27 83,49 108,59 83,69 92,94 64,82 36,94 45,69 20,59 45,49 32,27 56,34" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <path d="M58 41 L70 41 L63 58 L73 58 L56 82 L61 65 L51 65 Z" fill="#fffad0"/>
        <path d="M46 77 Q55 71 62 74" stroke="#2a2530" stroke-width="2.8" fill="none" stroke-linecap="round"/>
        <path d="M66 74 Q73 71 82 77" stroke="#2a2530" stroke-width="2.8" fill="none" stroke-linecap="round"/>
      </g>
    `,

    light: `
      <g filter="url(#glow)">
        <polygon points="64,10 74,35 102,36 80,53 88,84 64,66 40,84 48,53 26,36 54,35" fill="url(#body)" stroke="${c1}" stroke-width="2"/>
        <circle cx="20" cy="63" r="5.8" fill="#ffe9b8"/><circle cx="108" cy="63" r="5.8" fill="#ffe9b8"/>
        <circle cx="20" cy="63" r="2.1" fill="#fff"/><circle cx="108" cy="63" r="2.1" fill="#fff"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#fffbea', pupil: '#473b20', smileY: 79 })}
      </g>
    `,

    void: `
      <g filter="url(#glow)">
        <circle cx="64" cy="64" r="48" fill="url(#body)"/>
        <circle cx="64" cy="64" r="18" fill="#12082a" stroke="${c1}" stroke-width="1.6" opacity="0.8"/>
        <circle cx="50" cy="61" r="6" fill="${c1}" opacity="0.82"/>
        <circle cx="57" cy="59" r="4" fill="${c1}" opacity="0.92"/>
        <circle cx="78" cy="68" r="5" fill="${c1}" opacity="0.86"/>
      </g>
    `,

    dark: `
      <g filter="url(#glow)">
        <path d="M64 14 C40 12 20 27 18 49 C16 65 22 80 16 95 C11 108 24 120 43 118 C50 121 78 121 85 118 C104 120 117 108 112 95 C106 80 112 65 110 49 C108 27 88 12 64 14 Z" fill="url(#body)"/>
        <ellipse cx="64" cy="63" rx="17" ry="12" fill="#efe2ff"/>
        <circle cx="64" cy="63" r="5.7" fill="#311f4f"/>
        <circle cx="61" cy="60" r="1.6" fill="#fff"/>
      </g>
    `,

    healing: `
      <g filter="url(#glow)">
        <circle cx="15" cy="73" r="11" fill="${c0}" opacity="0.56"/>
        <circle cx="113" cy="73" r="11" fill="${c0}" opacity="0.56"/>
        <circle cx="64" cy="70" r="42" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <path d="M64 82 L56 74 Q53 68 59 66 Q63 65 64 70 Q65 65 69 66 Q75 68 72 74 Z" fill="#ffd8ea" opacity="0.64"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#ecfff0', pupil: '#1a4223', smileY: 83, blush: true })}
      </g>
    `,

    space: `
      <g filter="url(#glow)">
        <circle cx="64" cy="64" r="44" fill="url(#body)"/>
        <ellipse cx="64" cy="64" rx="46" ry="12" fill="none" stroke="${c1}" stroke-width="2.2" transform="rotate(-22,64,64)"/>
        <path d="M47 100 C40 111 42 116 53 116 C62 116 65 109 62 104" fill="#7f5eff" opacity="0.45"/>
        <circle cx="43" cy="43" r="1.2" fill="#fff"/><circle cx="84" cy="37" r="1.1" fill="#fff"/><circle cx="90" cy="76" r="1.1" fill="#fff"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#eff3ff', pupil: '#32254f', smileY: 82 })}
      </g>
    `,

    time: `
      <g filter="url(#glow)">
        <path d="M30 14 L98 14 C106 14 108 25 101 35 L74 64 L101 93 C108 103 106 114 98 114 L30 114 C22 114 20 103 27 93 L54 64 L27 35 C20 25 22 14 30 14 Z" fill="url(#body)" stroke="${c0}" stroke-width="2"/>
        <line x1="30" y1="14" x2="98" y2="14" stroke="${c1}" stroke-width="2.4"/>
        <line x1="30" y1="114" x2="98" y2="114" stroke="${c1}" stroke-width="2.4"/>
        <ellipse cx="64" cy="64" rx="6" ry="3" fill="${c1}" opacity="0.72"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 49, eye: '#fff2d5', pupil: '#44311a', smileY: 65 })}
      </g>
    `,

    robot: `
      <g filter="url(#glow)">
        <path d="M30 18 L98 18 C108 18 116 26 116 36 L116 95 C116 107 107 116 95 116 L33 116 C21 116 12 107 12 95 L12 36 C12 26 20 18 30 18 Z" fill="url(#body)" stroke="${c1}" stroke-width="2"/>
        <circle cx="20" cy="66" r="7" fill="none" stroke="${c1}" stroke-width="2" opacity="0.82"/>
        <circle cx="108" cy="66" r="7" fill="none" stroke="${c1}" stroke-width="2" opacity="0.82"/>
        <rect x="47" y="84" width="34" height="14" rx="2" fill="#3f6b87" opacity="0.5" stroke="${c1}"/>
        <rect x="54" y="88" width="20" height="7" rx="1" fill="#7be6ff" opacity="0.62"/>
        <line x1="48" y1="18" x2="43" y2="7" stroke="${c1}" stroke-width="2" stroke-linecap="round"/>
        <line x1="80" y1="18" x2="85" y2="7" stroke="${c1}" stroke-width="2" stroke-linecap="round"/>
        <circle cx="43" cy="6" r="3" fill="#7be6ff"/><circle cx="85" cy="6" r="3" fill="#7be6ff"/>
        ${faceCute({ leftX: 50, rightX: 78, y: 62, eye: '#eaf4ff', pupil: '#17314c', smileY: 80 })}
      </g>
    `,
  };

  return wrapSvg(spirits[element], defs);
}

function sealFrameAndCenter(element, c0, c1) {
  const circleBase = `<circle cx="64" cy="64" r="52" fill="none" stroke="${c0}" stroke-width="2"/>\n<circle cx="64" cy="64" r="41" fill="none" stroke="${c1}" stroke-width="1.5"/>`;

  const frame = {
    fire: `<polygon points="64,8 105,78 23,78" fill="none" stroke="${c0}" stroke-width="2"/>\n<polygon points="64,20 92,72 36,72" fill="none" stroke="${c1}" stroke-width="1.5"/>\n<polygon points="64,30 85,69 43,69" fill="none" stroke="${c0}" stroke-width="1.1" opacity="0.7"/>`,
    water: `${circleBase}`,
    ice: `<polygon points="64,10 104,32 104,96 64,118 24,96 24,32" fill="none" stroke="${c0}" stroke-width="2"/>\n<polygon points="64,22 92,38 92,90 64,106 36,90 36,38" fill="none" stroke="${c1}" stroke-width="1.5"/>`,
    wind: `${circleBase}`,
    soil: `<polygon points="64,12 110,64 64,116 18,64" fill="none" stroke="${c0}" stroke-width="2"/>\n<polygon points="64,24 96,64 64,104 32,64" fill="none" stroke="${c1}" stroke-width="1.5"/>\n<rect x="44" y="44" width="40" height="40" rx="5" fill="none" stroke="${c0}" stroke-width="1.1" opacity="0.75"/>`,
    trees: `${circleBase}`,
    lightning: `<polygon points="64,12 108,64 64,116 20,64" fill="none" stroke="${c0}" stroke-width="2"/>\n<polygon points="64,24 97,64 64,104 31,64" fill="none" stroke="${c1}" stroke-width="1.5"/>`,
    light: `<polygon points="64,8 78,28 102,32 86,50 90,74 64,116 38,74 42,50 26,32 50,28" fill="none" stroke="${c0}" stroke-width="2"/>\n<circle cx="64" cy="64" r="37" fill="none" stroke="${c1}" stroke-width="1.3"/>`,
    void: `${circleBase}`,
    dark: `${circleBase}`,
    healing: `<circle cx="64" cy="64" r="52" fill="none" stroke="${c0}" stroke-width="2"/>\n<circle cx="64" cy="64" r="43" fill="none" stroke="${c1}" stroke-width="1.5"/>\n<circle cx="64" cy="64" r="33" fill="none" stroke="${c0}" stroke-width="1" opacity="0.7"/>`,
    space: `${circleBase}`,
    time: `<circle cx="64" cy="64" r="52" fill="none" stroke="${c0}" stroke-width="2"/>\n<circle cx="64" cy="64" r="43" fill="none" stroke="${c1}" stroke-width="1.5"/>`,
    robot: `<polygon points="64,10 104,24 118,64 104,104 64,118 24,104 10,64 24,24" fill="none" stroke="${c0}" stroke-width="2"/>\n<rect x="38" y="38" width="52" height="52" rx="6" fill="none" stroke="${c1}" stroke-width="1.4"/>`,
  };

  const center = {
    fire: `<path d="M64 88 C53 81 51 70 56 61 C59 56 62 51 64 46 C66 51 69 56 72 61 C77 70 75 81 64 88 Z" fill="${c0}" stroke="${c1}" stroke-width="1.5"/>`,
    water: `<path d="M64 43 C75 54 80 63 80 71 C80 81 73 89 64 89 C55 89 48 81 48 71 C48 63 53 54 64 43 Z" fill="${c0}" stroke="${c1}" stroke-width="1.5"/>`,
    ice: `<g stroke="${c1}" stroke-width="2" stroke-linecap="round"><line x1="64" y1="38" x2="64" y2="90"/><line x1="38" y1="64" x2="90" y2="64"/><line x1="45" y1="45" x2="83" y2="83"/><line x1="83" y1="45" x2="45" y2="83"/></g>`,
    wind: `<g stroke="${c1}" stroke-width="2.4" fill="none" stroke-linecap="round"><path d="M44 57 Q64 47 84 57"/><path d="M43 66 Q64 58 85 66"/><path d="M48 75 Q64 69 80 75"/></g>`,
    soil: `<polygon points="64,41 84,53 84,75 64,87 44,75 44,53" fill="${c0}" stroke="${c1}" stroke-width="1.5"/>\n<circle cx="46" cy="52" r="2.2" fill="#59a4ff"/><circle cx="82" cy="52" r="2.2" fill="#7dff97"/><circle cx="46" cy="76" r="2.2" fill="#d66bff"/><circle cx="82" cy="76" r="2.2" fill="#ffd86e"/>`,
    trees: `<g stroke="${c1}" stroke-width="2" fill="none" stroke-linecap="round"><path d="M64 48 L64 84"/><path d="M64 54 C59 59 54 60 49 60"/><path d="M64 55 C69 60 74 61 79 61"/><path d="M64 64 C59 69 55 70 51 70"/><path d="M64 65 C69 70 73 71 77 71"/></g>`,
    lightning: `<path d="M56 40 L70 40 L62 58 L74 58 L55 87 L61 66 L50 66 Z" fill="${c0}" stroke="${c1}" stroke-width="1.5"/>`,
    light: `<g stroke="${c1}" stroke-width="2" stroke-linecap="round"><circle cx="64" cy="64" r="12" fill="${c0}"/><line x1="64" y1="35" x2="64" y2="25"/><line x1="64" y1="93" x2="64" y2="103"/><line x1="35" y1="64" x2="25" y2="64"/><line x1="93" y1="64" x2="103" y2="64"/></g>`,
    void: `<g><circle cx="64" cy="64" r="17" fill="${c0}"/><circle cx="64" cy="64" r="30" fill="none" stroke="${c1}" stroke-width="1.6"/></g>`,
    dark: `<path d="M46 64 C46 52 55 43 67 43 C63 47 60 53 60 60 C60 72 68 81 79 84 C75 88 70 90 64 90 C54 90 46 81 46 71 Z" fill="${c0}" stroke="${c1}" stroke-width="1.5"/>`,
    healing: `<g stroke="${c1}" stroke-width="2" fill="none"><line x1="64" y1="44" x2="64" y2="84"/><line x1="44" y1="64" x2="84" y2="64"/><circle cx="64" cy="64" r="20"/></g>`,
    space: `<g stroke="${c1}" stroke-width="1.5" fill="none"><circle cx="64" cy="64" r="6" fill="${c0}"/><ellipse cx="64" cy="64" rx="25" ry="14"/><ellipse cx="64" cy="64" rx="25" ry="14" transform="rotate(60,64,64)"/><ellipse cx="64" cy="64" rx="25" ry="14" transform="rotate(-60,64,64)"/></g>`,
    time: `<g stroke="${c1}" stroke-width="1.8" fill="none" stroke-linecap="round"><circle cx="64" cy="64" r="20"/><line x1="64" y1="64" x2="64" y2="49"/><line x1="64" y1="64" x2="76" y2="71"/></g>`,
    robot: `<g stroke="${c1}" stroke-width="1.7" fill="none" stroke-linecap="round"><rect x="49" y="49" width="30" height="30" rx="4" fill="${c0}"/><line x1="64" y1="38" x2="64" y2="49"/><line x1="38" y1="64" x2="49" y2="64"/><line x1="79" y1="64" x2="90" y2="64"/><line x1="64" y1="79" x2="64" y2="90"/></g>`,
  };

  return { frame: frame[element], center: center[element] };
}

function sealArtwork(element) {
  const [c0, c1, c2] = PALETTE[element];
  const defs = `${radial('seal', c0, c1, c2)}\n${glowFilter('glow', 2.5)}`;
  const { frame, center } = sealFrameAndCenter(element, c0, c1);

  const ringDots = Array.from({ length: 18 }, (_, i) => {
    const t = (i / 18) * Math.PI * 2;
    const r = i % 2 === 0 ? 54 : 47;
    const x = 64 + Math.cos(t) * r;
    const y = 64 + Math.sin(t) * r;
    const rr = i % 3 === 0 ? 2.2 : 1.5;
    return `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="${rr}" fill="${i % 2 === 0 ? c0 : c1}" opacity="0.86"/>`;
  }).join('');

  const ticks = element === 'time'
    ? Array.from({ length: 12 }, (_, i) => {
        const t = (i / 12) * Math.PI * 2;
        const x1 = 64 + Math.cos(t) * 44;
        const y1 = 64 + Math.sin(t) * 44;
        const x2 = 64 + Math.cos(t) * 50;
        const y2 = 64 + Math.sin(t) * 50;
        return `<line x1="${x1.toFixed(2)}" y1="${y1.toFixed(2)}" x2="${x2.toFixed(2)}" y2="${y2.toFixed(2)}" stroke="${c1}" stroke-width="1"/>`;
      }).join('')
    : '';

  const gear = element === 'robot' || element === 'time'
    ? `<circle cx="103" cy="30" r="7" fill="none" stroke="${c0}" stroke-width="2"/><circle cx="26" cy="102" r="6" fill="none" stroke="${c1}" stroke-width="2"/>`
    : '';

  const body = `
    <g filter="url(#glow)">
      <circle cx="64" cy="64" r="58" fill="none" stroke="${c1}" stroke-width="0.6" opacity="0.28"/>
      ${frame}
      ${ringDots}
      ${ticks}
      ${gear}
      ${center}
    </g>
  `;

  return wrapSvg(body, defs);
}

async function main() {
  await fs.mkdir(SPIRIT_DIR, { recursive: true });
  await fs.mkdir(SEAL_DIR, { recursive: true });

  for (const element of ELEMENTS) {
    await fs.writeFile(path.join(SPIRIT_DIR, `${element}.svg`), spiritArtwork(element), 'utf8');
    await fs.writeFile(path.join(SEAL_DIR, `${element}.svg`), sealArtwork(element), 'utf8');
  }

  console.log('Generated strict per-element polished SVG assets for spirits and seals.');
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
