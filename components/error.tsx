import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { FC } from 'react'

export interface ErrorComponentProps {
  error: Error | unknown
}

export const ErrorComponent: FC<ErrorComponentProps> = ({ error }) => {
  const errorMessage = error instanceof Error ? error.message : 'שגיאה לא ידועה'

  return (
    <Alert variant="destructive">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>שגיאה!</AlertTitle>
      <AlertDescription>
        {errorMessage}
      </AlertDescription>
    </Alert>
  )
} 