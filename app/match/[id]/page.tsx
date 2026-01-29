
import { getMatch } from '@/app/actions';
import Scoreboard from '@/app/components/Scoreboard';
import { notFound } from 'next/navigation';

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function MatchPage({ params }: PageProps) {
  const { id } = await params;
  const match = await getMatch(id);

  if (!match) {
    notFound();
  }

  return <Scoreboard matchId={id} initialData={match} />;
}
