export const defaultAvatarId = "strategist";

export const avatarOptions = [
  { id: "strategist", label: "Strategist", source: require("@/assets/Avatars/IMG_7498 1.png") },
  { id: "observer", label: "Observer", source: require("@/assets/Avatars/IMG_7843 1.png") },
  { id: "builder", label: "Builder", source: require("@/assets/Avatars/IMG_7845 1.png") },
  { id: "dreamer", label: "Dreamer", source: require("@/assets/Avatars/IMG_7846 1.png") },
  { id: "custom", label: "Custom", source: require("@/assets/Avatars/IMG_7847 1.png") },
] as const;

export type AvatarId = (typeof avatarOptions)[number]["id"];

export function resolveAvatarId(value?: string): AvatarId {
  return avatarOptions.some((item) => item.id === value) ? (value as AvatarId) : defaultAvatarId;
}

export function getAvatarSource(value?: string) {
  const avatarId = resolveAvatarId(value);
  return avatarOptions.find((item) => item.id === avatarId)?.source ?? avatarOptions[0].source;
}
