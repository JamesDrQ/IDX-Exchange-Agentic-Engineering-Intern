export interface PropertyFilters {
    city: string | null;
    maxPrice: number | null;
    beds: number | null;
    baths: number | null;
    sqft: number | null;
    type: string | null;
    pool: boolean | null;
    hasView: boolean | null;
    maxHOA: number | null;
}

export function parsePropertyQuery(query: string): PropertyFilters {
    const bedsMatch = query.match(
        /(\d+)[\s-]*(bed|beds|bedroom|bedrooms)/i
    );
    const bathsMatch = query.match(
        /(\d+(?:\.\d+)?)[\s-]*(bath|baths|bathroom|bathrooms)/i
    );
    const hoaMatch = query.match(
        /hoa(?: fee)?\s*(?:under|below|max(?:imum)?(?: of)?)?\s*\$?([\d,]+)/i
    );
    const queryWithoutHoa = hoaMatch
        ? query.replace(hoaMatch[0], "")
        : query;
    const priceMatch = queryWithoutHoa.match(
        /(?:under|below|max(?:imum)?(?: price)?(?: of)?)[\s$]*([\d,.]+)\s*([km]?)/i
    );
    const sqftMatch = query.match(
        /(\d[\d,]*)\s*(sqft|sq ft|square feet)/i
    );
    const typeMap: Record<string, string> = {
        condo: "Condominium",
        condos: "Condominium",
        townhouse: "Townhouse",
        townhome: "Townhouse",
        "single family": "SingleFamilyResidence",
        land: "UnimprovedLand",
    };
    const typeKey = Object.keys(typeMap).find((key) =>
        query.toLowerCase().includes(key)
    );
    const propertyType = typeKey ? typeMap[typeKey] ?? null : null;
    const hasPool = /\bpool\b/i.test(query);
    const hasView = /\bview\b/i.test(query);
    const maxHOA = hoaMatch ? Number(hoaMatch[1]?.replace(/,/g, "")) : null;
    const supportedCities = [
        "Irvine",
        "San Diego",
        "Los Angeles",
         "San Jose",
         "Palm Desert",
         "Palm Springs",
         "Long Beach",
         "Indio",
         "Oakland",
         "Riverside",
         "La Quinta",
         "Lake Arrowhead",
        "Murrieta",
         "Hemet",
         "Corona",
         "Temecula",
         "Victorville",
         "Lancaster",
         "Menifee",
         "Rancho Mirage",
         "Palmdale",
    ];

    const city =
        supportedCities.find((city) =>
            query.toLowerCase().includes(city.toLowerCase())
        ) ?? null;

    let maxPrice: number | null = null;
    if (priceMatch) {
        const amountText = priceMatch[1];
        const suffix = priceMatch[2]?.toLowerCase() ?? "";
        if (amountText) {
            const amount = Number(amountText.replace(/,/g, ""));
            if (suffix === "m") {
                maxPrice = amount * 1_000_000;
            } else if (suffix === "k") {
                maxPrice = amount * 1_000;
            } else {
                maxPrice = amount;
            }
        }
    }

    return {
        city,
        maxPrice,
        beds: bedsMatch ? Number(bedsMatch[1]) : null,
        baths: bathsMatch ? Number(bathsMatch[1]) : null,
        sqft: sqftMatch ? Number(sqftMatch[1]?.replace(/,/g, "")) : null,
        type: propertyType,
        pool: hasPool ? true : null,
        hasView: hasView ? true : null,
        maxHOA,
    };
}