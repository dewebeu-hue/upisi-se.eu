import {
  LONG_ANSWER_MAX_LENGTH,
  SHORT_ANSWER_MAX_LENGTH,
} from "./limits.ts";

export type QuestionPackKey =
  | "osnovna-1998"
  | "srednja-2004"
  | "reunion"
  | "djevojacka";

export type EntryQuestionType = "shortText" | "longText" | "optionalSecret";

export type EntryQuestion = {
  id: string;
  label: string;
  helperText?: string;
  type: EntryQuestionType;
  required: boolean;
  isPrivate: boolean;
  quizEligible: boolean;
  maxLength: number;
};

export type QuestionPack = {
  key: QuestionPackKey;
  label: string;
  name: string;
  description: string;
  previewQuestions: readonly string[];
  baseQuestions: readonly EntryQuestion[];
  extraQuestions: readonly EntryQuestion[];
};

const shortQuestion = (
  id: string,
  label: string,
  helperText?: string,
  required = false,
): EntryQuestion => ({
  id,
  label,
  helperText,
  type: "shortText",
  required,
  isPrivate: false,
  quizEligible: true,
  maxLength: SHORT_ANSWER_MAX_LENGTH,
});

const longQuestion = (
  id: string,
  label: string,
  helperText?: string,
  required = false,
): EntryQuestion => ({
  id,
  label,
  helperText,
  type: "longText",
  required,
  isPrivate: false,
  quizEligible: true,
  maxLength: LONG_ANSWER_MAX_LENGTH,
});

const secretQuestion = (
  id: string,
  label: string,
  helperText = "Ovo pitanje je opcionalno i vidi ga samo vlasnica.",
): EntryQuestion => ({
  id,
  label,
  helperText,
  type: "optionalSecret",
  required: false,
  isPrivate: true,
  quizEligible: false,
  maxLength: SHORT_ANSWER_MAX_LENGTH,
});

export const questionPacks = [
  {
    key: "osnovna-1998",
    label: "Osnovna 1998.",
    name: "Osnovna 1998.",
    description: "Za ekipu iz razreda, prve simpatije i školske fore.",
    previewQuestions: [
      "Koja pjesma te odmah vrati u osnovnu?",
      "Što si kupovala za veliki odmor?",
      "Inicijali simpatije, ako želiš.",
    ],
    baseQuestions: [
      shortQuestion(
        "osnovna-favorite-song",
        "Koja pjesma te odmah vrati u osnovnu?",
        "Može hit s radija, CD-a, školskog plesa ili iz busa.",
        true,
      ),
      shortQuestion(
        "osnovna-school-snack",
        "Što si najčešće kupovala za veliki odmor?",
        "Pecivo, sok, čokoladica, sendvič, burek... sve ulazi u leksikon.",
        true,
      ),
      shortQuestion(
        "osnovna-crew-role",
        "Koja si bila u razredu/ekipi?",
        "Primjer: organizatorica, tiha legenda, kraljica zadaće, glavna za fore.",
        true,
      ),
      secretQuestion(
        "osnovna-secret-crush-initials",
        "Inicijali simpatije iz škole, ako želiš 😉",
      ),
      longQuestion(
        "osnovna-message",
        "Poruka za kraj kao u pravom leksikonu",
        "Napiši joj nešto kratko, toplo i malo nostalgično.",
        true,
      ),
    ],
    extraQuestions: [
      shortQuestion(
        "osnovna-favorite-teacher",
        "Najdraža učiteljica, učitelj ili predmet?",
      ),
      longQuestion(
        "osnovna-school-drama",
        "Najgora školska drama koja je danas smiješna?",
      ),
      shortQuestion(
        "osnovna-after-school-place",
        "Gdje ste se skupljali poslije škole?",
      ),
      shortQuestion("osnovna-inside-joke", "Najjača interna fora?"),
      shortQuestion(
        "osnovna-grown-up-dream",
        "Što si htjela biti kad odrasteš?",
      ),
      shortQuestion("osnovna-always-late", "Tko je uvijek kasnio?"),
      longQuestion(
        "osnovna-last-page",
        "Što bi napisala na zadnju stranicu leksikona?",
      ),
    ],
  },
  {
    key: "srednja-2004",
    label: "Srednja 2004.",
    name: "Srednja 2004.",
    description: "Za MSN statuse, CD-e i izlaske koji su postali mit.",
    previewQuestions: [
      "Koji bi ti bio MSN status?",
      "Gdje ste najčešće izlazili?",
      "Koji mobitel ili ringtone pamtiš?",
    ],
    baseQuestions: [
      shortQuestion(
        "srednja-msn-status",
        "Koji bi ti bio MSN status?",
        "Može dramatično, misteriozno ili potpuno cringe.",
        true,
      ),
      shortQuestion(
        "srednja-cd-song",
        "Koja pjesma/CD te odmah vrati u srednju?",
        "Album, mix CD, ringtone ili pjesma s izlaska.",
        true,
      ),
      shortQuestion(
        "srednja-going-out-place",
        "Gdje ste najčešće izlazili?",
        "Kafić, klupica, disko, park, busna stanica...",
        true,
      ),
      secretQuestion(
        "srednja-crush-initials",
        "Tko ti je bio crush, samo inicijali ako želiš 😉",
      ),
      longQuestion(
        "srednja-message",
        "Poruka za kraj",
        "Kao zadnja rečenica u pravom leksikonu, samo digitalno.",
        true,
      ),
    ],
    extraQuestions: [
      shortQuestion(
        "srednja-phone-ringtone",
        "Koji mobitel ili ringtone pamtiš?",
      ),
      shortQuestion(
        "srednja-outfit",
        "Najjači outfit iz tog vremena?",
      ),
      longQuestion(
        "srednja-funny-drama",
        "Najveća drama koja je danas smiješna?",
      ),
      shortQuestion(
        "srednja-gossip-person",
        "Tko je uvijek znao sve tračeve?",
      ),
      shortQuestion(
        "srednja-favorite-place",
        "Omiljeni kafić, klupica ili busna stanica?",
      ),
      longQuestion(
        "srednja-younger-self",
        "Što bi danas rekla toj verziji sebe?",
      ),
    ],
  },
  {
    key: "reunion",
    label: "Reunion ekipa",
    name: "Reunion ekipa",
    description: "Za ponovno okupljanje ljudi koji se znaju sto godina.",
    previewQuestions: [
      "Gdje si danas i što radiš?",
      "Što nitko ne bi pogodio o tebi?",
      "Koju pjesmu treba pustiti na reunionu?",
    ],
    baseQuestions: [
      longQuestion(
        "reunion-today",
        "Gdje si danas i što radiš?",
        "Kratko predstavljanje za ekipu koja te nije dugo vidjela.",
        true,
      ),
      longQuestion(
        "reunion-surprise",
        "Što nitko iz ekipe ne bi pogodio o tebi?",
        "Može biti posao, hobi, navika ili neočekivani obrat.",
        true,
      ),
      longQuestion(
        "reunion-memory",
        "Koja ti je najjača zajednička uspomena?",
        "Uspomena koja odmah vraća ekipu u isti film.",
        true,
      ),
      shortQuestion(
        "reunion-coffee",
        "Koga bi najradije opet vidjela na kavi?",
        "Može ime, nadimak ili cijela ekipa.",
        true,
      ),
      longQuestion(
        "reunion-message",
        "Poruka ekipi za reunion",
        "Jedna poruka da se svi malo raznježe ili nasmiju.",
        true,
      ),
    ],
    extraQuestions: [
      shortQuestion("reunion-changed-most", "Tko se najviše promijenio?"),
      shortQuestion("reunion-same-person", "Tko je ostao isti?"),
      longQuestion(
        "reunion-missing",
        "Što ti najviše fali iz tog vremena?",
      ),
      shortQuestion(
        "reunion-song",
        "Koju pjesmu treba pustiti na reunionu?",
      ),
      longQuestion(
        "reunion-story",
        "Najjači moment koji i danas prepričavaš?",
      ),
      longQuestion(
        "reunion-plan",
        "Što bi organizirala da se svi opet okupite?",
      ),
    ],
  },
  {
    key: "djevojacka",
    label: "Djevojačka / rođendan",
    name: "Djevojačka / rođendan",
    description: "Za slavlje, interne šale i malo nježne drame.",
    previewQuestions: [
      "Najdraža uspomena s njom?",
      "Koja pjesma mora svirati kad ona ulazi?",
      "Što joj želiš za sljedećih 10 godina?",
    ],
    baseQuestions: [
      longQuestion(
        "djevojacka-memory",
        "Najdraža uspomena s njom?",
        "Može biti divna, kaotična ili toliko interna da jedva stane u tekst.",
        true,
      ),
      shortQuestion(
        "djevojacka-red-flag",
        "Koji njen red flag joj svi opraštamo?",
        "Nježno, smiješno i bez ozbiljnog roastanja.",
        true,
      ),
      shortQuestion(
        "djevojacka-entrance-song",
        "Koja pjesma mora svirati kad ona ulazi?",
        "Pjesma za ulazak, tortu, ples ili veliki trenutak.",
        true,
      ),
      longQuestion(
        "djevojacka-next-10-years",
        "Što joj želiš za sljedećih 10 godina?",
        "Malo leksikon, malo zdravica.",
        true,
      ),
      longQuestion(
        "djevojacka-message",
        "Poruka za slavljenicu/mladenku",
        "Napiši joj nešto što će htjeti spremiti.",
        true,
      ),
    ],
    extraQuestions: [
      longQuestion("djevojacka-night-out", "Najjači izlazak s njom?"),
      longQuestion(
        "djevojacka-funny-advice",
        "Najgori ili najsmješniji savjet koji joj možeš dati?",
      ),
      shortQuestion(
        "djevojacka-party-prediction",
        "Što će ona sigurno napraviti na zabavi?",
      ),
      longQuestion(
        "djevojacka-loved-for",
        "Po čemu je ekipa najviše voli?",
      ),
      secretQuestion(
        "djevojacka-secret-note",
        "Tajna poruka samo za nju",
      ),
      shortQuestion(
        "djevojacka-inside-line",
        "Jedna rečenica koju samo vi razumijete?",
      ),
    ],
  },
] as const satisfies readonly QuestionPack[];

export const questionPackOptions = questionPacks;
export const DEFAULT_QUESTION_PACK_KEY: QuestionPackKey = "osnovna-1998";

export function getQuestionPackByKey(
  key: string | undefined,
): QuestionPack {
  return (
    questionPacks.find((pack) => pack.key === key || pack.name === key || pack.label === key) ??
    questionPacks[0]
  );
}

export function getCanonicalQuestionPackKey(
  value: string,
): QuestionPackKey | undefined {
  const normalized = value.trim();
  const pack = questionPacks.find(
    (item) =>
      item.key === normalized ||
      item.name === normalized ||
      item.label === normalized,
  );

  return pack?.key;
}

export const BASIC_ENTRY_QUESTIONS =
  questionPacks[0].baseQuestions;
export const EXTENDED_ENTRY_QUESTIONS =
  questionPacks[0].extraQuestions;
export const DEFAULT_ENTRY_QUESTIONS = [
  ...BASIC_ENTRY_QUESTIONS,
  ...EXTENDED_ENTRY_QUESTIONS,
] as const;
