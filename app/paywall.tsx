import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, CheckCircle2, Gem, LockKeyhole, Sparkle, X } from "lucide-react-native";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useResponsiveMetrics } from "@/hooks/useResponsiveMetrics";
import { useAppLocale } from "@/localization";
import { playFeedback } from "@/lib/feedback";
import { subscriptionProductIds, type SubscriptionPlacement, type SubscriptionProduct } from "@/services/subscriptionService";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const paywallIllustration = require("@/assets/illustrations/paywall-journey.png");

export default function PaywallScreen() {
  const { t } = useAppLocale();
  const metrics = useResponsiveMetrics({ horizontalPadding: spacing.screenHorizontal });
  const params = useLocalSearchParams<{ placement?: string; returnTo?: string }>();
  const placement = params.placement === "settings" ? "settings" : "onboarding";
  const returnTo = params.returnTo || "/(tabs)";
  const {
    isLoading,
    isPremium,
    lastError,
    loadPaywall,
    purchase,
    paywallProducts,
    restoreEntitlementIfNeeded,
    restorePurchases,
  } = useSubscriptionStore();
  const [selectedProductId, setSelectedProductId] = useState<string>(subscriptionProductIds.monthly);
  const heroHeight = metrics.scaleHeight(0.19, metrics.isCompact ? 142 : 158, metrics.isRoomy ? 210 : 184);
  const heroWidth = Math.min(metrics.width + (metrics.isCompact ? 4 : 14), 390);
  const planMetrics = useMemo(
    () => ({
      cardMinHeight: metrics.scaleHeight(0.072, 60, metrics.isRoomy ? 74 : 68),
      iconSize: metrics.scaleWidth(0.1, 36, 42),
      priceWidth: metrics.scaleWidth(0.26, 92, 118),
      titleSize: metrics.isCompact ? 15 : 16,
      priceSize: metrics.isCompact ? 18 : 20,
      horizontalPadding: metrics.isCompact ? 12 : 14,
      verticalPadding: metrics.isCompact ? 8 : 10,
    }),
    [metrics],
  );

  useEffect(() => {
    let isMounted = true;

    restoreEntitlementIfNeeded()
      .then((restored) => {
        if (isMounted && restored) {
          router.replace(returnTo);
          return;
        }

        if (isMounted) {
          loadPaywall(placement as SubscriptionPlacement).catch(console.error);
        }
      })
      .catch((error) => {
        console.error(error);
        if (isMounted) {
          loadPaywall(placement as SubscriptionPlacement).catch(console.error);
        }
      });

    return () => {
      isMounted = false;
    };
  }, [loadPaywall, placement, restoreEntitlementIfNeeded, returnTo]);

  useEffect(() => {
    if (isPremium) {
      router.replace(returnTo);
    }
  }, [isPremium, returnTo]);

  const products = useMemo(() => orderProducts(paywallProducts), [paywallProducts]);
  const selectedProduct = products.find((product) => product.id === selectedProductId) || products[0];

  const buy = async () => {
    if (!selectedProduct) {
      Alert.alert(t("paywall.productsUnavailableTitle"), t("paywall.productsUnavailableBody"));
      return;
    }

    const unlocked = await purchase(selectedProduct.id);
    if (unlocked) {
      router.replace(returnTo);
    }
  };

  const restore = async () => {
    const restored = await restorePurchases();
    Alert.alert(
      restored ? t("paywall.restoredTitle") : t("paywall.notRestoredTitle"),
      restored ? t("paywall.restoredBody") : t("paywall.notRestoredBody"),
    );

    if (restored) {
      router.replace(returnTo);
    }
  };

  return (
    <Screen topPadding={spacing.compact} contentStyle={{ gap: 10, paddingBottom: 14 }}>
      <View style={{ alignItems: "flex-end" }}>
        <Pressable
          accessibilityLabel={t("common.close")}
          hitSlop={10}
          onPress={() => {
            playFeedback("select");
            router.replace(returnTo);
          }}
          style={({ pressed }) => ({
            width: 44,
            height: 44,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.pill,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <X color={colors.foreground} size={22} strokeWidth={1.9} />
        </Pressable>
      </View>

      <View style={{ gap: 8 }}>
        <Text
          variant="display"
          style={{
            fontSize: metrics.isCompact ? 30 : 32,
            lineHeight: metrics.isCompact ? 35 : 38,
            maxWidth: 292,
          }}
        >
          {t("paywall.title")}
        </Text>
        <Text
          color="muted"
          variant="small"
          style={{
            fontSize: 14,
            lineHeight: 20,
            maxWidth: 286,
          }}
        >
          {t("paywall.subtitle")}
        </Text>
      </View>

      <View
        style={{
          alignItems: "center",
          height: heroHeight,
          justifyContent: "flex-end",
          marginHorizontal: -spacing.screenHorizontal,
          marginTop: -8,
          overflow: "hidden",
        }}
      >
        <Image
          contentFit="contain"
          source={paywallIllustration}
          style={{
            height: heroHeight + 20,
            width: heroWidth,
          }}
        />
      </View>

      <View style={{ gap: 8 }}>
        {products.map((product) => (
          <PlanOption
            key={product.id}
            product={product}
            selected={selectedProduct?.id === product.id}
            onPress={() => setSelectedProductId(product.id)}
            sizes={planMetrics}
          />
        ))}
      </View>

      <SubscriptionDetails selectedProduct={selectedProduct} />

      {lastError ? (
        <Text color="muted" variant="small" style={{ fontSize: 12, lineHeight: 17, textAlign: "center" }}>
          {lastError}
        </Text>
      ) : null}

      <View style={{ gap: 8, paddingTop: 4 }}>
        <Button
          disabled={!selectedProduct}
          label={t("common.continue")}
          loading={isLoading}
          onPress={buy}
          right={<ArrowRight color={colors.background} size={22} strokeWidth={1.8} />}
          style={{
            minHeight: 52,
            borderRadius: 14,
          }}
        />
        <View style={{ alignItems: "center", gap: 7 }}>
          <Pressable hitSlop={10} onPress={restore}>
            {({ pressed }) => (
              <Text
                color="muted"
                variant="small"
                style={{
                  fontSize: 11,
                  lineHeight: 15,
                  opacity: pressed ? 0.62 : 1,
                  textDecorationLine: "underline",
                }}
              >
                {t("paywall.restore")}
              </Text>
            )}
          </Pressable>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.smallGap }}>
            <LockKeyhole color={colors.softText} size={14} strokeWidth={1.8} />
            <Text color="muted" variant="small" style={{ fontSize: 11, lineHeight: 15 }}>
              {t("paywall.secure")}
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: 14 }}>
            <LegalLink label={t("common.terms")} href="/legal/terms" />
            <LegalLink label={t("common.privacy")} href="/legal/privacy" />
          </View>
        </View>
      </View>
    </Screen>
  );
}

function SubscriptionDetails({ selectedProduct }: { selectedProduct?: SubscriptionProduct }) {
  const { t } = useAppLocale();
  const details = [
    t("paywall.benefitUnlimited"),
    t("paywall.benefitPrompt"),
    t("paywall.benefitPatterns"),
    t("paywall.renewal", {
      period: selectedProduct ? readableBillingPeriod(selectedProduct.period, t) : t("paywall.selectedPlan"),
    }),
  ];

  return (
    <View
      style={{
        gap: 7,
        borderRadius: 14,
        borderCurve: "continuous",
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.surface,
        paddingHorizontal: 14,
        paddingVertical: 11,
      }}
    >
      <Text
        variant="caption"
        style={{
          color: colors.foreground,
          fontFamily: "Inter SemiBold",
        }}
      >
        {t("paywall.includesTitle").toUpperCase()}
      </Text>
      <View style={{ gap: 6 }}>
        {details.map((detail) => (
          <View key={detail} style={{ alignItems: "flex-start", flexDirection: "row", gap: 8 }}>
            <CheckCircle2 color={colors.foreground} size={15} strokeWidth={1.8} />
            <Text color="muted" variant="small" style={{ flex: 1, fontSize: 12, lineHeight: 17 }}>
              {detail}
            </Text>
          </View>
        ))}
      </View>
    </View>
  );
}

function PlanOption({
  onPress,
  product,
  selected,
  sizes,
}: {
  onPress: () => void;
  product: SubscriptionProduct;
  selected: boolean;
  sizes: {
    cardMinHeight: number;
    horizontalPadding: number;
    iconSize: number;
    priceSize: number;
    priceWidth: number;
    titleSize: number;
    verticalPadding: number;
  };
}) {
  const { t } = useAppLocale();
  const isMonthly = product.id === subscriptionProductIds.monthly || product.title.toLowerCase().includes("monthly");
  const Icon = isMonthly ? Sparkle : Gem;
  const periodLabel = normalizePeriod(product.period, t);

  return (
    <Pressable onPress={onPress}>
      {({ pressed }) => (
        <View
          style={{
            minHeight: sizes.cardMinHeight,
            borderRadius: 16,
            borderCurve: "continuous",
            borderWidth: selected ? 1.2 : 1,
            borderColor: selected ? "#F3B8BC" : colors.border,
            backgroundColor: colors.background,
            flexDirection: "row",
            alignItems: "center",
            gap: 10,
            opacity: pressed ? 0.78 : 1,
            paddingHorizontal: sizes.horizontalPadding,
            paddingVertical: sizes.verticalPadding,
          }}
        >
          <View
            style={{
              width: sizes.iconSize,
              height: sizes.iconSize,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: radius.pill,
              backgroundColor: selected ? "#FCE4E6" : colors.surface,
            }}
          >
            <Icon color={colors.foreground} size={20} strokeWidth={isMonthly ? 1.7 : 1.8} />
          </View>
          <View style={{ flex: 1, gap: 3 }}>
            <Text
              variant="body"
              style={{
                fontFamily: "Inter SemiBold",
                fontSize: sizes.titleSize,
                lineHeight: sizes.titleSize + 5,
              }}
            >
              {product.title}
            </Text>
          </View>
          <View style={{ alignItems: "flex-end", minWidth: sizes.priceWidth }}>
            <Text
              numberOfLines={1}
              adjustsFontSizeToFit
              variant="body"
              style={{
                fontFamily: "Inter SemiBold",
                fontSize: sizes.priceSize,
                lineHeight: sizes.priceSize + 5,
              }}
            >
              {product.price || "—"}
            </Text>
            <Text color="muted" variant="small" style={{ fontSize: 11, lineHeight: 16 }}>
              {periodLabel}
            </Text>
          </View>
        </View>
      )}
    </Pressable>
  );
}

function orderProducts(products: SubscriptionProduct[]) {
  return [...products].sort((a, b) => {
    const aMonthly = a.id === subscriptionProductIds.monthly || a.title.toLowerCase().includes("monthly");
    const bMonthly = b.id === subscriptionProductIds.monthly || b.title.toLowerCase().includes("monthly");
    return aMonthly === bMonthly ? 0 : aMonthly ? -1 : 1;
  });
}

function normalizePeriod(period: string, t: (key: string) => string) {
  const value = period.toLowerCase();
  if (value.includes("year") || value.includes("annual")) return t("paywall.perYear");
  if (value.includes("month")) return t("paywall.perMonth");
  return period;
}

function readableBillingPeriod(period: string, t: (key: string) => string) {
  const value = period.toLowerCase();
  if (value.includes("year") || value.includes("annual")) return t("paywall.yearlyBilling");
  if (value.includes("month")) return t("paywall.monthlyBilling");
  return period || t("paywall.selectedPlan");
}

function LegalLink({ href, label }: { href: string; label: string }) {
  return (
    <Pressable hitSlop={10} onPress={() => router.push(href)}>
      {({ pressed }) => (
        <Text
          variant="small"
          style={{
            color: colors.foreground,
            fontFamily: "Inter SemiBold",
            fontSize: 11,
            opacity: pressed ? 0.62 : 1,
            textDecorationLine: "underline",
          }}
        >
          {label}
        </Text>
      )}
    </Pressable>
  );
}
