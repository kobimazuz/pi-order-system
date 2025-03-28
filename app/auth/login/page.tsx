"use client"

import { useEffect } from "react"

export default function LoginPage() {
  useEffect(() => {
    // בדיקה אם יש קוקי שמורה על ניקוי הלוקל סטורג'
    const cookies = document.cookie.split('; ')
    const clearStorage = cookies.find(row => row.startsWith('clear_storage='))
    
    if (clearStorage) {
      try {
        // ניקוי כל המפתחות שקשורים ל-Supabase
        Object.keys(localStorage).forEach(key => {
          if (key.startsWith('supabase.') || key.startsWith('sb-')) {
            localStorage.removeItem(key)
          }
        })
        
        // מחיקת הקוקי
        document.cookie = 'clear_storage=; path=/; max-age=0'
      } catch (e) {
        console.error('שגיאה בניקוי לוקל סטורג:', e)
      }
    }
  }, [])
} 