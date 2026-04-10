# StorySection Redesign - Neo-Brutalist "Garage Punk"

## Overview
Complete redesign of the "Wij Zijn Troebel" story section with creative multi-image layout and neo-brutalist styling.

## Visual Structure

### Top Section (Two Columns)

#### LEFT: Content
- **Massive yellow title**: "WIJ ZIJN TROEBEL" / "NIET HELDER, WEL BRILJANT"
  - Anton font, 4-5rem size
  - Yellow (#FFC000) color
  - Uppercase, tight line-height (0.9)

- **Story paragraphs**: 3 paragraphs with hierarchy
  - First paragraph: Bold cream text
  - Other paragraphs: Gray text for depth

- **Handwritten quote box**:
  - Yellow background, black border (4px)
  - Hard shadow (8px 8px)
  - Tilted (-1deg)
  - Permanent Marker font
  - Text: "Garage brewing met attitude!"

- **CTA Button**: White button linking to /verhaal

#### RIGHT: Image Collage (Overlapping, Tilted)
1. **Founders Polaroid** (Main, Top-Left)
   - White polaroid frame
   - Grayscale image (color on hover)
   - Rotated -4deg
   - Caption: "De Schuldigen (2024)"
   - z-index: 20

2. **Garage Brewing Photo** (Middle-Right, overlapping)
   - White frame with thick border
   - Rotated +3deg
   - Hard shadow (10px 10px)
   - Caption: "Where the magic happens"
   - z-index: 30

3. **Cartoon Sticker** (Bottom-Left)
   - Yellow background
   - Thick black border
   - Rotated -8deg
   - Hard shadow
   - z-index: 40

4. **Handwritten Annotations**:
   - "↓ Onze roots" (yellow, rotated -12deg)
   - "Est. 2024 →" (cream, rotated +8deg)

5. **Circular Badge** (Bottom-Right)
   - Red background, white text
   - Circular (120x120px)
   - Rotated +12deg
   - Text: "GARAGE MADE!"
   - z-index: 50

### Bottom Section (Etiquettes)

- **Title**: "Van schets tot eticket"
  - Anton font, yellow
  - Centered

- **Subtitle**: "Elk detail met de hand gemaakt"
  - Permanent Marker font, gray

- **Flex Layout**:
  1. **Etiquette Image Card**:
     - White frame, black border
     - Yellow hard shadow (8px 8px)
     - Rotated -2deg
     - Caption: "Handcrafted labels"

  2. **Text Content**:
     - Explanation paragraph
     - Handwritten arrow: "← Check die details!"

## Design Elements Used

### Colors
- **Yellow**: #FFC000 (main accent)
- **Dark**: #1C1C1C (background, borders, text)
- **Cream**: #FFFDF7 (text)
- **Red**: #E63946 (badge)
- **White**: #FFFFFF (cards, frames)

### Fonts
- **Anton**: Headings (uppercase, bold)
- **Roboto Condensed**: Body text
- **Permanent Marker**: Handwritten captions, quotes, annotations

### Neo-Brutalist Techniques
- **Hard shadows**: 6px-10px solid black shadows
- **Thick borders**: 3-4px solid black borders
- **Tilted elements**: Rotating between -8deg to +12deg
- **Overlapping layers**: z-index hierarchy (10-50)
- **High contrast**: Black on white, yellow accents

### Responsive Behavior
- **Mobile**: Single column, image collage stacks on top
- **Tablet**: Maintained collage but smaller
- **Desktop**: Full two-column layout with all decorations
- **Hidden elements**: Some annotations/badges hidden on mobile for clarity

## Images Used
1. `/founders.jpg` - The brewery founders
2. `/Garage brouwen.png` - Garage brewing scene
3. `/Cartoon brouwen.png` - Cartoon illustration
4. `/eticket brews.jpg` - Beer label etiquettes

## Interactive Features
- **Polaroid hover**: Grayscale → full color on hover
- **Button hover**: Shadow increases, background changes

## Component Props
```typescript
interface StorySectionProps {
  title?: string;          // Default: "NIET HELDER,<br/>WEL BRILJANT"
  paragraphs?: string[];   // Array of story paragraphs
  ctaLabel?: string;       // Default: "Het hele verhaal"
  ctaHref?: string;        // Default: "/verhaal"
}
```

## Usage on Landing Page
```tsx
<StorySection
  title="WIJ ZIJN<br/>TROEBEL"
  paragraphs={[
    "Wat begon in een garage met een tweedehands brouwketel en te veel goesting, is nu Troebel.",
    "Wij geloven niet in gladgestreken marketing of smaakloos bier. Elk brouwsel heeft karakter. Soms wat troebel, altijd oprecht.",
  ]}
  ctaLabel="Het hele verhaal"
  ctaHref="/verhaal"
/>
```

## Key Improvements Over Original
1. ✅ **Multiple images** instead of single polaroid
2. ✅ **Creative overlapping layout** vs simple grid
3. ✅ **Handwritten annotations** for personality
4. ✅ **Yellow accent color** throughout (#FFC000)
5. ✅ **Circular badge** for "GARAGE MADE" emphasis
6. ✅ **Bottom section** showing etiquettes/labels
7. ✅ **Compelling visual story** with captions
8. ✅ **Neo-brutalist aesthetic** with tilts, shadows, borders
9. ✅ **More engaging and memorable** design

## Visual Inspiration
Based on wireframe: `wireframes/06-landing-perfected-rework.html`
- Garage punk aesthetic
- DIY/handmade feel
- Bold, unapologetic design
- Storytelling through visuals
