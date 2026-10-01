import { storeConfig } from "../config/store";

export function formatPrice(price: number): string {
  return `${storeConfig.currencySymbol} ${price.toLocaleString("en-IN")}`;
}

export function formatPriceWithCurrency(price: number): string {
  return formatPrice(price);
}
