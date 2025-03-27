import { Loader2 } from "lucide-react"
import { FC } from 'react'

export const LoadingSpinner: FC = () => {
  return (
    <div className="flex justify-center items-center p-4">
      <Loader2 className="h-8 w-8 animate-spin text-primary" />
    </div>
  )
} 