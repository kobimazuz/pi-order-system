import { NextResponse } from 'next/server'
import { type NextRequest } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function POST(request: NextRequest) {
  // נשתמש בלקוח הסופרבייס החדש
  const supabase = await createClient()

  // התנתקות מסופרבייס
  const { error } = await supabase.auth.signOut()

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    )
  }

  // יצירת תגובה עם סטטוס הצלחה
  const response = NextResponse.json(
    { success: true },
    { status: 200 }
  )
  
  // ניקוי קוקיז ספציפיים ידועים של סופרבייס
  response.cookies.delete('sb-access-token')
  response.cookies.delete('sb-refresh-token')
  
  // נגדיר רשימה של קוקיז שמתחילים ב-sb או מכילים supabase
  const cookieNames = request.cookies.getAll()
    .filter(cookie => 
      cookie.name.startsWith('sb-') || 
      cookie.name.includes('supabase')
    )
    .map(cookie => cookie.name)
  
  // נמחק את כל הקוקיז שמצאנו
  for (const name of cookieNames) {
    response.cookies.delete(name)
  }

  return response
} 