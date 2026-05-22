const analystTypes = ["INTJ", "INTP", "ENTJ", "ENTP"];
const diplomatTypes = ["INFJ", "INFP", "ENFJ", "ENFP"];
const sentinelTypes = ["ISTJ", "ISFJ", "ESTJ", "ESFJ"];
const explorerTypes = ["ISTP", "ISFP", "ESTP", "ESFP"];

export function firstName(name?: string) {
  return name?.trim().split(/\s+/)[0] || "";
}

export function namePrefix(name?: string) {
  const resolvedName = firstName(name);
  return resolvedName ? `${resolvedName}, ` : "";
}

export function typeFamily(type?: string) {
  if (!type || type === "Unknown") return "personal";
  if (analystTypes.includes(type)) return "strategic";
  if (diplomatTypes.includes(type)) return "reflective";
  if (sentinelTypes.includes(type)) return "structured";
  if (explorerTypes.includes(type)) return "adaptive";
  return "personal";
}

export function focusPrompt(name?: string) {
  return `${namePrefix(name)}what should your system support first?`;
}

export function aboutSubtitle(type?: string, focus?: string) {
  const family = typeFamily(type);
  const focusText = focus ? ` around ${focus.toLowerCase()}` : "";
  return `A calm ${family} system shaped${focusText}.`;
}

export function futureTitle(name?: string) {
  const resolvedName = firstName(name);
  return resolvedName ? `${resolvedName}, your system.` : "Your system.";
}

export function homeInsight(type?: string, focus?: string) {
  const family = typeFamily(type);
  if (focus) return `${family} rhythm · ${focus}`;
  return `${family} rhythm · Protect what matters.`;
}
