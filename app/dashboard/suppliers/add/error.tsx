"use client"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="bg-destructive/15 text-destructive p-3 rounded-md mb-6">
      <p>{error.message}</p>
      <button onClick={reset} className="mt-2 text-sm underline">
        נסה שוב
      </button>
    </div>
  )
} 