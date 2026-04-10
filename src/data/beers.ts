export interface Beer {
  id: string;
  slug: string;
  name: string;
  style: string;
  category: "pale-ale" | "ipa" | "saison" | "seasonal" | "tripel" | "session" | "blond";
  description: string;
  longDescription?: string;
  abv: number;
  ibu?: number;
  price: number;
  rating?: number;
  ratingCount?: number;
  image: string;
  tastingNotes?: string[];
  foodPairings?: string[];
  isAvailable: boolean;
  isNew?: boolean;
  isLimited?: boolean;
}

export const beers: Beer[] = [
  {
    id: "1",
    slug: "rendier",
    name: "Rendier",
    style: "Winter Ale",
    category: "seasonal",
    description: "Kruidig, warm en gevaarlijk vlot. Kerst in een fleske.",
    longDescription: "Ons feestelijke winterbier met hints van kaneel, kruidnagel en sinaasappelschil. Perfect om bij het haardvuur te genieten.",
    abv: 8.5,
    ibu: 20,
    price: 3.50,
    image: "/Rendier (winter ale).png",
    tastingNotes: ["Kaneel", "Kruidnagel", "Sinaasappel"],
    foodPairings: ["Wild", "Stoofvlees", "Chocolade desserts"],
    isAvailable: true,
    isLimited: true,
  },
  {
    id: "2",
    slug: "moeskop",
    name: "Moeskop",
    style: "Blond",
    category: "blond",
    description: "Onze klassieker. Fris, fruitig en een beetje troebel.",
    longDescription: "Moeskop is ons vlaggenschip bier. Een heerlijk blond bier met een perfecte balans tussen mout en hop.",
    abv: 6.5,
    ibu: 25,
    price: 3.00,
    rating: 3.32,
    ratingCount: 90,
    image: "/Moeskopje bier.png",
    tastingNotes: ["Honing", "Citrus", "Graan"],
    foodPairings: ["Mosselen", "Zachte kazen", "Vis"],
    isAvailable: true,
    isNew: true,
  },
  {
    id: "3",
    slug: "brews-almighty",
    name: "Brews Almighty",
    style: "Pale Ale",
    category: "pale-ale",
    description: "Goddelijke pale ale. Citrus, hop en heilig water.",
    longDescription: "Brews Almighty is onze flagship pale ale. Een perfecte balans tussen mout en hop, met subtiele citrus- en bloementoetsen.",
    abv: 5.8,
    ibu: 35,
    price: 3.20,
    rating: 3.41,
    ratingCount: 98,
    image: "/Brews almighty bottle.png",
    tastingNotes: ["Citrus", "Bloemen", "Licht karamel"],
    foodPairings: ["Gegrilde kip", "Zachte kazen", "Salade"],
    isAvailable: true,
  },
  {
    id: "4",
    slug: "marwals",
    name: "Marwals",
    style: "Tripel",
    category: "tripel",
    description: "Onze tripel. Complex, fruitig, met een droge afdronk.",
    longDescription: "Een krachtige Belgische tripel die eer doet aan de traditie. Complex, met fruittonen en een verrassend droge finish.",
    abv: 8.0,
    ibu: 30,
    price: 3.80,
    image: "/MARWALS.jpg",
    tastingNotes: ["Banaan", "Kruidnagel", "Honing"],
    foodPairings: ["Abdijkazen", "Witloof met hesp", "Appeltaart"],
    isAvailable: true,
  },
  {
    id: "5",
    slug: "bitje",
    name: "Bi'tje",
    style: "Session",
    category: "session",
    description: "Laag in alcohol, hoog in smaak. Voor als het er eentje meer mag zijn.",
    longDescription: "Een licht en verfrissend session bier voor die lange zomeravonden. Laag in alcohol, groot in smaak.",
    abv: 4.2,
    ibu: 18,
    price: 3.00,
    image: "/BI'TJE.jpg",
    tastingNotes: ["Gras", "Citroen", "Licht mout"],
    foodPairings: ["BBQ", "Salades", "Lichte snacks"],
    isAvailable: true,
  },
  {
    id: "6",
    slug: "a-brew-good-men",
    name: "A Brew Good Men",
    style: "Farmhouse Saison",
    category: "saison",
    description: "Droog, kruidig en perfect voor de zomerse dagen.",
    longDescription: "Een klassieke farmhouse saison met een moderne twist. Licht, verfrissend en complex tegelijk.",
    abv: 5.4,
    ibu: 25,
    price: 3.50,
    rating: 3.56,
    ratingCount: 16,
    image: "/A brew Good Men,.png",
    tastingNotes: ["Peper", "Citrus", "Gist"],
    foodPairings: ["Mosselen", "Geitenkaas", "Lichte pasta"],
    isAvailable: true,
  },
];

export const categories = [
  { id: "all", label: "Alles" },
  { id: "blond", label: "Blond" },
  { id: "pale-ale", label: "Pale Ale" },
  { id: "tripel", label: "Tripel" },
  { id: "saison", label: "Saison" },
  { id: "session", label: "Session" },
  { id: "seasonal", label: "Seizoen" },
] as const;

export function getBeerBySlug(slug: string): Beer | undefined {
  return beers.find((beer) => beer.slug === slug);
}

export function getBeersByCategory(category: string): Beer[] {
  if (category === "all") return beers;
  return beers.filter((beer) => beer.category === category);
}
