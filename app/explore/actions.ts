'use server'

import { prisma } from '@/lib/prisma'

export async function getListings() {
  try {
    const listings = await prisma.listing.findMany({
      include: {
        site: true,
      },
      orderBy: {
        dateScraped: 'desc',
      },
    })
    
    return listings.map((listing: typeof listings[0]) => ({
      id: listing.id.toString(),
      title: listing.title,
      price: listing.price?.toString() || '',
      image: listing.imageUrl || '',
      community: listing.site.name,
      address: listing.address || '',
    }))
  } catch (error) {
    console.error('Error fetching listings:', error)
    return []
  }
}

export async function getSites() {
  try {
    const sites = await prisma.site.findMany({
      orderBy: {
        name: 'asc',
      },
    })
    
    return sites.map((site: typeof sites[0]) => site.name)
  } catch (error) {
    console.error('Error fetching sites:', error)
    return []
  }
}

