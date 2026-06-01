export const themeNames = [
  "Bilježnica na kockice",
  "Rozi gel pen",
  "Y2K šljokice",
  "Spomenar",
  "Turbo 2002",
] as const;

export const stickerOptions = ["✨", "💖", "⭐", "🦋", "📼", "💿", "🌈", "😎"] as const;

export const coverThemeOptions = [
  {
    key: "grid-notebook",
    legacyKeys: ["biljeznica-na-kockice"],
    label: "Bilježnica na kockice",
    name: "Bilježnica na kockice",
    description: "Čista školska podloga za ekipe koje žele klasični leksikon.",
    emoji: "✨",
    accent: "blue",
    sticker: "✨",
  },
  {
    key: "pink-gel-pen",
    legacyKeys: ["rozi-gel-pen"],
    label: "Rozi gel pen",
    name: "Rozi gel pen",
    description: "Topao, ženstven naglasak s malo 2000-ih sjaja.",
    emoji: "💖",
    accent: "pink",
    sticker: "💖",
  },
  {
    key: "y2k-sparkle",
    legacyKeys: ["y2k-sljokice"],
    label: "Y2K šljokice",
    name: "Y2K šljokice",
    description: "Razigraniji cover za ekipu koja želi nostalgični show.",
    emoji: "💿",
    accent: "purple",
    sticker: "💿",
  },
  {
    key: "spomenar",
    legacyKeys: [],
    label: "Spomenar",
    name: "Spomenar",
    description: "Mekši, papirnati osjećaj za osobnije upise.",
    emoji: "🦋",
    accent: "green",
    sticker: "🦋",
  },
  {
    key: "turbo-2002",
    legacyKeys: [],
    label: "Turbo 2002",
    name: "Turbo 2002",
    description: "Energičan cover za najglasnije WhatsApp grupe.",
    emoji: "😎",
    accent: "yellow",
    sticker: "😎",
  },
] as const;

export const questionPackOptions = [
  {
    key: "osnovna-1998",
    name: "Osnovna 1998.",
    description: "Za ekipu iz razreda, prve simpatije i školske fore.",
  },
  {
    key: "srednja-2004",
    name: "Srednja 2004.",
    description: "Za MSN statuse, CD-e i izlaske koji su postali mit.",
  },
  {
    key: "reunion",
    name: "Reunion ekipa",
    description: "Za ponovno okupljanje ljudi koji se znaju sto godina.",
  },
  {
    key: "djevojacka",
    name: "Djevojačka / rođendan",
    description: "Za slavlje, interne šale i malo nježne drame.",
  },
] as const;

export type CoverThemeOption = (typeof coverThemeOptions)[number];
export type CoverThemeKey = CoverThemeOption["key"];
export type QuestionPackOption = (typeof questionPackOptions)[number];
export type QuestionPackKey = QuestionPackOption["key"];

function normalizeOptionValue(value: string): string {
  return value.trim();
}

export function getCoverThemeOption(
  value: string | undefined,
): CoverThemeOption {
  const normalized = normalizeOptionValue(value ?? "");

  return (
    coverThemeOptions.find(
      (option) =>
        option.key === normalized ||
        (option.legacyKeys as readonly string[]).includes(normalized) ||
        option.name === normalized ||
        option.label === normalized,
    ) ?? coverThemeOptions[0]
  );
}

export function getCanonicalCoverThemeKey(
  value: string,
): CoverThemeKey | undefined {
  const normalized = normalizeOptionValue(value);
  const option = coverThemeOptions.find(
    (item) =>
      item.key === normalized ||
      (item.legacyKeys as readonly string[]).includes(normalized) ||
      item.name === normalized ||
      item.label === normalized,
  );

  return option?.key;
}

export function getCanonicalQuestionPackKey(
  value: string,
): QuestionPackKey | undefined {
  const normalized = normalizeOptionValue(value);
  const option = questionPackOptions.find(
    (item) => item.key === normalized || item.name === normalized,
  );

  return option?.key;
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

export const buttonVariants = ["primary", "secondary", "ghost", "danger"] as const;
export const buttonSizes = ["sm", "md", "lg"] as const;
export const stickerVariants = ["pink", "blue", "yellow", "purple", "green"] as const;
export const statusTones = ["neutral", "pink", "blue", "yellow", "success"] as const;

export type ButtonVariant = (typeof buttonVariants)[number];
export type ButtonSize = (typeof buttonSizes)[number];
export type StickerVariant = (typeof stickerVariants)[number];
export type StatusTone = (typeof statusTones)[number];

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
