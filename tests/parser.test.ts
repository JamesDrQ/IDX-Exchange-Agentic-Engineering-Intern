import { describe, expect, it } from "vitest";
import { parsePropertyQuery } from "../src/parser.js";

describe("parsePropertyQuery", () => {
    it("returns empty filters for an empty query", () => {
        expect(parsePropertyQuery("")).toEqual({
            city: null,
            maxPrice: null,
            beds: null,
            baths: null,
            sqft: null,
            type: null,
            pool: null,
            hasView: null,
            maxHOA: null,
        });
    });

    it("parses number of bedrooms", () => {
        expect(parsePropertyQuery("Show me 3-bedroom homes")).toMatchObject({
            beds: 3,
        });
    
        expect(parsePropertyQuery("I want 4 bedrooms")).toMatchObject({
            beds: 4,
        });

        expect(parsePropertyQuery("Find 2 beds near downtown")).toMatchObject({
            beds: 2,
        });

        expect(parsePropertyQuery("Looking for a 5-bed house")).toMatchObject({
            beds: 5,
        });
    });

    it("parses number of bathrooms", () => {
        expect(parsePropertyQuery("Show me homes with 2 bathrooms")).toMatchObject({
            baths: 2,
        });
    });

    it("parses maximum price", () => {
        expect(parsePropertyQuery("Show me homes under $1.5M")).toMatchObject({
            maxPrice: 1500000,
        });
    });

    it("parses minimum square footage", () => {
        expect(parsePropertyQuery("Show me homes with at least 1800 sqft")).toMatchObject({
            sqft: 1800,
        });
    });

    it("parses property type", () => {
        expect(parsePropertyQuery("Show me condos in Irvine")).toMatchObject({
            type: "Condominium",
        });
    });

    it("parses pool requirement", () => {
        expect(parsePropertyQuery("Show me homes with a pool")).toMatchObject({
            pool: true,
        });
    });

    it("parses view requirement", () => {
        expect(parsePropertyQuery("Show me homes with a view")).toMatchObject({
            hasView: true,
        });
    });

    it("parses maximum HOA fee", () => {
        expect(parsePropertyQuery("Show me condos with HOA under $500")).toMatchObject({
            maxHOA: 500,
        });
    });

    it("parses city", () => {
        expect(parsePropertyQuery("Show me condos in Irvine")).toMatchObject({
            city: "Irvine",
        });
    });

    it("parses a complete property search query", () => {
        expect(
            parsePropertyQuery(
                "Show me 3-bedroom condos in Irvine under $1.5M with a pool"
            )
        ).toEqual({
            city: "Irvine",
            maxPrice: 1500000,
            beds: 3,
            baths: null,
            sqft: null,
            type: "Condominium",
            pool: true,
            hasView: null,
            maxHOA: null,
        });
    });

    it.each([
        [
            "Show me 3-bedroom condos in Irvine under $1.5M with a pool",
            {
                city: "Irvine",
                beds: 3,
                maxPrice: 1500000,
                type: "Condominium",
                pool: true,
            },
        ],
        [
            "Find 4 bedroom homes in San Diego under $900k",
            {
                city: "San Diego",
                beds: 4,
                maxPrice: 900000,
            },
        ],
        [
            "I want a 2-bed condo in Los Angeles below $750,000",
            {
                city: "Los Angeles",
                beds: 2,
                maxPrice: 750000,
                type: "Condominium",
            },
        ],
        [
            "Show me homes in San Jose with 2.5 bathrooms",
            {
                city: "San Jose",
                baths: 2.5,
            },
        ],
        [
            "Find homes in Palm Springs with at least 2000 sqft",
            {
                city: "Palm Springs",
                sqft: 2000,
            },
        ],
        [
            "Show me townhouses in Riverside with a pool",
            {
                city: "Riverside",
                type: "Townhouse",
                pool: true,
            },
        ],
        [
            "Find single family homes in Temecula with a view",
            {
                city: "Temecula",
                type: "SingleFamilyResidence",
                hasView: true,
            },
        ],
        [
            "Show me land in Lancaster under $500k",
            {
                city: "Lancaster",
                 type: "UnimprovedLand",
                maxPrice: 500000,
            },
        ],
        [
            "Find 5-bedroom homes in Oakland with 3 bathrooms",
            {
                city: "Oakland",
                beds: 5,
                baths: 3,
            },
        ],
        [
            "Show me condos in Irvine with HOA under $500",
            {
                city: "Irvine",
                type: "Condominium",
                maxHOA: 500,
                maxPrice: null,
            },
        ],
    ])("parses query: %s", (query, expected) => {
        expect(parsePropertyQuery(query)).toMatchObject(expected);
    });
});