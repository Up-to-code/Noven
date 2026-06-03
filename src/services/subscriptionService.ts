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

export function subscribeToSubscriptionProfileUpdates(onProfile: (profile: AdaptyProfile) => void) {
  return adapty.addEventListener("onLatestProfileLoad", onProfile);
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
    cachedProducts = [];
    return cachedProducts;
  }
}

export async function purchaseSubscription(productId: string) {
  await initializeSubscriptions();

  const currentProfile = await refreshSubscriptionProfile();
  if (isPremiumProfile(currentProfile)) {
    return currentProfile;
  }

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

export async function ensureRestoredPremiumProfile() {
  await initializeSubscriptions();
  const profile = await refreshSubscriptionProfile();

  if (isPremiumProfile(profile)) {
    return profile;
  }

  return adapty.restorePurchases();
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
      price: product.price?.localizedString || "",
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
    return "Noven Premium Annual";
  }

  if (product.localizedTitle.toLowerCase().includes("monthly") || product.vendorProductId.includes("monthly")) {
    return "Noven Premium Monthly";
  }

  return product.localizedTitle || "Premium";
}

function fallbackPeriod(title: string) {
  return title.includes("Annual") ? "year" : "month";
}
