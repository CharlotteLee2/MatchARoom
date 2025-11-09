"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const puppeteer_1 = __importDefault(require("puppeteer"));
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient();
/** Scraper for American Campus API-based sites */
/** Scraper for Villas at Chestnut Ridge (American Campus) */
/** Scraper for Villas at Chestnut Ridge (American Campus) */
async function scrapeAmericanCampusDOM(url, siteName, baseUrl) {
    console.log(`🚀 Launching scraper for ${siteName}`);
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 60000 });
        console.log(`✅ Page loaded for ${siteName}`);
        // Wait for "Results:" text or the lease dropdown to confirm Vue has rendered
        console.log(`⌛ Waiting for floorplans to render...`);
        await page.waitForFunction(() => document.body.innerText.includes("Results:") ||
            document.querySelectorAll("img").length > 3, { timeout: 30000 });
        const scrapedData = await page.evaluate(() => {
            const results = [];
            // Find all heading elements that might contain floorplan names
            const headings = Array.from(document.querySelectorAll("h1, h2, h3, h4, h5, h6"));
            for (const heading of headings) {
                const titleText = heading.textContent?.trim() || "";
                // Match "Studio A", "Studio B", or "X Bed - X.X Bath" patterns
                const isStudio = /^Studio [A-Z]$/i.test(titleText);
                const isBedBath = /^\d+\s+Bed\s*-\s*\d+(?:\.\d+)?\s+Bath$/i.test(titleText);
                if (!isStudio && !isBedBath)
                    continue;
                // Found a valid floorplan title
                // Now find its parent container to get all the data
                let container = heading;
                let searchDepth = 0;
                let floorplanData = null;
                while (container && searchDepth < 15) {
                    const containerText = container.textContent || "";
                    // Extract data from this container
                    const priceMatch = containerText.match(/\$\s?([\d,]+)/);
                    const sqftMatch = containerText.match(/Sq\s*Ft\s*-\s*(\d+)/i);
                    // Parse beds and baths from the title
                    let beds = 0;
                    let baths = 0;
                    if (isStudio) {
                        beds = 0;
                        baths = 1;
                    }
                    else {
                        const bedMatch = titleText.match(/(\d+)\s+Bed/i);
                        const bathMatch = titleText.match(/(\d+(?:\.\d+)?)\s+Bath/i);
                        beds = bedMatch ? parseInt(bedMatch[1]) : 0;
                        baths = bathMatch ? parseFloat(bathMatch[1]) : 0;
                    }
                    // Look for image
                    const img = container.querySelector("img");
                    const imageSrc = img?.src || img?.getAttribute("data-src") || null;
                    // If we have price and a valid name, save it
                    if (priceMatch) {
                        floorplanData = {
                            name: titleText,
                            beds: beds,
                            baths: baths,
                            sqft: sqftMatch ? parseInt(sqftMatch[1]) : null,
                            price: parseInt(priceMatch[1].replace(/,/g, "")),
                            image: imageSrc ? new URL(imageSrc, window.location.origin).href : null,
                        };
                        break;
                    }
                    container = container.parentElement;
                    searchDepth++;
                }
                if (floorplanData) {
                    results.push(floorplanData);
                }
            }
            // Remove duplicates by name
            const seen = new Set();
            return results.filter((item) => {
                if (seen.has(item.name))
                    return false;
                seen.add(item.name);
                return true;
            });
        });
        console.log(`📊 Found ${scrapedData.length} floorplans for ${siteName}`);
        if (scrapedData.length === 0) {
            console.log(`❌ Could not find any floorplan data. Debug info:`);
            const preview = await page.evaluate(() => document.body.innerText.slice(0, 600));
            console.log("Page preview:", preview);
            await browser.close();
            return;
        }
        // Convert scraped data to Floorplan format
        const floorplans = scrapedData.map((item) => ({
            name: item.name,
            beds: item.beds,
            baths: item.baths,
            sq_ft_min: item.sqft,
            min_rate: item.price,
            image: item.image,
            slug: item.name.toLowerCase().replace(/\s+/g, "-"),
        }));
        console.log(`📊 Total floorplans to save: ${floorplans.length}`);
        const site = await prisma.site.upsert({
            where: { name: siteName },
            update: {},
            create: { name: siteName, baseUrl },
        });
        for (const f of floorplans) {
            const priceValue = f.special_rate ||
                f.special_value ||
                (Array.isArray(f.rates) && f.rates.length
                    ? f.rates[0].special_value || f.rates[0].value
                    : f.min_rate);
            const bedroomText = f.beds === 0 ? "Studio" : `${f.beds} Bed`;
            console.log(`📌 ${f.name} — ${bedroomText} | ${f.baths} Bath — $${priceValue ?? "?"} — ${f.sq_ft_min ?? "?"} sq ft`);
            try {
                await prisma.listing.upsert({
                    where: { link: f.slug || f.name },
                    update: {
                        title: f.name,
                        price: priceValue ? Number(priceValue) : null,
                        address: `${bedroomText} | ${f.baths} Bath | ${f.sq_ft_min ?? ""} Sq Ft`,
                        imageUrl: typeof f.image === "string" ? f.image : null,
                        dateScraped: new Date(),
                        site: { connect: { id: site.id } },
                    },
                    create: {
                        title: f.name,
                        price: priceValue ? Number(priceValue) : null,
                        address: `${bedroomText} | ${f.baths} Bath | ${f.sq_ft_min ?? ""} Sq Ft`,
                        link: f.slug || f.name,
                        imageUrl: typeof f.image === "string" ? f.image : null,
                        dateScraped: new Date(),
                        site: { connect: { id: site.id } },
                    },
                });
                console.log(`  ✅ Saved to database`);
            }
            catch (err) {
                console.error(`  ❌ Error saving ${f.name}: ${err.message}`);
            }
        }
        console.log(`✅ Finished scraping ${siteName}`);
        await browser.close();
    }
    catch (error) {
        console.error(`❌ Error scraping ${siteName}:`, error);
        await browser.close();
    }
}
/** Scraper utility for a Landmark-style Vue site */
async function scrapeLandmarkStyleSite(url, siteName, baseUrl) {
    console.log(`🚀 Launching scraper for ${siteName}`);
    const browser = await puppeteer_1.default.launch({ headless: true });
    const page = await browser.newPage();
    try {
        await page.goto(url, { waitUntil: "domcontentloaded", timeout: 30000 });
        console.log(`✅ Page loaded for ${siteName}`);
    }
    catch (error) {
        console.error(`❌ Error loading page: ${error}`);
        await browser.close();
        return;
    }
    // First try: Check for JavaScript variables
    let floorplans = await page.evaluate(() => {
        const possibleVars = [
            'floorplans',
            'cottages',
            'floorPlans',
            'apartments',
            'units',
            'listings'
        ];
        for (const varName of possibleVars) {
            // @ts-ignore
            if (typeof window[varName] !== "undefined" && Array.isArray(window[varName])) {
                console.log(`Found data in: ${varName}`);
                // @ts-ignore
                return window[varName];
            }
        }
        return [];
    });
    // Second try: Scrape from DOM if no JS variables found
    if (floorplans.length === 0) {
        console.log(`⚠️ No floorplans found via JavaScript. Scraping DOM...`);
        const scrapedData = await page.evaluate(() => {
            const results = [];
            // Look for cottage/floorplan containers
            const containers = document.querySelectorAll('div, section, article');
            // Invalid names to filter out
            const invalidNames = ['floor plans', 'filter', 'cottage type', 'floorplans', 'cottages', 'view floorplan'];
            containers.forEach((container) => {
                const html = container.innerHTML;
                // Look for the pattern: Name, beds/baths/sqft, price
                const nameElement = container.querySelector('h1, h2, h3, h4, h5, [class*="name"], [class*="title"]');
                if (!nameElement)
                    return;
                const name = nameElement.textContent?.trim();
                if (!name || name.length < 3)
                    return; // Skip if name is too short
                // Filter out invalid names
                const nameLower = name.toLowerCase();
                if (invalidNames.some(invalid => nameLower.includes(invalid))) {
                    return;
                }
                // Look for bed/bath/sqft pattern like "2 Bed / 2 Bath / 1118 Sqft"
                const text = container.textContent || '';
                const bedMatch = text.match(/(\d+)\s*Bed/i);
                const bathMatch = text.match(/(\d+(?:\.\d+)?)\s*Bath/i);
                const sqftMatch = text.match(/(\d+)\s*Sqft/i);
                // Look for price - typically starts with $
                const priceMatch = text.match(/\$(\d+,?\d*)/);
                // Look for images
                const imgElement = container.querySelector('img');
                const imageUrl = imgElement?.src || imgElement?.getAttribute('data-src') || null;
                // Only add if we found at least name, beds, AND baths (filter out incomplete entries)
                if (name && bedMatch && bathMatch) {
                    results.push({
                        name: name,
                        beds: parseInt(bedMatch[1]),
                        baths: parseFloat(bathMatch[1]),
                        sqft: sqftMatch ? parseInt(sqftMatch[1]) : null,
                        price: priceMatch ? parseInt(priceMatch[1].replace(/,/g, '')) : null,
                        image: imageUrl
                    });
                }
            });
            // Remove duplicates by name
            const seen = new Set();
            return results.filter(item => {
                if (seen.has(item.name))
                    return false;
                seen.add(item.name);
                return true;
            });
        });
        console.log(`✅ Found ${scrapedData.length} cottages via DOM scraping`);
        if (scrapedData.length === 0) {
            console.log(`❌ Could not find any cottage data. Debug info:`);
            // Log the page structure for debugging
            const pageText = await page.evaluate(() => document.body.textContent?.substring(0, 500));
            console.log('Page text preview:', pageText);
            await browser.close();
            return;
        }
        // Convert scraped data to Floorplan format
        scrapedData.forEach(item => {
            floorplans.push({
                name: item.name,
                beds: item.beds,
                baths: item.baths,
                sq_ft_min: item.sqft,
                min_rate: item.price,
                image: item.image,
                slug: item.name.toLowerCase().replace(/\s+/g, '-')
            });
        });
    }
    console.log(`📊 Total floorplans to save: ${floorplans.length}`);
    const site = await prisma.site.upsert({
        where: { name: siteName },
        update: {},
        create: { name: siteName, baseUrl },
    });
    for (const f of floorplans) {
        const priceValue = f.special_rate ||
            f.special_value ||
            (Array.isArray(f.rates) && f.rates.length
                ? f.rates[0].special_value || f.rates[0].value
                : f.min_rate);
        console.log(`📌 ${f.name} — ${f.beds} Bed | ${f.baths} Bath — $${priceValue ?? "?"} — ${f.sq_ft_min ?? "?"} sq ft`);
        try {
            await prisma.listing.upsert({
                where: { link: f.slug || f.name },
                update: {
                    title: f.name,
                    price: priceValue ? Number(priceValue) : null,
                    address: `${f.beds} Bed | ${f.baths} Bath | ${f.sq_ft_min ?? ""} Sq Ft`,
                    imageUrl: typeof f.image === "string"
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
                    address: `${f.beds} Bed | ${f.baths} Bath | ${f.sq_ft_min ?? ""} Sq Ft`,
                    link: f.slug || f.name,
                    imageUrl: typeof f.image === "string"
                        ? f.image
                        : typeof f.image?.url === "string"
                            ? f.image.url
                            : null,
                    dateScraped: new Date(),
                    site: { connect: { id: site.id } },
                },
            });
            console.log(`  ✅ Saved to database`);
        }
        catch (err) {
            console.error(`  ❌ Error saving ${f.name}: ${err.message}`);
        }
    }
    console.log(`✅ Finished scraping ${siteName}`);
    await browser.close();
}
/** Main combined scraper */
async function main() {
    await scrapeLandmarkStyleSite("https://www.thestationbuffalo.com/floorplans/", "The Station Buffalo", "https://www.thestationbuffalo.com");
    await scrapeLandmarkStyleSite("https://www.aspenub.com/cottages/", "Aspen Heights Buffalo", "https://www.aspenub.com");
    // Look for the API endpoint in your screenshot - it should be something like:
    // /api/nextgen/listing/454 or /api/lightning/listing/454
    await scrapeAmericanCampusDOM("https://www.americancampus.com/student-apartments/ny/buffalo/villas-at-chestnut-ridge/floor-plans", "Villas at Chestnut Ridge", "https://www.americancampus.com");
    console.log("🏁 All sites scraped successfully!");
    await prisma.$disconnect();
}
main().catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
});
