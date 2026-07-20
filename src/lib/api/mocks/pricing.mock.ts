import { discountApplies, round100 } from "@/lib/pricing";
import type { PricingService } from "../services/pricing.service";
import type { PriceQuote } from "../types";
import { allSizesData } from "./data/sizes.data";
import { productsData } from "./data/products.data";

const delay = (ms = 150) => new Promise((r) => setTimeout(r, ms));

export const pricingMock: PricingService = {
  async quote({ productSlug, sizeSlug, finishSlug }) {
    await delay();
    const product = productsData.find((p) => p.id === productSlug);
    const size = allSizesData[sizeSlug];
    if (!product || !size) return { price: 0 };

    const base = size.price + (finishSlug === "pintada" ? size.paintedAdd : 0);
    const d = product.discount;
    if (!discountApplies(d, sizeSlug, finishSlug)) return { price: base };

    const result: PriceQuote = { price: round100(base * (1 - d!.pct / 100)), was: base };
    return result;
  },
};
