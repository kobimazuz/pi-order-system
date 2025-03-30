"use client"

import { useState } from "react"
import { Separator } from "@/components/ui/separator"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { FileSpreadsheet, Download, Upload, Check, X, AlertTriangle, Image as ImageIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Category, Color, Size, Supplier, Material } from "@prisma/client"

type ImportLog = {
  id: string
  type: string
  filename: string
  total_rows: number
  success: number
  errors: number
  status: string
  created_at: Date
  metadata?: string
}

type CategoryWithParentName = Category & { parent_name: string | null }
type SizeWithCategoryName = Size & { category_name: string | null }

interface BulkImportClientProps {
  importLogs: ImportLog[]
  previewData: {
    categories: CategoryWithParentName[]
    colors: Color[]
    sizes: SizeWithCategoryName[]
    materials: Material[]
    suppliers: Supplier[]
  }
  onUpload: (formData: FormData) => Promise<{ success: boolean, importLog: ImportLog }>
}

export function BulkImportClient({ importLogs, previewData, onUpload }: BulkImportClientProps) {
  const [activeTab, setActiveTab] = useState("categories")
  const [uploadedFile, setUploadedFile] = useState<File | null>(null)
  const [uploadedImages, setUploadedImages] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [uploadStatus, setUploadStatus] = useState<"idle" | "uploading" | "success" | "error">("idle")
  const [showPreview, setShowPreview] = useState(false)
  const [importStatus, setImportStatus] = useState<{
    added: number;
    updated: number;
    deleted: number;
    errors: number;
  } | null>(null)

  const downloadTemplate = async (type: string, includeData: boolean = false) => {
    try {
      const downloadUrl = `/api/templates?type=${type}&includeData=${includeData}`;
      window.open(downloadUrl, '_blank');
    } catch (error) {
      console.error("Error downloading template:", error);
      alert("שגיאה בהורדת התבנית");
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === "images") {
        setUploadedImages(e.target.files[0])
      } else {
        setUploadedFile(e.target.files[0])
      }
    }
  }

  const handleUpload = async () => {
    if (!uploadedFile) return

    setUploadStatus("uploading")
    setUploadProgress(0)

    try {
      const formData = new FormData()
      formData.append("file", uploadedFile)
      formData.append("type", activeTab)
      
      // אם יש קובץ תמונות, מוסיף אותו לבקשה
      if (uploadedImages) {
        formData.append("images", uploadedImages)
      }

      const result = await onUpload(formData)

      if (result.success) {
        setUploadStatus("success")
        setShowPreview(true)
      } else {
        setUploadStatus("error")
      }
    } catch (error) {
      console.error("Error uploading file:", error)
      setUploadStatus("error")
    }
  }

  const handleConfirmImport = () => {
    // בפועל, כאן היינו מבצעים את הייבוא האמיתי
    console.log(`מייבא נתונים עבור ${activeTab}`)

    // סימולציה של ייבוא מוצלח
    setShowPreview(false)
    setUploadedFile(null)
    setUploadStatus("idle")
    setUploadProgress(0)

    // הצג הודעת הצלחה
    alert(`ייבוא ${activeTab} הושלם בהצלחה!`)
  }

  const renderPreviewTable = () => {
    const currentPreviewData = previewData[activeTab as keyof typeof previewData]
    if (!currentPreviewData) return null

    switch (activeTab) {
      case "categories":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר</TableHead>
                <TableHead>קוד</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>קטגוריית אב</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(currentPreviewData as CategoryWithParentName[]).map((category, index) => (
                <TableRow key={category.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{category.code}</TableCell>
                  <TableCell>{category.name}</TableCell>
                  <TableCell>{category.parent_name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={category.status === "active" ? "default" : "secondary"}>{category.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "colors":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר</TableHead>
                <TableHead>קוד</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>קוד צבע</TableHead>
                <TableHead>דוגמה</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(currentPreviewData as Color[]).map((color, index) => (
                <TableRow key={color.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{color.code}</TableCell>
                  <TableCell>{color.name}</TableCell>
                  <TableCell>{color.hex_code}</TableCell>
                  <TableCell>
                    <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.hex_code }} />
                  </TableCell>
                  <TableCell>
                    <Badge variant={color.status === "active" ? "default" : "secondary"}>{color.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "sizes":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר</TableHead>
                <TableHead>קוד</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>תיאור</TableHead>
                <TableHead>קטגוריה</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(currentPreviewData as SizeWithCategoryName[]).map((size, index) => (
                <TableRow key={size.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{size.code}</TableCell>
                  <TableCell>{size.name}</TableCell>
                  <TableCell>{size.description || "-"}</TableCell>
                  <TableCell>{size.category_name || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={size.status === "active" ? "default" : "secondary"}>{size.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "materials":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר</TableHead>
                <TableHead>קוד</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>תיאור</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(currentPreviewData as Material[]).map((material, index) => (
                <TableRow key={material.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{material.code}</TableCell>
                  <TableCell>{material.name}</TableCell>
                  <TableCell>{material.description || "-"}</TableCell>
                  <TableCell>
                    <Badge variant={material.status === "active" ? "default" : "secondary"}>{material.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )

      case "suppliers":
        return (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>מספר</TableHead>
                <TableHead>קוד</TableHead>
                <TableHead>שם</TableHead>
                <TableHead>איש קשר</TableHead>
                <TableHead>אימייל</TableHead>
                <TableHead>טלפון</TableHead>
                <TableHead>כתובת</TableHead>
                <TableHead>סטטוס</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(currentPreviewData as Supplier[]).map((supplier, index) => (
                <TableRow key={supplier.id}>
                  <TableCell>{index + 1}</TableCell>
                  <TableCell>{supplier.code}</TableCell>
                  <TableCell>{supplier.name}</TableCell>
                  <TableCell>{supplier.contact_name}</TableCell>
                  <TableCell>{supplier.email}</TableCell>
                  <TableCell>{supplier.phone}</TableCell>
                  <TableCell>{supplier.address}</TableCell>
                  <TableCell>
                    <Badge variant={supplier.status === "active" ? "default" : "secondary"}>{supplier.status}</Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">היסטוריית ייבוא</h2>
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>סוג</TableHead>
                <TableHead>קובץ</TableHead>
                <TableHead>סה"כ שורות</TableHead>
                <TableHead>הצלחות</TableHead>
                <TableHead>שגיאות</TableHead>
                <TableHead>סטטוס</TableHead>
                <TableHead>תאריך</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {importLogs.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>{log.type}</TableCell>
                  <TableCell>{log.filename}</TableCell>
                  <TableCell>{log.total_rows}</TableCell>
                  <TableCell>{log.success}</TableCell>
                  <TableCell>{log.errors}</TableCell>
                  <TableCell>
                    <Badge variant={log.status === "completed" ? "default" : "destructive"}>
                      {log.status === "completed" ? "הושלם" : "נכשל"}
                    </Badge>
                  </TableCell>
                  <TableCell>{new Date(log.created_at).toLocaleString("he-IL")}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      <Separator />

      <div className="flex flex-col space-y-4">
        <h2 className="text-2xl font-bold">ייבוא נתונים</h2>
        <Tabs defaultValue="categories" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-6 mb-4">
            <TabsTrigger value="categories">קטגוריות</TabsTrigger>
            <TabsTrigger value="colors">צבעים</TabsTrigger>
            <TabsTrigger value="sizes">מידות</TabsTrigger>
            <TabsTrigger value="materials">חומרים</TabsTrigger>
            <TabsTrigger value="suppliers">ספקים</TabsTrigger>
            <TabsTrigger value="products">מוצרים</TabsTrigger>
          </TabsList>

          <TabsContent value="categories">
            <Card>
              <CardHeader>
                <CardTitle>ייבוא קטגוריות</CardTitle>
                <CardDescription>הורד תבנית, מלא אותה והעלה אותה בחזרה למערכת.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("categories")}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד תבנית ריקה
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("categories", true)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד נתונים קיימים
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={!uploadedFile || uploadStatus === "uploading"}>
                    <Upload className="mr-2 h-4 w-4" />
                    העלה קובץ
                  </Button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "success" && (
                  <Alert className="mt-4">
                    <Check className="h-4 w-4" />
                    <AlertTitle>הצלחה</AlertTitle>
                    <AlertDescription>הקובץ הועלה בהצלחה</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>שגיאה</AlertTitle>
                    <AlertDescription>אירעה שגיאה בהעלאת הקובץ</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="colors">
            <Card>
              <CardHeader>
                <CardTitle>ייבוא צבעים</CardTitle>
                <CardDescription>הורד תבנית, מלא אותה והעלה אותה בחזרה למערכת.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("colors")}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד תבנית ריקה
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("colors", true)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד נתונים קיימים
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={!uploadedFile || uploadStatus === "uploading"}>
                    <Upload className="mr-2 h-4 w-4" />
                    העלה קובץ
                  </Button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "success" && (
                  <Alert className="mt-4">
                    <Check className="h-4 w-4" />
                    <AlertTitle>הצלחה</AlertTitle>
                    <AlertDescription>הקובץ הועלה בהצלחה</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>שגיאה</AlertTitle>
                    <AlertDescription>אירעה שגיאה בהעלאת הקובץ</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="sizes">
            <Card>
              <CardHeader>
                <CardTitle>ייבוא מידות</CardTitle>
                <CardDescription>הורד תבנית, מלא אותה והעלה אותה בחזרה למערכת.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("sizes")}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד תבנית ריקה
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("sizes", true)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד נתונים קיימים
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={!uploadedFile || uploadStatus === "uploading"}>
                    <Upload className="mr-2 h-4 w-4" />
                    העלה קובץ
                  </Button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "success" && (
                  <Alert className="mt-4">
                    <Check className="h-4 w-4" />
                    <AlertTitle>הצלחה</AlertTitle>
                    <AlertDescription>הקובץ הועלה בהצלחה</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>שגיאה</AlertTitle>
                    <AlertDescription>אירעה שגיאה בהעלאת הקובץ</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="materials">
            <Card>
              <CardHeader>
                <CardTitle>ייבוא חומרים</CardTitle>
                <CardDescription>הורד תבנית, מלא אותה והעלה אותה בחזרה למערכת.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("materials")}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד תבנית ריקה
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("materials", true)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד נתונים קיימים
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={!uploadedFile || uploadStatus === "uploading"}>
                    <Upload className="mr-2 h-4 w-4" />
                    העלה קובץ
                  </Button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "success" && (
                  <Alert className="mt-4">
                    <Check className="h-4 w-4" />
                    <AlertTitle>הצלחה</AlertTitle>
                    <AlertDescription>הקובץ הועלה בהצלחה</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>שגיאה</AlertTitle>
                    <AlertDescription>אירעה שגיאה בהעלאת הקובץ</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suppliers">
            <Card>
              <CardHeader>
                <CardTitle>ייבוא ספקים</CardTitle>
                <CardDescription>הורד תבנית, מלא אותה והעלה אותה בחזרה למערכת.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col space-y-2">
                  <div className="flex gap-2">
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("suppliers")}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד תבנית ריקה
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => downloadTemplate("suppliers", true)}
                      className="flex items-center gap-2"
                    >
                      <Download size={16} /> הורד נתונים קיימים
                    </Button>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <div className="flex-1">
                    <Input
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={handleFileChange}
                      className="cursor-pointer"
                    />
                  </div>
                  <Button onClick={handleUpload} disabled={!uploadedFile || uploadStatus === "uploading"}>
                    <Upload className="mr-2 h-4 w-4" />
                    העלה קובץ
                  </Button>
                </div>

                {uploadStatus === "uploading" && (
                  <div className="mt-4">
                    <Progress value={uploadProgress} />
                  </div>
                )}

                {uploadStatus === "success" && (
                  <Alert className="mt-4">
                    <Check className="h-4 w-4" />
                    <AlertTitle>הצלחה</AlertTitle>
                    <AlertDescription>הקובץ הועלה בהצלחה</AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertTitle>שגיאה</AlertTitle>
                    <AlertDescription>אירעה שגיאה בהעלאת הקובץ</AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>ייבוא מוצרים</CardTitle>
                <CardDescription>
                  העלה קובץ אקסל עם פרטי המוצרים וקובץ ZIP עם תמונות המוצרים.
                  שם כל קובץ תמונה צריך להיות המק"ט של המוצר (לדוגמה: HY0001.jpg).
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-4">
                    <Button
                      variant="outline"
                      onClick={() => downloadTemplate("products")}
                    >
                      <Download className="mr-2 h-4 w-4" />
                      הורד תבנית
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">קובץ אקסל</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        accept=".xlsx,.xls"
                        onChange={handleFileChange}
                      />
                      <FileSpreadsheet className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">קובץ תמונות (ZIP)</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="file"
                        name="images"
                        accept=".zip"
                        onChange={handleFileChange}
                      />
                      <ImageIcon className="h-5 w-5 text-muted-foreground" />
                    </div>
                  </div>
                </div>

                {uploadedFile && (
                  <div className="flex items-center justify-end gap-2">
                    <Button onClick={handleUpload} disabled={uploadStatus === "uploading"}>
                      <Upload className="mr-2 h-4 w-4" />
                      {uploadStatus === "uploading" ? "מעלה..." : "העלה קבצים"}
                    </Button>
                  </div>
                )}

                {uploadStatus === "uploading" && (
                  <Progress value={uploadProgress} className="w-full" />
                )}

                {uploadStatus === "success" && (
                  <Alert>
                    <Check className="h-4 w-4" />
                    <AlertTitle>הקבצים הועלו בהצלחה</AlertTitle>
                    <AlertDescription>
                      הקבצים נקלטו במערכת. לחץ על "אשר ייבוא" כדי להתחיל בתהליך הייבוא.
                    </AlertDescription>
                  </Alert>
                )}

                {uploadStatus === "error" && (
                  <Alert variant="destructive">
                    <X className="h-4 w-4" />
                    <AlertTitle>שגיאה בהעלאת הקבצים</AlertTitle>
                    <AlertDescription>
                      אירעה שגיאה בהעלאת הקבצים. נא לנסות שוב.
                    </AlertDescription>
                  </Alert>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {showPreview && (
        <Dialog open={showPreview} onOpenChange={setShowPreview}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>תצוגה מקדימה</DialogTitle>
              <DialogDescription>
                אנא בדוק את הנתונים לפני הייבוא הסופי
              </DialogDescription>
            </DialogHeader>
            <div className="max-h-[400px] overflow-y-auto">
              {renderPreviewTable()}
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <X className="mr-2 h-4 w-4" />
                ביטול
              </Button>
              <Button onClick={handleConfirmImport}>
                <Check className="mr-2 h-4 w-4" />
                אשר ייבוא
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {importStatus && (
        <div className="mt-4 p-4 bg-gray-50 rounded border">
          <h3 className="text-lg font-semibold">סטטוס ייבוא</h3>
          <p>נוספו: {importStatus.added}</p>
          <p>עודכנו: {importStatus.updated}</p>
          <p>נמחקו: {importStatus.deleted}</p>
          <p>שגיאות: {importStatus.errors}</p>
        </div>
      )}
    </div>
  )
}

function getTabTitle(tab: string) {
  const titles: Record<string, string> = {
    categories: "קטגוריות",
    colors: "צבעים",
    sizes: "מידות",
    suppliers: "ספקים",
    products: "מוצרים"
  }
  return titles[tab] || tab
} 