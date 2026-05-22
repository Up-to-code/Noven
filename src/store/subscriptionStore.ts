import { create } from "zustand";

import {
  initializeSubscriptions,
  isPremiumProfile,
  loadSubscriptionProducts,
  purchaseSubscription,
  refreshSubscriptionProfile,
  restoreSubscriptionPurchases,
  type SubscriptionPlacement,
  type SubscriptionProduct,
} from "@/services/subscriptionService";

type SubscriptionState = {
  isLoading: boolean;
  isPremium: boolean;
  lastError?: string;
  paywallProducts: SubscriptionProduct[];
  initialize: () => Promise<void>;
  loadPaywall: (placement: SubscriptionPlacement) => Promise<void>;
  purchase: (productId: string) => Promise<boolean>;
  refreshEntitlement: () => Promise<void>;
  restorePurchases: () => Promise<boolean>;
};

export const useSubscriptionStore = create<SubscriptionState>((set, get) => ({
  isLoading: false,
  isPremium: false,
  lastError: undefined,
  paywallProducts: [],
  initialize: async () => {
    set({ isLoading: true, lastError: undefined });
    try {
      await initializeSubscriptions();
      await get().refreshEntitlement();
    } catch (error) {
      set({ lastError: messageFromError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  loadPaywall: async (placement) => {
    set({ isLoading: true, lastError: undefined });
    try {
      const products = await loadSubscriptionProducts(placement);
      set({ paywallProducts: products });
    } catch (error) {
      set({ lastError: messageFromError(error) });
    } finally {
      set({ isLoading: false });
    }
  },
  purchase: async (productId) => {
    set({ isLoading: true, lastError: undefined });
    try {
      const profile = await purchaseSubscription(productId);
      if (!profile) {
        return false;
      }
      const isPremium = isPremiumProfile(profile);
      set({ isPremium });
      return isPremium;
    } catch (error) {
      set({ lastError: messageFromError(error) });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
  refreshEntitlement: async () => {
    try {
      const profile = await refreshSubscriptionProfile();
      set({ isPremium: isPremiumProfile(profile), lastError: undefined });
    } catch (error) {
      set({ lastError: messageFromError(error) });
    }
  },
  restorePurchases: async () => {
    set({ isLoading: true, lastError: undefined });
    try {
      const profile = await restoreSubscriptionPurchases();
      const isPremium = isPremiumProfile(profile);
      set({ isPremium });
      return isPremium;
    } catch (error) {
      set({ lastError: messageFromError(error) });
      return false;
    } finally {
      set({ isLoading: false });
    }
  },
}));

function messageFromError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  return "Subscription service is unavailable.";
}
