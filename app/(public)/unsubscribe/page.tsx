import { UnsubscribeCard } from "./unsubscribe-card"

interface Props {
  searchParams: Promise<{ token?: string }>
}

export default async function UnsubscribePage({ searchParams }: Props) {
  const { token } = await searchParams
  return (
    <div className="flex min-h-[60vh] items-center justify-center px-4 py-16">
      <UnsubscribeCard token={token} />
    </div>
  )
}
