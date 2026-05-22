import { useEffect, useMemo, useState } from "react";
import { Alert, Pressable, View } from "react-native";
import { Image } from "expo-image";
import { router, useLocalSearchParams } from "expo-router";
import { ArrowRight, ChevronLeft, Gem, LockKeyhole, Sparkle } from "lucide-react-native";

import { Button } from "@/components/ui/Button";
import { Screen } from "@/components/ui/Screen";
import { Text } from "@/components/ui/Text";
import { colors } from "@/design/colors";
import { radius } from "@/design/radius";
import { spacing } from "@/design/spacing";
import { useResponsiveMetrics } from "@/hooks/useResponsiveMetrics";
import { playFeedback } from "@/lib/feedback";
import { subscriptionProductIds, type SubscriptionPlacement, type SubscriptionProduct } from "@/services/subscriptionService";
import { useSubscriptionStore } from "@/store/subscriptionStore";

const paywallIllustration = require("@/assets/illustrations/paywall-journey.png");

export default function PaywallScreen() {
  const metrics = useResponsiveMetrics({ horizontalPadding: spacing.screenHorizontal });
  const params = useLocalSearchParams<{ placement?: string; returnTo?: string }>();
  const placement = params.placement === "settings" ? "settings" : "onboarding";
  const returnTo = params.returnTo || "/(tabs)";
  const { isLoading, lastError, loadPaywall, purchase, paywallProducts, restorePurchases } = useSubscriptionStore();
  const [selectedProductId, setSelectedProductId] = useState<string>(subscriptionProductIds.monthly);
  const heroHeight = metrics.scaleHeight(0.31, metrics.isCompact ? 218 : 238, metrics.isRoomy ? 330 : 306);
  const heroWidth = Math.min(metrics.width + (metrics.isCompact ? 8 : 24), 430);
  const planMetrics = useMemo(
    () => ({
      cardMinHeight: metrics.scaleHeight(0.082, 68, metrics.isRoomy ? 82 : 76),
      iconSize: metrics.scaleWidth(0.118, 42, 48),
      priceWidth: metrics.scaleWidth(0.2, 70, 86),
      titleSize: metrics.isCompact ? 16 : 17,
      priceSize: metrics.isCompact ? 20 : 22,
      horizontalPadding: metrics.isCompact ? 12 : 14,
      verticalPadding: metrics.isCompact ? 10 : 12,
    }),
    [metrics],
  );

  useEffect(() => {
    loadPaywall(placement as SubscriptionPlacement).catch(console.error);
  }, [loadPaywall, placement]);

  const products = useMemo(() => orderProducts(paywallProducts), [paywallProducts]);
  const selectedProduct = products.find((product) => product.id === selectedProductId) || products[0];

  const buy = async () => {
    if (!selectedProduct) {
      Alert.alert("Products unavailable", "Try again in a moment, or continue without Premium for now.");
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
      restored ? "Premium restored" : "Nothing to restore",
      restored ? "Noven Premium is active." : "No active Premium purchase was found for this Apple ID.",
    );
  };

  return (
    <Screen topPadding={spacing.smallGap} contentStyle={{ gap: spacing.componentGap, paddingBottom: 18 }}>
      <View style={{ alignItems: "flex-start" }}>
        <Pressable
          hitSlop={8}
          onPress={() => {
            playFeedback("select");
            router.canGoBack() ? router.back() : router.replace(returnTo);
          }}
          style={({ pressed }) => ({
            width: 42,
            height: 42,
            alignItems: "center",
            justifyContent: "center",
            borderRadius: radius.pill,
            backgroundColor: colors.surface,
            opacity: pressed ? 0.72 : 1,
          })}
        >
          <ChevronLeft color={colors.foreground} size={22} strokeWidth={1.9} />
        </Pressable>
      </View>

      <View style={{ gap: 10 }}>
        <Text
          variant="display"
          style={{
            fontSize: 34,
            lineHeight: 40,
            maxWidth: 280,
          }}
        >
          Upgrade{"\n"}your journey.
        </Text>
        <Text
          color="muted"
          variant="small"
          style={{
            fontSize: 15,
            lineHeight: 22,
            maxWidth: 245,
          }}
        >
          Unlock more features and build the life you designed.
        </Text>
      </View>

      <View
        style={{
          alignItems: "center",
          height: heroHeight,
          justifyContent: "flex-end",
          marginHorizontal: -spacing.screenHorizontal,
          marginTop: -4,
          overflow: "hidden",
        }}
      >
        <Image
          contentFit="contain"
          source={paywallIllustration}
          style={{
            height: heroHeight + 30,
            width: heroWidth,
          }}
        />
      </View>

      <View style={{ gap: 10 }}>
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

      {lastError ? (
        <Text color="muted" variant="small" style={{ fontSize: 12, lineHeight: 17, textAlign: "center" }}>
          {lastError}
        </Text>
      ) : null}

      <View style={{ gap: 12, paddingTop: 8 }}>
        <Button
          label="Continue"
          loading={isLoading}
          onPress={buy}
          right={<ArrowRight color={colors.background} size={22} strokeWidth={1.8} />}
          style={{
            minHeight: 56,
            borderRadius: 14,
          }}
        />
        <View style={{ alignItems: "center", gap: 10 }}>
          <Pressable hitSlop={10} onPress={restore}>
            {({ pressed }) => (
              <Text
                color="muted"
                variant="small"
                style={{
                  fontSize: 12,
                  lineHeight: 16,
                  opacity: pressed ? 0.62 : 1,
                  textDecorationLine: "underline",
                }}
              >
                Restore purchases
              </Text>
            )}
          </Pressable>
          <View style={{ alignItems: "center", flexDirection: "row", gap: spacing.smallGap }}>
            <LockKeyhole color={colors.softText} size={14} strokeWidth={1.8} />
            <Text color="muted" variant="small" style={{ fontSize: 12, lineHeight: 16 }}>
              Secure payment. Cancel anytime.
            </Text>
          </View>
          <View style={{ flexDirection: "row", gap: spacing.componentGap }}>
            <LegalLink label="Terms" href="/legal/terms" />
            <LegalLink label="Privacy" href="/legal/privacy" />
          </View>
        </View>
      </View>
    </Screen>
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
  const isMonthly = product.id === subscriptionProductIds.monthly || product.title.toLowerCase().includes("monthly");
  const Icon = isMonthly ? Sparkle : Gem;
  const periodLabel = normalizePeriod(product.period);

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
            gap: 14,
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
            <Icon color={colors.foreground} size={24} strokeWidth={isMonthly ? 1.7 : 1.8} />
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
              variant="body"
              style={{
                fontFamily: "Inter SemiBold",
                fontSize: sizes.priceSize,
                lineHeight: sizes.priceSize + 5,
              }}
            >
              {product.price}
            </Text>
            <Text color="muted" variant="small" style={{ fontSize: 12, lineHeight: 18 }}>
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

function normalizePeriod(period: string) {
  const value = period.toLowerCase();
  if (value.includes("year") || value.includes("annual")) return "/ year";
  if (value.includes("month")) return "/ month";
  return period;
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
            fontSize: 12,
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
