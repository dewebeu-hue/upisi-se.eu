"use client";

import { Component, type ReactNode } from "react";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { hasConvexClientConfig } from "@/components/providers/ConvexClientProvider";
import { ButtonLink } from "@/components/ui/ButtonLink";
import { EmptyState } from "@/components/ui/EmptyState";
import { ProgressPill } from "@/components/ui/ProgressPill";
import {
  InviteShell,
  LexiconInviteView,
} from "@/components/lexicons/LexiconInviteView";
import { newLexiconPath } from "@/lib/routes";

type PublicLexiconInviteProps = {
  slug: string;
};

type PublicLexiconInviteErrorBoundaryState = {
  hasError: boolean;
};

class PublicLexiconInviteErrorBoundary extends Component<
  { children: ReactNode },
  PublicLexiconInviteErrorBoundaryState
> {
  state: PublicLexiconInviteErrorBoundaryState = {
    hasError: false,
  };

  static getDerivedStateFromError(): PublicLexiconInviteErrorBoundaryState {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return <InviteErrorState />;
    }

    return this.props.children;
  }
}

function MissingConvexInviteState() {
  return (
    <InviteShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokušaj osvježiti stranicu ili napravi svoj leksikon."
        sticker="📼"
        title="Nismo uspjeli otvoriti leksikon"
      />
    </InviteShell>
  );
}

function InviteErrorState() {
  return (
    <InviteShell>
      <EmptyState
        action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
        description="Pokušaj osvježiti stranicu ili napravi svoj leksikon."
        sticker="📼"
        title="Nismo uspjeli otvoriti leksikon"
      />
    </InviteShell>
  );
}

export function PublicLexiconInvite({ slug }: PublicLexiconInviteProps) {
  if (!hasConvexClientConfig()) {
    return <MissingConvexInviteState />;
  }

  return (
    <PublicLexiconInviteErrorBoundary key={slug}>
      <PublicLexiconInviteInner slug={slug} />
    </PublicLexiconInviteErrorBoundary>
  );
}

function PublicLexiconInviteInner({ slug }: PublicLexiconInviteProps) {
  const lexicon = useQuery(api.lexicons.getPublicLexiconBySlug, { slug });

  if (lexicon === undefined) {
    return (
      <InviteShell>
        <div className="rounded-[1.25rem] border border-[rgba(36,27,47,0.12)] bg-white/62 p-5 shadow-[var(--shadow-soft)]">
          <ProgressPill label="Otvaram leksikon..." tone="yellow" />
          <h1 className="mt-4 text-3xl font-black text-[var(--color-ink)]">
            Listam stranice bilježnice.
          </h1>
          <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
            Pozivnica se sprema za čitanje, naljepnice i prvi klik na upis.
          </p>
        </div>
      </InviteShell>
    );
  }

  if (lexicon === null) {
    return (
      <InviteShell>
        <EmptyState
          action={<ButtonLink href={newLexiconPath()}>Napravi svoj leksikon</ButtonLink>}
          description="Link je možda pogrešan, obrisan ili više nije aktivan."
          sticker="⭐"
          title="Leksikon nije pronađen"
        />
      </InviteShell>
    );
  }

  return <LexiconInviteView lexicon={lexicon} />;
}
