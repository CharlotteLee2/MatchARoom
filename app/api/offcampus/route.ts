import { NextResponse } from "next/server";

const MOCK = [
  { id: "r1", title: "Sunny 2BR Near Campus", description: "2 bed, 1 bath, close to bus", price: 1200, image: "/global.svg" },
  { id: "r2", title: "Cozy Studio", description: "Small studio, utilities extra", price: 800, image: "/next.svg" },
  { id: "r3", title: "Spacious House 4BR", description: "Share with 3 others, big backyard", price: 650, image: "/vercel.svg" },
];

export async function GET() {
  return NextResponse.json(MOCK);
}
