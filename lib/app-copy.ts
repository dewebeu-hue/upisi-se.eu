import { APP_NAME } from "@/lib/constants";

export const BETA_LABEL = "Beta verzija";

export const LANDING_COPY = {
  title: `${APP_NAME} ✨`,
  subtitle:
    "Digitalni leksikon kao iz osnovne — samo s kvizom, naljepnicama i malo srama iz 2000-ih.",
  primaryCta: "Napravi svoj leksikon",
  secondaryCta: "Vidi primjer pozivnice",
  support:
    "Bez registracije. Besplatno. Za tvoju ekipu iz osnovne, srednje, faksa ili života.",
  previewLabel: "Moj leksikon",
  previewSticker: "prvo pitanje",
  previewQuestion: "Najdraža pjesma iz školskog busa?",
  previewNote:
    "Napravi leksikon, pošalji link u WhatsApp/Viber grupu i skupljaj upise bez registracije.",
} as const;

export const EMPTY_STATE_COPY = {
  lexiconEntries:
    "Još nema upisa. Podijeli link u grupu i čekaj prve odgovore.",
  draftQuestions:
    "Pitanja se slažu kao stranice starog leksikona: kratko, nostalgično i bez pritiska.",
  privateAdmin:
    "Privatni pregled će se napuniti čim prijateljice počnu odgovarati.",
} as const;

export const SHARE_COPY = {
  invitePlaceholder:
    "Hej, napravila sam digitalni leksikon. Upiši se kad uhvatiš minutu.",
  whatsappLabel: "Podijeli u WhatsApp",
  viberLabel: "Podijeli u Viber",
  copyLinkLabel: "Kopiraj link",
} as const;

export const PLACEHOLDER_COPY = {
  workInProgress: "MVP flow",
  tokenRequired: "Ova ruta zahtijeva privatni token u URL-u.",
} as const;
