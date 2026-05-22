export const typography = {
  display: {
    fontFamily: "Playfair Display",
    fontSize: 40,
    lineHeight: 50,
    fontWeight: "400",
  },
  heading: {
    fontFamily: "Playfair Display",
    fontSize: 30,
    lineHeight: 40,
    fontWeight: "400",
  },
  body: {
    fontFamily: "Inter",
    fontSize: 16,
    lineHeight: 26,
    fontWeight: "400",
  },
  small: {
    fontFamily: "Inter",
    fontSize: 14,
    lineHeight: 22,
    fontWeight: "400",
  },
  caption: {
    fontFamily: "Inter",
    fontSize: 12,
    lineHeight: 16,
    fontWeight: "600",
    letterSpacing: 2,
  },
} as const;

export type TextVariant = keyof typeof typography;
