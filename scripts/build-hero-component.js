import fs from 'fs';
import path from 'path';

function buildHeroComponent() {
  const html = fs.readFileSync('thegrind-hero-extracted.html', 'utf-8');

  // Extract navbar
  const navStart = html.indexOf('<nav');
  const navEnd = html.indexOf('</nav>') + 6;
  let navHtml = html.slice(navStart, navEnd);

  // Extract section#hero
  const heroStart = html.indexOf('<section id="hero"');
  // Stop before video_player to avoid large unused modal
  let heroEnd = html.indexOf('<div id="persoonlijke-boodschap"');
  if (heroEnd === -1) {
    heroEnd = html.indexOf('</section>', heroStart) + 10;
  } else {
    heroEnd = html.indexOf('</section>', heroEnd) + 10;
  }
  let heroHtml = html.slice(heroStart, heroEnd);

  let combined = navHtml + '\n' + heroHtml;

  // Replace CDN URLs with local /thegrind/ paths
  combined = combined.replace(/https:\/\/the-grind\.b-cdn\.net\/720_header\.mp4/g, '/thegrind/720_header.mp4');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*4J9A2840[^"]*/g, '/thegrind/photo_1.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*IMG_1213[^"]*/g, '/thegrind/photo_2.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*Exclusion%205\.svg/g, '/thegrind/grind_logo.svg');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*cartboard_overlay[^"]*/g, '/thegrind/cartboard_overlay.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*pexels-cristian-rojas-10042883[^"]*/g, '/thegrind/avatar_1.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*pexels-cristian-rojas-8809594[^"]*/g, '/thegrind/avatar_2.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*pexels-artempodrez-6253345[^"]*/g, '/thegrind/avatar_3.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*pexels-mastercowley-1153370[^"]*/g, '/thegrind/avatar_4.webp');
  combined = combined.replace(/https:\/\/cdn\.prod\.website-files\.com\/[^"]*Video\.avif/g, '/thegrind/video_opener.avif');

  // Also remove any remaining srcset with cdn urls
  combined = combined.replace(/srcset="[^"]*"/g, '');

  // Escape backticks for template string
  const escapedHtml = combined.replace(/`/g, '\\`').replace(/\${/g, '\\${');

  const componentContent = `// Komponen Hero 1:1 The Grind Replica
// Terisolasi dari sistem booking Supabase UKK
import React, { useEffect } from 'react';

export const HeroTheGrind: React.FC = () => {
  useEffect(() => {
    // Inject thegrind.css if not already present
    const id = 'thegrind-custom-css';
    if (!document.getElementById(id)) {
      const link = document.createElement('link');
      link.id = id;
      link.rel = 'stylesheet';
      link.href = '/thegrind/thegrind.css';
      document.head.appendChild(link);
    }
  }, []);

  return (
    <div className="thegrind-scope w-mod-js w-mod-ix3">
      <div dangerouslySetInnerHTML={{ __html: \`${escapedHtml}\` }} />
    </div>
  );
};

export default HeroTheGrind;
`;

  fs.mkdirSync('src/components/thegrind', { recursive: true });
  fs.writeFileSync('src/components/thegrind/HeroTheGrind.tsx', componentContent);
  console.log('Komponen src/components/thegrind/HeroTheGrind.tsx berhasil dibuat!');
}

buildHeroComponent();
