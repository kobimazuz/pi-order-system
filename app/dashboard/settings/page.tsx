"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { Save } from "lucide-react"

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    // Initialize with default values
    companyName: "חברת הדגמה בע״מ",
    companyEmail: "info@example.com",
    companyPhone: "03-1234567",
    companyAddress: "רחוב הדוגמה 123, תל אביב",
    pi_prefix: "PI-",
    pi_format: "YYYY-NNNN",
    pi_footer: "כל המחירים אינם כוללים מע״מ. תוקף ההצעה: 30 יום.",
    db_host: "localhost",
    db_port: "5432",
    db_name: "pi_system",
    db_schema: "public",
    db_user: "postgres",
    db_password: "********",
    excel_template: "pi_template.xlsx",
    darkMode: false,
    showStatistics: true,
    systemNotifications: true,
    resetNumbering: true,
    includeProductImages: true,
    includeCompanyLogo: true,
    saveLocalCopy: true,
    exportPath: "/exports",
  })

  const handleSettingChange = (key: string, value: any) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const handleSaveSettings = () => {
    // In a real application, this would save to a database
    console.log("Saving settings:", settings)
    alert("Settings saved successfully!")
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">הגדרות מערכת</h1>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">כללי</TabsTrigger>
          <TabsTrigger value="pi">הגדרות PI</TabsTrigger>
          <TabsTrigger value="database">מסד נתונים</TabsTrigger>
          <TabsTrigger value="export">ייצוא</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות כלליות</CardTitle>
              <CardDescription>הגדר את הפרטים הבסיסיים של המערכת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_name">שם החברה</Label>
                  <Input
                    id="company_name"
                    value={settings.companyName}
                    onChange={(e) => handleSettingChange("companyName", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_email">אימייל</Label>
                  <Input
                    id="company_email"
                    type="email"
                    value={settings.companyEmail}
                    onChange={(e) => handleSettingChange("companyEmail", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="company_phone">טלפון</Label>
                  <Input
                    id="company_phone"
                    value={settings.companyPhone}
                    onChange={(e) => handleSettingChange("companyPhone", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="company_address">כתובת</Label>
                  <Input
                    id="company_address"
                    value={settings.companyAddress}
                    onChange={(e) => handleSettingChange("companyAddress", e.target.value)}
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_logo">לוגו החברה</Label>
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-gray-100 rounded-md flex items-center justify-center">
                    <span className="text-gray-400">לוגו</span>
                  </div>
                  <Button variant="outline">החלף לוגו</Button>
                </div>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                שמור הגדרות
              </Button>
            </CardFooter>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>הגדרות תצוגה</CardTitle>
              <CardDescription>התאם את אפשרויות התצוגה של המערכת</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>מצב כהה</Label>
                  <p className="text-sm text-muted-foreground">הפעל מצב כהה במערכת</p>
                </div>
                <Switch
                  checked={settings.darkMode}
                  onCheckedChange={(checked) => handleSettingChange("darkMode", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>הצג סטטיסטיקות בדשבורד</Label>
                  <p className="text-sm text-muted-foreground">הצג נתונים סטטיסטיים בדף הבית</p>
                </div>
                <Switch
                  checked={settings.showStatistics}
                  onCheckedChange={(checked) => handleSettingChange("showStatistics", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>התראות מערכת</Label>
                  <p className="text-sm text-muted-foreground">הצג התראות על אירועים במערכת</p>
                </div>
                <Switch
                  checked={settings.systemNotifications}
                  onCheckedChange={(checked) => handleSettingChange("systemNotifications", checked)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                שמור הגדרות
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="pi" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות PI</CardTitle>
              <CardDescription>הגדר את אפשרויות יצירת הזמנות PI</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pi_prefix">תחילית מספר PI</Label>
                <Input
                  id="pi_prefix"
                  value={settings.pi_prefix}
                  onChange={(e) => handleSettingChange("pi_prefix", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">התחילית שתופיע לפני מספר ה-PI</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="pi_format">פורמט מספור</Label>
                <Input
                  id="pi_format"
                  value={settings.pi_format}
                  onChange={(e) => handleSettingChange("pi_format", e.target.value)}
                />
                <p className="text-xs text-muted-foreground">YYYY = שנה, NNNN = מספר סידורי</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>איפוס מספור שנתי</Label>
                  <p className="text-sm text-muted-foreground">אפס את המספור הסידורי בתחילת כל שנה</p>
                </div>
                <Switch
                  checked={settings.resetNumbering}
                  onCheckedChange={(checked) => handleSettingChange("resetNumbering", checked)}
                />
              </div>
              <Separator />
              <div className="space-y-2">
                <Label htmlFor="pi_footer">הערת שוליים להזמנות</Label>
                <Textarea
                  id="pi_footer"
                  rows={3}
                  value={settings.pi_footer}
                  onChange={(e) => handleSettingChange("pi_footer", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                שמור הגדרות
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="database" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות מסד נתונים</CardTitle>
              <CardDescription>הגדר את חיבור מסד הנתונים PostgreSQL</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db_host">שרת</Label>
                  <Input
                    id="db_host"
                    value={settings.db_host}
                    onChange={(e) => handleSettingChange("db_host", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_port">פורט</Label>
                  <Input
                    id="db_port"
                    value={settings.db_port}
                    onChange={(e) => handleSettingChange("db_port", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db_name">שם מסד הנתונים</Label>
                  <Input
                    id="db_name"
                    value={settings.db_name}
                    onChange={(e) => handleSettingChange("db_name", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_schema">סכמה</Label>
                  <Input
                    id="db_schema"
                    value={settings.db_schema}
                    onChange={(e) => handleSettingChange("db_schema", e.target.value)}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="db_user">שם משתמש</Label>
                  <Input
                    id="db_user"
                    value={settings.db_user}
                    onChange={(e) => handleSettingChange("db_user", e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="db_password">סיסמה</Label>
                  <Input
                    id="db_password"
                    type="password"
                    value={settings.db_password}
                    onChange={(e) => handleSettingChange("db_password", e.target.value)}
                  />
                </div>
              </div>
              <div className="flex justify-end">
                <Button variant="outline">בדוק חיבור</Button>
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                שמור הגדרות
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>

        <TabsContent value="export" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>הגדרות ייצוא</CardTitle>
              <CardDescription>הגדר את אפשרויות ייצוא הקבצים</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="excel_template">תבנית אקסל</Label>
                <div className="flex items-center gap-2">
                  <Input
                    id="excel_template"
                    value={settings.excel_template}
                    readOnly
                    onChange={(e) => handleSettingChange("excel_template", e.target.value)}
                  />
                  <Button variant="outline">החלף תבנית</Button>
                </div>
                <p className="text-xs text-muted-foreground">תבנית האקסל לייצוא הזמנות PI</p>
              </div>
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>כלול תמונות מוצרים</Label>
                  <p className="text-sm text-muted-foreground">הוסף תמונות מוצרים לקובץ האקסל</p>
                </div>
                <Switch
                  checked={settings.includeProductImages}
                  onCheckedChange={(checked) => handleSettingChange("includeProductImages", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>כלול לוגו חברה</Label>
                  <p className="text-sm text-muted-foreground">הוסף את לוגו החברה לקובץ האקסל</p>
                </div>
                <Switch
                  checked={settings.includeCompanyLogo}
                  onCheckedChange={(checked) => handleSettingChange("includeCompanyLogo", checked)}
                />
              </div>
              <Separator />
              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <Label>שמור עותק מקומי</Label>
                  <p className="text-sm text-muted-foreground">שמור עותק של כל קובץ שיוצא במערכת</p>
                </div>
                <Switch
                  checked={settings.saveLocalCopy}
                  onCheckedChange={(checked) => handleSettingChange("saveLocalCopy", checked)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="export_path">נתיב שמירה</Label>
                <Input
                  id="export_path"
                  value={settings.exportPath}
                  onChange={(e) => handleSettingChange("exportPath", e.target.value)}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSaveSettings}>
                <Save className="mr-2 h-4 w-4" />
                שמור הגדרות
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

