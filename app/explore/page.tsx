import React from "react";
import { prisma } from "../../lib/prisma";
import ExploreList from "../../components/ExploreList";

export const metadata = {
  title: "Explore - MatchARoom",
};

export default async function ExplorePage() {
  const sites = await prisma.site.findMany({ orderBy: { name: 'asc' } });

  // serialize minimal fields for client (annotate param to avoid implicit any)
  const payload = sites.map((s: { id: number; name: string; baseUrl?: string | null }) => ({ id: s.id, name: s.name, baseUrl: s.baseUrl }));

  return <ExploreList sites={payload} />;
}
