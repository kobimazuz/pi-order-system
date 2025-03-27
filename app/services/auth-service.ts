import { createClient } from '@/utils/supabase/client'
import { deleteCookie, getCookies } from 'cookies-next'

export const AuthService = {
  async signOut() {
    try {
      // קבלת כל הקוקיז
      const cookies = getCookies()
      
      // מחיקת קוקיז ספציפיים ידועים
      deleteCookie('supabase-auth-token')
      deleteCookie('sb-access-token')
      deleteCookie('sb-refresh-token')
      
      // מחיקת כל הקוקיז שמתחילים ב-sb או מכילים supabase
      Object.keys(cookies ?? {}).forEach(cookieName => {
        if (cookieName.startsWith('sb-') || cookieName.includes('supabase')) {
          deleteCookie(cookieName)
        }
      })
      
      // קריאה לשרת לניקוי קוקיז בצד השרת
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
      
      // התנתקות מסופרבייס בצד הלקוח
      const supabase = createClient()
      const { error } = await supabase.auth.signOut()
      if (error) throw error

      // קצת זמן לוודא שהפעולות הושלמו
      await new Promise(resolve => setTimeout(resolve, 300))

      // ניתוב לדף הנחיתה
      window.location.href = '/landing'
    } catch (error) {
      console.error('שגיאה בהתנתקות:', error)
      // בכל מקרה, ננסה לנווט לדף הנחיתה
      window.location.href = '/landing'
      throw error
    }
  },

  async refreshSession() {
    try {
      const supabase = createClient()
      const { data: { session }, error } = await supabase.auth.getSession()
      
      if (error) throw error
      
      if (!session) {
        // אם אין סשן תקף, ננתב לדף הנחיתה
        window.location.href = '/landing'
        return null
      }

      return session
    } catch (error) {
      console.error('שגיאה בריענון הסשן:', error)
      window.location.href = '/landing'
      return null
    }
  },

  async getCurrentUser() {
    try {
      const supabase = createClient()
      const { data: { user }, error } = await supabase.auth.getUser()
      
      if (error) throw error
      
      return user
    } catch (error) {
      console.error('שגיאה בקבלת המשתמש הנוכחי:', error)
      return null
    }
  }
} 