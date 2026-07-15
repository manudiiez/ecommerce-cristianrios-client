import { payloadPost } from "../payload/client";
import type { PriceQuote } from "../types";

export interface PricingQuoteInput {
  productSlug: string;
  sizeSlug: string;
  finishSlug: string;
}

export interface PricingService {
  quote(input: PricingQuoteInput): Promise<PriceQuote>;
}

export const pricingService: PricingService = {
  async quote(input) {
    return payloadPost<PriceQuote>("/pricing/quote", input);
  },
};
