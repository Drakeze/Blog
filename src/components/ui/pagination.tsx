import { Button } from "@/components/ui/button"

export type PaginationProps = {
  page: number
  totalPages: number
  onChange: (page: number) => void
}

export function Pagination({ page, totalPages, onChange }: PaginationProps) {
  const canGoBack = page > 1
  const canGoForward = page < totalPages

  return (
    <nav className="flex items-center gap-2" aria-label="Pagination">
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canGoBack}
        onClick={() => onChange(Math.max(1, page - 1))}
      >
        Previous
      </Button>
      <span className="text-sm text-muted-foreground">
        Page {page} of {totalPages}
      </span>
      <Button
        type="button"
        variant="outline"
        size="sm"
        disabled={!canGoForward}
        onClick={() => onChange(Math.min(totalPages, page + 1))}
      >
        Next
      </Button>
    </nav>
  )
}
