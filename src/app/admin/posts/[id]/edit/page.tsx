import { redirect } from "next/navigation"

export default function LegacyEditRedirect({ params }: { params: { id: string } }) {
  redirect(`/admin/edit/${params.id}`)
}
