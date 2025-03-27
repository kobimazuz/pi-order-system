import { type Icon as LucideIcon } from "lucide-react"
import { FaGoogle } from "react-icons/fa"
import { Loader2 } from "lucide-react"
import type { IconType } from "react-icons"
import { FcGoogle } from "react-icons/fc"

export type Icon = typeof LucideIcon

export const Icons = {
  google: FcGoogle as IconType,
  spinner: Loader2 as IconType,
} 