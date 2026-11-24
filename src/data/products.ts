export type Category = "all" | "dick" | "pussy" | "mini" | "gift";
export type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  imageAlt?: string;
  categories: Category[];
  contents: string;
  description: string;
  availability: "reference";
};
export const categories: { id: Category; label: string }[] = [
  { id: "all", label: "All waffles" },
  { id: "dick", label: "Dick waffles" },
  { id: "pussy", label: "Pussy waffles" },
  { id: "mini", label: "Mini waffles" },
  { id: "gift", label: "Gift sets" },
];
export const products: Product[] = [
  {
    id: "dick-trio",
    name: "Box of 3 Dick Waffles",
    price: 17,
    image: "waffle-trio",
    categories: ["dick", "gift"],
    contents: "3 full-size Dick Waffles",
    description:
      "A box made for sharing — Three signature waffle shapes, beautifully dressed and ready to make an impression",
    availability: "reference",
  },
  {
    id: "pussy-trio",
    name: "Box of 3 Pussy Waffles",
    price: 17,
    image: "pussy-box",
    categories: ["pussy", "gift"],
    contents: "3 full-size Pussy Waffles",
    description:
      "Three of our unmistakable Pussy Waffles, together in one box — A playful little gift to share",
    availability: "reference",
  },
  {
    id: "dick-mixed",
    name: "2 Dick Waffles + 3 Minis",
    price: 17,
    image: "mixed-box",
    categories: ["dick", "mini", "gift"],
    contents: "2 Dick Waffles + 3 Mini Dick Waffles",
    description:
      "Big personalities — Little pleasures — A mixed box of full-size and mini Dick Waffles",
    availability: "reference",
  },
  {
    id: "pussy-mixed",
    name: "2 Pussy Waffles + 3 Minis",
    price: 17,
    image: "pussy-box",
    categories: ["pussy", "mini", "gift"],
    contents: "2 Pussy Waffles + 3 Mini Pussy Waffles",
    description:
      "The Pussy Waffle mixed-box option from the supplied menu — The photograph shows the full-size shape; the mixed-box photograph is unavailable",
    availability: "reference",
  },
  {
    id: "mini-nine",
    name: "Mini Dick Waffles",
    price: 9,
    image: "mini-waffles",
    imageAlt: "Three Mini Dick Waffles from the supplied mixed-box photo",
    categories: ["dick", "mini"],
    contents: "9 mini waffles",
    description:
      "Nine bite-size versions of the signature Dick Waffle — A small box with plenty of personality",
    availability: "reference",
  },
  {
    id: "single-dick",
    name: "Single Dick Waffle",
    price: 7,
    image: "single-pack",
    categories: ["dick"],
    contents: "1 individually packed Dick Waffle",
    description:
      "A single signature waffle, individually packed — One little pleasure to take with you",
    availability: "reference",
  },
];
export const money = (amount: number) =>
  new Intl.NumberFormat("en-IE", {
    style: "currency",
    currency: "EUR",
    maximumFractionDigits: 0,
  }).format(amount);
export const productById = new Map(products.map((p) => [p.id, p]));
