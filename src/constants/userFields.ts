export const GENDER_VALUES = ["M", "F"] as const;
export type Gender = (typeof GENDER_VALUES)[number];

export const GENDER_OPTIONS: { value: Gender; labelKey: string }[] = [
  { value: "M", labelKey: "remitter.gender.male" },
  { value: "F", labelKey: "remitter.gender.female" },
];
