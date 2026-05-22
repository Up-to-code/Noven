import { Button } from "@/components/ui/Button";
import { Text } from "@/components/ui/Text";
import { spacing } from "@/design/spacing";

type EmptyStateProps = {
  title: string;
  subtitle: string;
  primaryLabel: string;
  secondaryLabel?: string;
  onPrimaryPress?: () => void;
  onSecondaryPress?: () => void;
};

export function EmptyState({
  onPrimaryPress,
  onSecondaryPress,
  primaryLabel,
  secondaryLabel,
  subtitle,
  title,
}: EmptyStateProps) {
  return (
    <>
      <Text variant="heading">
        {title}
      </Text>
      <Text variant="body" color="muted">
        {subtitle}
      </Text>
      <Button label={primaryLabel} onPress={onPrimaryPress} style={{ marginTop: spacing.componentGap }} />
      {secondaryLabel ? (
        <Button
          label={secondaryLabel}
          onPress={onSecondaryPress}
          variant="secondary"
          style={{ marginTop: spacing.smallGap }}
        />
      ) : null}
    </>
  );
}
