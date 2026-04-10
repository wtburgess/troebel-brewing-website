# Troebel Brewing Co. - HTML Wireframes

Interactive HTML/CSS/JS prototypes for the Troebel Brewing website.

## Quick Start

1. Open any HTML file in your browser
2. Start with `06-age-gate.html` for the full flow, or
3. Open `01-landing.html` directly to browse

## Pages

| File | Description |
|------|-------------|
| `01-landing.html` | Homepage with hero, featured beers, story |
| `02-beers.html` | Beer catalog with all 6 beers |
| `03-beer-detail.html` | Individual beer page (Brews Almighty example) |
| `04-about.html` | About page with story, team, philosophy |
| `05-order.html` | Cart and checkout page |
| `06-age-gate.html` | Age verification modal (16+) |

## Features

- **Mobile-first responsive design**
- **GSAP scroll animations** (sections fade in on scroll)
- **Beer pour/foam effect** on hero section
- **Interactive elements** (cart, quantity selectors, tabs)
- **Age verification** with DOB input

## Assets

```
assets/
├── css/
│   ├── styles.css      # Main styles, layout, components
│   └── animations.css  # Scroll effects, hover states
├── js/
│   └── animations.js   # GSAP ScrollTrigger setup
└── images/             # Add your images here
```

## Images Needed

The prototypes use placeholder images. Replace with actual photos:

- `logo.png` - Troebel logo (orange/gold)
- `logo-dark.png` - Logo for light backgrounds
- `hero-bg.jpg` - Hero background (brewing scene)
- `brews-almighty.png` - Bottle photo
- `moeskop.png` - Bottle photo
- `a-brew-good-men.png` - Bottle photo
- `renbier.png` - Bottle photo
- `bel-bef.png` - Bottle photo
- `hop3.png` - Bottle photo
- `brewery.jpg` - Brewery/team photo
- `cafe.jpg` - Beer in cafe setting
- `team-1.jpg`, `team-2.jpg`, `team-3.jpg` - Team photos
- `gallery-1.jpg` to `gallery-8.jpg` - Behind the scenes

## Colors (Brand)

```css
--color-primary: #D4A017;      /* Orange/Gold */
--color-primary-dark: #B8860B;
--color-dark: #1C1C1C;         /* Near black */
--color-cream: #FFFDF7;        /* Background */
```

## Fonts

- **Headings:** Playfair Display (serif)
- **Body:** Inter (sans-serif)

Loaded from Google Fonts.

## Testing

1. Open in Chrome DevTools → Toggle device toolbar
2. Test on iPhone SE (375px) and iPad (768px)
3. Check scroll animations work
4. Test cart add/remove functionality
5. Verify age gate flow

## Next Steps

After approval:
1. Set up Next.js 16 project
2. Port these HTML designs to React components
3. Connect to PocketBase API
4. Add Mollie payment integration

---

*Troebel Brewing Co. - Hopmerkelijke brouwsels uit Antwerpen*
