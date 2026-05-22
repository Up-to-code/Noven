import { adapty, LogLevel } from "react-native-adapty";
import type { AdaptyPaywallProduct, AdaptyProfile } from "react-native-adapty";

export const premiumAccessLevelId = "premium";
export const subscriptionPlacements = {
  onboarding: "onboarding",
  settings: "settings",
} as const;

export const subscriptionProductIds = {
  monthly: "com.ahmedss7.noven.premium.monthly",
  annual: "com.ahmedss7.noven.premium.annual",
} as const;

export type SubscriptionPlacement = keyof typeof subscriptionPlacements;

export type SubscriptionProduct = {
  id: string;
  title: string;
  description: string;
  price: string;
  period: string;
  product: AdaptyPaywallProduct | null;
};

let activationPromise: Promise<void> | null = null;
let cachedProducts: SubscriptionProduct[] = [];

const fallbackProducts: SubscriptionProduct[] = [
  {
    id: subscriptionProductIds.annual,
    title: "Annual",
    description: "A quieter yearly system for deeper patterns.",
    price: "$39.99",
    period: "year",
    product: null,
  },
  {
    id: subscriptionProductIds.monthly,
    title: "Monthly",
    description: "Start premium month by month.",
    price: "$4.99",
    period: "month",
    product: null,
  },
];

export function isPremiumProfile(profile?: AdaptyProfile | null) {
  return profile?.accessLevels?.[premiumAccessLevelId]?.isActive === true;
}

export async function initializeSubscriptions() {
  if (!activationPromise) {
    activationPromise = activateAdapty();
  }

  await activationPromise;
}

export async function refreshSubscriptionProfile() {
  await initializeSubscriptions();
  return adapty.getProfile();
}

export async function loadSubscriptionProducts(placement: SubscriptionPlacement) {
  await initializeSubscriptions();

  try {
    const paywall = await adapty.getPaywall(subscriptionPlacements[placement]);
    const products = await adapty.getPaywallProducts(paywall);
    cachedProducts = normalizeProducts(products);
    return cachedProducts;
  } catch (error) {
    console.warn("Unable to load Adapty paywall products", error);
    cachedProducts = fallbackProducts;
    return fallbackProducts;
  }
}

export async function purchaseSubscription(productId: string) {
  await initializeSubscriptions();
  const selected = cachedProducts.find((product) => product.id === productId);

  if (!selected?.product) {
    return refreshSubscriptionProfile();
  }

  const result = await adapty.makePurchase(selected.product);
  if (result.type === "success") {
    return result.profile;
  }

  return null;
}

export async function restoreSubscriptionPurchases() {
  await initializeSubscriptions();
  return adapty.restorePurchases();
}

async function activateAdapty() {
  const apiKey = process.env.EXPO_PUBLIC_ADAPTY_SDK_KEY;
  const enableMock = !apiKey;

  await adapty.activate(apiKey || "noven_mock_adapty_key", {
    __ignoreActivationOnFastRefresh: true,
    enableMock,
    logLevel: __DEV__ ? LogLevel.WARN : LogLevel.ERROR,
    mockConfig: enableMock
      ? {
          autoGrantPremium: true,
          premiumAccessLevelId,
        }
      : undefined,
  });
}

function normalizeProducts(products: AdaptyPaywallProduct[]): SubscriptionProduct[] {
  const mapped = products.map((product) => {
    const title = normalizeTitle(product);
    return {
      id: normalizeProductId(product),
      title,
      description: product.localizedDescription || `${title} access to Noven Premium.`,
      price: product.price?.localizedString || fallbackPrice(title),
      period: product.subscription?.localizedSubscriptionPeriod || fallbackPeriod(title),
      product,
    };
  });

  return mapped.sort((a, b) => (a.title.includes("Annual") ? -1 : b.title.includes("Annual") ? 1 : 0));
}

function normalizeProductId(product: AdaptyPaywallProduct) {
  if (product.localizedTitle.toLowerCase().includes("annual") || product.vendorProductId.includes("annual")) {
    return subscriptionProductIds.annual;
  }

  if (product.localizedTitle.toLowerCase().includes("monthly") || product.vendorProductId.includes("monthly")) {
    return subscriptionProductIds.monthly;
  }

  return product.vendorProductId;
}

function normalizeTitle(product: AdaptyPaywallProduct) {
  if (product.localizedTitle.toLowerCase().includes("annual") || product.vendorProductId.includes("annual")) {
    return "Annual";
  }

  if (product.localizedTitle.toLowerCase().includes("monthly") || product.vendorProductId.includes("monthly")) {
    return "Monthly";
  }

  return product.localizedTitle || "Premium";
}

function fallbackPeriod(title: string) {
  return title.includes("Annual") ? "year" : "month";
}

function fallbackPrice(title: string) {
  return title.includes("Annual") ? "$39.99" : "$4.99";
}
