export type MbtiType =
  | "INTJ"
  | "INTP"
  | "ENTJ"
  | "ENTP"
  | "INFJ"
  | "INFP"
  | "ENFJ"
  | "ENFP"
  | "ISTJ"
  | "ISFJ"
  | "ESTJ"
  | "ESFJ"
  | "ISTP"
  | "ISFP"
  | "ESTP"
  | "ESFP";

export type UserProfile = {
  avatarId?: string;
  id: string;
  name: string;
  mbti?: MbtiType | string;
  focusGoal?: string;
  createdAt: string;
  updatedAt: string;
};
