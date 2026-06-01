export type EntryResultTitle = {
  title: string;
  description: string;
  emoji: string;
};

export type UnlockMilestone = {
  key: string;
  label: string;
  description: string;
  unlocked: boolean;
  current?: boolean;
  requiredCount: number;
};

export type SuperlativeEntry = {
  _id: string;
  displayName: string;
  createdAt?: number;
  consentQuizUse?: boolean;
};

export type TeamSuperlative = {
  label: string;
  displayName: string;
  description: string;
  emoji: string;
};

export const TEAM_SUPERLATIVES_UNLOCK_COUNT = 3;

const entryResults: EntryResultTitle[] = [
  {
    title: "Kraljica gel-olovki",
    description: "Tvoj upis ima onu energiju kad se u leksikon pisalo najljepšom olovkom iz pernice.",
    emoji: "✨",
  },
  {
    title: "Drama Queen iz 2004.",
    description: "Malo smijeha, malo drame, dovoljno materijala da se grupa odmah javi.",
    emoji: "💅",
  },
  {
    title: "Tiha legenda zadnje klupe",
    description: "Ne moraš biti najglasnija da bi svi pamtili tvoju stranicu.",
    emoji: "⭐",
  },
  {
    title: "Glavna organizatorica izlaska",
    description: "Imaš vibe osobe koja bi znala gdje se ide, tko kasni i što se nosi.",
    emoji: "📼",
  },
  {
    title: "Romantična arhivistica",
    description: "Čuvaš detalje koje drugi zaborave i zato leksikon odmah ima dušu.",
    emoji: "💖",
  },
  {
    title: "Ona koja sve pamti",
    description: "Tvoj odgovor zvuči kao folder pun starih slika, poruka i internih fora.",
    emoji: "📓",
  },
  {
    title: "Kraljica interne fore",
    description: "Dovoljna je jedna rečenica i ekipa već zna točno na što misliš.",
    emoji: "😎",
  },
  {
    title: "Nostalgija na repeat",
    description: "Tvoj upis vraća pjesmu, miris školskog hodnika i osjećaj stare ekipe.",
    emoji: "💿",
  },
  {
    title: "Čuvarica starih trauma",
    description: "Sve je prošlo, sada je smiješno, i baš zato ulazi u leksikon.",
    emoji: "🦋",
  },
  {
    title: "CD/DVD romantik",
    description: "Tvoja stranica ima energiju mix CD-a koji se čuvao kao blago.",
    emoji: "💿",
  },
  {
    title: "MSN misteriozna",
    description: "Status bi bio kratak, dramatičan i svima bi bilo jasno da se nešto događa.",
    emoji: "🌙",
  },
  {
    title: "Zvijezda velikog odmora",
    description: "Ovaj upis bi se prepričavao između peciva, soka i zvona za nastavu.",
    emoji: "🌈",
  },
];

const teamTitleTemplates = [
  {
    label: "Prva stranica leksikona",
    description: "Otvorila je krug i dala ekipi znak da se upiše.",
    emoji: "📓",
  },
  {
    label: "Kraljica nostalgije",
    description: "Nosi najviše onog osjećaja: čekaj, sjećaš se ovoga?",
    emoji: "✨",
  },
  {
    label: "Glavna za reunion",
    description: "Ovo je osoba zbog koje bi se grupa mogla stvarno okupiti.",
    emoji: "☕",
  },
  {
    label: "Arhivistica internih fora",
    description: "Sigurno ima barem jednu priču koju nitko drugi ne bi izvukao.",
    emoji: "🗂️",
  },
  {
    label: "Najbrži upis",
    description: "Došla, upisala se i odmah pomaknula leksikon naprijed.",
    emoji: "⚡",
  },
  {
    label: "Osoba koja diže grupu",
    description: "Vibe osobe zbog koje se chat opet probudi.",
    emoji: "💖",
  },
  {
    label: "Čuvarica dobrih priča",
    description: "Njezina stranica ima materijala za još jedan krug smijanja.",
    emoji: "⭐",
  },
  {
    label: "Najveći 2000s vibe",
    description: "Da je ovaj upis pjesma, bio bi na mix CD-u.",
    emoji: "💿",
  },
];

function hashSeed(seed: string): number {
  let hash = 0;

  for (let index = 0; index < seed.length; index += 1) {
    hash = (hash * 31 + seed.charCodeAt(index)) >>> 0;
  }

  return hash;
}

export function getEntryResultTitle(seed: string): EntryResultTitle {
  const normalizedSeed = seed.trim() || "upisi-se";
  const index = hashSeed(normalizedSeed) % entryResults.length;

  return entryResults[index];
}

export function getUnlockMilestones(
  entryCount: number,
  quizUnlockEntryCount: number,
): UnlockMilestone[] {
  const safeEntryCount = Math.max(0, entryCount);
  const safeQuizUnlockCount = Math.max(1, quizUnlockEntryCount);
  const milestoneInputs = [
    {
      key: "opened",
      label: "Leksikon je otvoren",
      description: "Prvi upis pali nostalgiju i daje ekipi znak da se uključi.",
      requiredCount: 1,
    },
    {
      key: "team-titles",
      label: "Prve interne fore",
      description: "Na 3 upisa leksikon već ima dovoljno energije za prve titule ekipe u adminu.",
      requiredCount: TEAM_SUPERLATIVES_UNLOCK_COUNT,
    },
    {
      key: "quiz-ready",
      label: "Dovoljno upisa za kviz",
      description: "Kad se skupi dovoljno upisa, sljedeća faza može otvoriti igru pogađanja odgovora.",
      requiredCount: safeQuizUnlockCount,
    },
    {
      key: "bigger-titles",
      label: "Titule ekipe+",
      description: "Na 8 upisa superlativi imaju više materijala i cijeli leksikon djeluje kao prava igra.",
      requiredCount: 8,
    },
    {
      key: "reunion-energy",
      label: "Reunion energija",
      description: "Na 12 upisa leksikon već izgleda kao mala arhiva ekipe.",
      requiredCount: 12,
    },
  ];

  const sorted = [...milestoneInputs].sort(
    (first, second) => first.requiredCount - second.requiredCount,
  );
  const nextLocked = sorted.find(
    (milestone) => safeEntryCount < milestone.requiredCount,
  );

  return sorted.map((milestone) => ({
    ...milestone,
    unlocked: safeEntryCount >= milestone.requiredCount,
    current: nextLocked?.key === milestone.key,
  }));
}

export function getTeamSuperlatives(
  entries: SuperlativeEntry[],
): TeamSuperlative[] {
  if (entries.length < TEAM_SUPERLATIVES_UNLOCK_COUNT) {
    return [];
  }

  const orderedEntries = [...entries].sort((first, second) => {
    const firstCreatedAt = first.createdAt ?? 0;
    const secondCreatedAt = second.createdAt ?? 0;

    if (firstCreatedAt !== secondCreatedAt) {
      return firstCreatedAt - secondCreatedAt;
    }

    return first._id.localeCompare(second._id);
  });

  return orderedEntries.slice(0, 6).map((entry, index) => {
    const template =
      teamTitleTemplates[
        (hashSeed(`${entry._id}:${entry.displayName}`) + index) %
          teamTitleTemplates.length
      ];

    return {
      ...template,
      displayName: entry.displayName,
    };
  });
}
