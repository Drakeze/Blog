import { UnsubscribeCard } from './unsubscribe-card';

interface Props {
  searchParams: Promise<{ token?: string }>;
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams;
  return <UnsubscribeCard token={token} />;
}
