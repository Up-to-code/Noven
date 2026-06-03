export const defaultAvatarId = "strategist";

export const avatarOptions = [
  { id: "strategist", label: "Strategist", source: require("../assets/Avatars/strategist.png") },
  { id: "observer", label: "Observer", source: require("../assets/Avatars/observer.png") },
  { id: "builder", label: "Builder", source: require("../assets/Avatars/builder.png") },
  { id: "dreamer", label: "Dreamer", source: require("../assets/Avatars/dreamer.png") },
  { id: "custom", label: "Custom", source: require("../assets/Avatars/custom.png") },
] as const;

export type AvatarId = (typeof avatarOptions)[number]["id"];

export function resolveAvatarId(value?: string): AvatarId {
  return avatarOptions.some((item) => item.id === value) ? (value as AvatarId) : defaultAvatarId;
}

export function getAvatarSource(value?: string) {
  const avatarId = resolveAvatarId(value);
  return avatarOptions.find((item) => item.id === avatarId)?.source ?? avatarOptions[0].source;
}
