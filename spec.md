# Love for Drithi

## Current State
- Full romantic web app with hero section, love letters, memory gallery, story, quote, and music player
- All data (gallery photos, music, content) saved to localStorage only — changes don't sync across devices
- Hero section has floating elements using emoji: 🌸, 💕, ✿ (flowers and hearts mix with flower/bouquet SVG decorations)
- Gallery: 5 photos loaded from static assets, managed via localStorage
- Music player: uploads and saves MP3 as base64 in localStorage
- Edit mode: all content editable via ✏️ panel (bottom-left)

## Requested Changes (Diff)

### Add
- Cloud storage via blob-storage component for gallery photos (upload to ICP backend, retrieve via URL)
- Cloud storage for background music (upload MP3 to ICP backend)
- Premium interactive front page animation: flowers (🌸🌺🌹🌷) and hearts (❤️💕💗💖) only — no bouquets, no other elements
- Particles that burst on click/tap in hero section
- Mouse/touch parallax effect on floating elements
- Glow/pulse animations on hearts
- Varied sizes, speeds, and entry positions for floating elements

### Modify
- Gallery photo upload: instead of converting to base64 dataURL and storing in localStorage, upload to blob-storage canister and store the returned URL
- Music upload: instead of storing base64 in localStorage, upload to blob-storage and use the returned URL
- Floating elements in hero: replace current hearts array (with 🌸, 💕, ✿ emojis) with a premium animated system using only flowers and hearts with interactive effects
- Remove RoseIllustration and FloralCorner SVG components used as background decorations (replace with new premium particle system)

### Remove
- localStorage usage for gallery photos and music (replace with cloud URLs)
- Old `hearts` array and basic CSS float animation for the hero

## Implementation Plan
1. Install blob-storage hooks from the Caffeine component (use `useBlobStorage` hook pattern)
2. Replace gallery photo upload handler to upload to blob-storage and use returned URL instead of base64
3. Replace music upload handler to upload to blob-storage and use returned URL
4. Build new `PremiumHeroParticles` component with:
   - 30+ floating flowers and hearts with varied sizes (12px–40px), speeds, delays, horizontal positions
   - CSS keyframe animations for float-up, sway, and fade
   - Click/tap burst effect: on click anywhere in hero, spawn 8–12 particles that explode outward and fade
   - Subtle mouse parallax: floating elements shift slightly based on cursor position
   - Hearts pulse/glow with a soft pink radial glow filter
   - Elements only: 🌸 🌺 🌹 🌷 ❤️ 💕 💗 💖 💓 🌼
5. Keep all other sections (letters, gallery, story, quote, music player, edit panel) exactly as-is
