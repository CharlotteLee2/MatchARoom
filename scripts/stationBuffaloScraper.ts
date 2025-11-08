import puppeteer from "puppeteer";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Define the shape of the floorplan data we expect
interface Floorplan {
  name: string;
  beds: number;
  baths: number;
  sq_ft_min?: number;
  min_rate?: number;
  special_rate?: number;
  special_value?: number;
  slug?: string;
  image?: { url?: string } | string;
  rates?: { value?: number; special_value?: number }[];
}

async function scrapeStationBuffalo() {
  console.log("🚀 Launching headless browser...");
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.goto("https://www.thestationbuffalo.com/floorplans/", {
    waitUntil: "networkidle0",
  });

  console.log("⌛ Waiting for floorplans to load...");
  await page.waitForSelector(".floorplans");

  // Explicitly type the result as Floorplan[]
  const floorplans: Floorplan[] = await page.evaluate(() => {
    // @ts-ignore – floorplans is a global variable defined by the site
    return typeof floorplans !== "undefined" ? floorplans : [];
  });

  console.log(`✅ Found ${floorplans.length} floorplans`);

  const site = await prisma.site.upsert({
    where: { name: "The Station Buffalo" },
    update: {},
    create: {
      name: "The Station Buffalo",
      baseUrl: "https://www.thestationbuffalo.com",
    },
  });

  for (const f of floorplans) {
    // Prefer the discounted (special) rate if available
    const priceValue =
      f.special_rate ||
      f.special_value ||
      (Array.isArray(f.rates) && f.rates.length
        ? f.rates[0].special_value || f.rates[0].value
        : f.min_rate);

    console.log(
      `${f.name} — ${f.beds} Bed | ${f.baths} Bath — $${priceValue} — ${f.sq_ft_min} sq ft`
    );

    try {
      const result = await prisma.listing.upsert({
        where: { link: f.slug || f.name },
        update: {
          title: f.name,
          price: priceValue ? Number(priceValue) : null,
          address: `${f.beds} Bed | ${f.baths} Bath | ${
            f.sq_ft_min ?? ""
          } Sq Ft`,
          imageUrl:
            typeof f.image === "string"
              ? f.image
              : typeof f.image?.url === "string"
              ? f.image.url
              : null,
          dateScraped: new Date(),
          site: { connect: { id: site.id } },
        },
        create: {
          title: f.name,
          price: priceValue ? Number(priceValue) : null,
          address: `${f.beds} Bed | ${f.baths} Bath | ${
            f.sq_ft_min ?? ""
          } Sq Ft`,
          link: f.slug || f.name,
          imageUrl:
            typeof f.image === "string"
              ? f.image
              : typeof f.image?.url === "string"
              ? f.image.url
              : null,
          dateScraped: new Date(),
          site: { connect: { id: site.id } },
        },
      });

      console.log(`✅ Saved: ${result.title}`);
    } catch (err: any) {
      console.error(`❌ Error saving ${f.name}:`, err.message);
    }
  }

  console.log("✅ Scrape complete");
  await browser.close();
  await prisma.$disconnect();
}

scrapeStationBuffalo().catch(async (e) => {
  console.error(e);
  await prisma.$disconnect();
  process.exit(1);
});
