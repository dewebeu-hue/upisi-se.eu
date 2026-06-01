export {
  getCanonicalQuestionPackKey,
  getQuestionPackByKey,
  questionPackOptions,
  questionPacks,
} from "./question-packs.ts";
export type {
  QuestionPack,
  QuestionPackKey,
  QuestionPack as QuestionPackOption,
} from "./question-packs.ts";

export const buttonVariants = [
  "primary",
  "secondary",
  "accent",
  "ghost",
  "danger",
] as const;
export const buttonSizes = ["sm", "md", "lg"] as const;
export const stickerVariants = ["pink", "blue", "yellow", "purple", "green"] as const;
export const statusTones = ["neutral", "pink", "blue", "yellow", "success"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type StickerVariant = (typeof stickerVariants)[number];
export type StatusTone = (typeof statusTones)[number];

export type CoverThemeKey =
  | "grid-notebook"
  | "pink-gel-pen"
  | "y2k-sparkle"
  | "spomenar"
  | "turbo-2002";

export type CoverPaperVariant = "grid" | "lined" | "plain";

export type CoverThemeOption = {
  key: CoverThemeKey;
  legacyKeys: readonly string[];
  label: string;
  name: string;
  emoji: string;
  description: string;
  paperVariant: CoverPaperVariant;
  accent: "blue" | "pink" | "purple" | "yellow" | "green";
  tone: StatusTone;
  sticker: string;
  stickerSet: readonly string[];
  accentClassName: string;
  coverClassName: string;
};

export const coverThemeOptions = [
  {
    key: "grid-notebook",
    legacyKeys: ["biljeznica-na-kockice"],
    label: "Bilježnica na kockice",
    name: "Bilježnica na kockice",
    emoji: "📓",
    description: "Klasični školski leksikon s urednim kockicama.",
    paperVariant: "grid",
    accent: "blue",
    tone: "blue",
    sticker: "📓",
    stickerSet: ["⭐", "✏️", "📓"],
    accentClassName:
      "border-[rgba(36,87,214,0.20)] bg-[rgba(36,87,214,0.08)]",
    coverClassName: "cover-theme-grid-notebook",
  },
  {
    key: "pink-gel-pen",
    legacyKeys: ["rozi-gel-pen"],
    label: "Rozi gel pen",
    name: "Rozi gel pen",
    emoji: "💖",
    description: "Rozi gel-pen sjaj, srce i mekši Y2K moment.",
    paperVariant: "lined",
    accent: "pink",
    tone: "pink",
    sticker: "💖",
    stickerSet: ["💖", "✨", "🌸"],
    accentClassName:
      "border-[rgba(224,68,157,0.22)] bg-[rgba(224,68,157,0.08)]",
    coverClassName: "cover-theme-pink-gel-pen",
  },
  {
    key: "y2k-sparkle",
    legacyKeys: ["y2k-sljokice"],
    label: "Y2K šljokice",
    name: "Y2K šljokice",
    emoji: "💿",
    description: "Ljubičasti sparkle, CD naljepnice i malo više showa.",
    paperVariant: "plain",
    accent: "purple",
    tone: "pink",
    sticker: "💿",
    stickerSet: ["💿", "✨", "⭐"],
    accentClassName:
      "border-[rgba(129,78,199,0.22)] bg-[rgba(129,78,199,0.08)]",
    coverClassName: "cover-theme-y2k-sparkle",
  },
  {
    key: "spomenar",
    legacyKeys: [],
    label: "Spomenar",
    name: "Spomenar",
    emoji: "🦋",
    description: "Pastelni papir, selotejp detalji i nježniji spomenar ton.",
    paperVariant: "lined",
    accent: "green",
    tone: "success",
    sticker: "🦋",
    stickerSet: ["🦋", "🌸", "💌"],
    accentClassName:
      "border-[rgba(9,139,104,0.20)] bg-[rgba(9,139,104,0.07)]",
    coverClassName: "cover-theme-spomenar",
  },
  {
    key: "turbo-2002",
    legacyKeys: [],
    label: "Turbo 2002",
    name: "Turbo 2002",
    emoji: "😎",
    description: "Glasniji party cover za najživlje WhatsApp grupe.",
    paperVariant: "grid",
    accent: "yellow",
    tone: "yellow",
    sticker: "😎",
    stickerSet: ["😎", "⚡", "💿"],
    accentClassName:
      "border-[rgba(151,116,0,0.24)] bg-[rgba(255,227,109,0.22)]",
    coverClassName: "cover-theme-turbo-2002",
  },
] as const satisfies readonly CoverThemeOption[];

export const DEFAULT_COVER_THEME_KEY: CoverThemeKey = "grid-notebook";
export const themeNames = coverThemeOptions.map((theme) => theme.label);
export const stickerOptions = [
  "✨",
  "💖",
  "⭐",
  "🦋",
  "📼",
  "💿",
  "🌈",
  "😎",
] as const;

function normalizeOptionValue(value: string): string {
  return value.trim().toLocaleLowerCase("hr-HR");
}

function findCoverTheme(value: string | undefined): CoverThemeOption | undefined {
  const normalized = normalizeOptionValue(value ?? "");

  if (!normalized) {
    return undefined;
  }

  return coverThemeOptions.find(
    (option) =>
      normalizeOptionValue(option.key) === normalized ||
      option.legacyKeys.some(
        (legacyKey) => normalizeOptionValue(legacyKey) === normalized,
      ) ||
      normalizeOptionValue(option.name) === normalized ||
      normalizeOptionValue(option.label) === normalized,
  );
}

export function getCoverThemeByKey(
  key: string | undefined,
): CoverThemeOption {
  return findCoverTheme(key) ?? coverThemeOptions[0];
}

export function getCoverThemeByValues(
  ...values: Array<string | undefined>
): CoverThemeOption {
  for (const value of values) {
    const theme = findCoverTheme(value);

    if (theme) {
      return theme;
    }
  }

  return coverThemeOptions[0];
}

export const getCoverThemeOption = getCoverThemeByKey;

export function getCanonicalCoverThemeKey(
  value: string,
): CoverThemeKey | undefined {
  return findCoverTheme(value)?.key;
}

export const stepLabels = [
  "Napravi leksikon",
  "Pošalji link frendicama",
  "Skupljaj upise",
  "Otključaj kviz",
] as const;

export const badgeText = {
  beta: "Beta verzija",
  noRegistration: "Bez registracije",
  free: "Besplatno",
  privateLinks: "Privatni linkovi",
  quizLocked: "0/5 upisa do kviza",
  inviteReady: "Javni link za dijeljenje",
} as const;

export const semanticToneDescriptions = {
  background: "Topla papirnata podloga koja nosi nostalgiju bez šuma.",
  paper: "Primarna površina za čitanje, forme i preview kartice.",
  ink: "Glavni tekst i rubovi s dovoljno kontrasta.",
  muted: "Pomoćni copy, metadata i sekundarne informacije.",
  primaryAction: "Žuti marker/gel-pen CTA za glavni sljedeći korak.",
  secondaryAction: "Bijela/papirnata akcija za istraživanje ili navigaciju.",
  danger: "Brisanje i destruktivne odluke.",
  success: "Spremljeno, upisano i pozitivni statusi.",
  decorativeAccent: "Jarke gel boje koje se koriste štedljivo.",
} as const;
