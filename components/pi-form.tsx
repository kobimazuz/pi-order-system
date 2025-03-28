"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Label } from "@/components/ui/label"
import { FileSpreadsheet, Trash2, Plus, Download, Save } from "lucide-react"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

interface Product {
  id: string
  sku: string
  name: string
  image_url: string | null
  units_per_pack: number
  units_per_carton: number
  price_per_unit: number
}

interface Category {
  id: string
  name: string
  parent: string | null
  products: Product[]
}

interface Customer {
  id: string
  name: string
}

interface OrderItem extends Product {
  quantity: number
}

interface PIFormProps {
  categories: Category[]
  customers: Customer[]
  createPI: (formData: FormData) => Promise<{ data?: any; error?: string }>
  generateExcel: (formData: FormData) => Promise<Response | { error: string }>
}

export function PIForm({ categories, customers, createPI, generateExcel }: PIFormProps) {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState<string>(categories[0]?.id || "")
  const [selectedCustomer, setSelectedCustomer] = useState<string>("")
  const [orderItems, setOrderItems] = useState<OrderItem[]>([])
  const [quantities, setQuantities] = useState<Record<string, number>>({})
  const [searchQuery, setSearchQuery] = useState("")
  const [notes, setNotes] = useState("")
  const [language, setLanguage] = useState<"he" | "en">("he")
  const [isLoading, setIsLoading] = useState(false)

  // מיון הקטגוריות - קטגוריות ראשיות קודם
  const sortedCategories = [...categories].sort((a, b) => {
    if (!a.parent && b.parent) return -1
    if (a.parent && !b.parent) return 1
    return 0
  })

  const selectedProducts = selectedCategory
    ? categories.find(c => c.id === selectedCategory)?.products.filter(p => 
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.sku.toLowerCase().includes(searchQuery.toLowerCase())
      ) || []
    : []

  const addToOrder = (productId: string) => {
    const quantity = quantities[productId] || 0
    if (quantity <= 0) return

    const product = selectedProducts.find((p) => p.id === productId)
    if (!product) return

    const existingItemIndex = orderItems.findIndex((item) => item.id === productId)

    if (existingItemIndex >= 0) {
      const updatedItems = [...orderItems]
      updatedItems[existingItemIndex].quantity = quantity
      setOrderItems(updatedItems)
    } else {
      setOrderItems([...orderItems, { ...product, quantity }])
    }

    // Reset quantity
    const newQuantities = { ...quantities }
    delete newQuantities[productId]
    setQuantities(newQuantities)
  }

  const removeFromOrder = (productId: string) => {
    setOrderItems(orderItems.filter((item) => item.id !== productId))
  }

  const updateQuantity = (productId: string, value: number) => {
    setQuantities({ ...quantities, [productId]: value })
  }

  const totalUnits = orderItems.reduce((sum, item) => sum + item.quantity * item.units_per_pack, 0)
  const totalPackages = orderItems.reduce((sum, item) => sum + item.quantity, 0)
  const totalCartons = orderItems.reduce((sum, item) => {
    const unitsTotal = item.quantity * item.units_per_pack
    return sum + Math.ceil(unitsTotal / item.units_per_carton)
  }, 0)
  const totalAmount = orderItems.reduce(
    (sum, item) => sum + item.quantity * item.units_per_pack * item.price_per_unit,
    0,
  )

  const handleSubmit = async () => {
    if (!selectedCustomer) {
      toast.error("נא לבחור לקוח")
      return
    }

    if (orderItems.length === 0) {
      toast.error("נא להוסיף מוצרים להזמנה")
      return
    }

    try {
      setIsLoading(true)
      const formData = new FormData()
      formData.append("orderItems", JSON.stringify(orderItems))
      formData.append("customerId", selectedCustomer)
      formData.append("notes", notes)
      formData.append("language", language)

      const result = await createPI(formData)
      
      if (result.error) {
        throw new Error(result.error)
      }

      // יצירת קובץ אקסל
      const excelFormData = new FormData()
      excelFormData.append("piId", result.data.id)
      
      const excelResult = await generateExcel(excelFormData)
      
      if ('error' in excelResult) {
        throw new Error(excelResult.error)
      }

      // הורדת הקובץ
      const blob = await excelResult.blob()
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement("a")
      a.href = url
      a.download = `PI-${new Date().getFullYear()}-${result.data.id.slice(0, 4)}.xlsx`
      document.body.appendChild(a)
      a.click()
      window.URL.revokeObjectURL(url)
      document.body.removeChild(a)

      toast.success("ההזמנה נוצרה בהצלחה")
      router.push("/dashboard/orders")
      router.refresh()
    } catch (error) {
      console.error(error)
      toast.error(error instanceof Error ? error.message : "שגיאה ביצירת ההזמנה")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>בחירת מוצרים</CardTitle>
            <CardDescription>בחר קטגוריה והוסף מוצרים להזמנה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר קטגוריה" />
                  </SelectTrigger>
                  <SelectContent>
                    {sortedCategories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.parent ? `└─ ${category.name}` : category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex-1">
                <Input 
                  placeholder="חיפוש מוצר..." 
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>

            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-14"></TableHead>
                  <TableHead>מק״ט</TableHead>
                  <TableHead>שם מוצר</TableHead>
                  <TableHead>יח׳ באריזה</TableHead>
                  <TableHead>מחיר ליחידה</TableHead>
                  <TableHead className="w-32">כמות (אריזות)</TableHead>
                  <TableHead className="w-24">פעולות</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedProducts.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell>
                      <div className="w-10 h-10 relative rounded overflow-hidden">
                        <Image
                          src={product.image_url || "/placeholder.svg"}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    </TableCell>
                    <TableCell>{product.sku}</TableCell>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.units_per_pack}</TableCell>
                    <TableCell>₪{product.price_per_unit.toFixed(2)}</TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        min="0"
                        value={quantities[product.id] || ""}
                        onChange={(e) => updateQuantity(product.id, Number.parseInt(e.target.value) || 0)}
                      />
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        onClick={() => addToOrder(product.id)}
                        disabled={!quantities[product.id] || quantities[product.id] <= 0}
                      >
                        הוסף
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>פרטי הזמנה</CardTitle>
            <CardDescription>
              PI-{new Date().getFullYear()}-
              {Math.floor(Math.random() * 10000)
                .toString()
                .padStart(4, "0")}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>תאריך</Label>
                <Input type="date" defaultValue={new Date().toISOString().split("T")[0]} disabled />
              </div>
              <div className="space-y-2">
                <Label>ספק</Label>
                <Select value={selectedCustomer} onValueChange={setSelectedCustomer}>
                  <SelectTrigger>
                    <SelectValue placeholder="בחר ספק" />
                  </SelectTrigger>
                  <SelectContent>
                    {customers.map((customer) => (
                      <SelectItem key={customer.id} value={customer.id}>
                        {customer.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>שפת הקובץ</Label>
              <Select value={language} onValueChange={(value: "he" | "en") => setLanguage(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="he">עברית</SelectItem>
                  <SelectItem value="en">English</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>הערות</Label>
              <Input 
                placeholder="הערות להזמנה" 
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>סיכום הזמנה</CardTitle>
            <CardDescription>פריטים שנוספו להזמנה</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {orderItems.length === 0 ? (
              <div className="text-center py-6 text-muted-foreground">לא נוספו פריטים להזמנה</div>
            ) : (
              <div className="space-y-4">
                {orderItems.map((item) => (
                  <div key={item.id} className="flex items-center justify-between border-b pb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 relative rounded overflow-hidden">
                        <Image
                          src={item.image_url || "/placeholder.svg"}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-xs text-muted-foreground">
                          {item.quantity} אריזות × {item.units_per_pack} יח׳
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <div>₪{(item.quantity * item.units_per_pack * item.price_per_unit).toFixed(2)}</div>
                        <div className="text-xs text-muted-foreground">{item.quantity * item.units_per_pack} יח׳</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromOrder(item.id)}
                        className="text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
          <CardFooter className="flex-col border-t pt-4">
            <div className="w-full space-y-2">
              <div className="flex justify-between text-sm">
                <span>סה״כ יחידות:</span>
                <span>{totalUnits}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>סה״כ אריזות:</span>
                <span>{totalPackages}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span>סה״כ קרטונים:</span>
                <span>{totalCartons}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t">
                <span>סה״כ לתשלום:</span>
                <span>₪{totalAmount.toFixed(2)}</span>
              </div>
            </div>
            <Button 
              className="w-full mt-4" 
              disabled={orderItems.length === 0 || !selectedCustomer || isLoading}
              onClick={handleSubmit}
            >
              <Save className="mr-2 h-4 w-4" />
              שמור הזמנה
            </Button>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
} 