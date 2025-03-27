"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Edit, MoreHorizontal, Plus, Trash2, Upload } from "lucide-react"
import Link from "next/link"

// מוק דאטה לצבעים
const colors = [
  { id: 1, code: "COL001", name: "שחור", hex_code: "#000000", status: "פעיל" },
  { id: 2, code: "COL002", name: "לבן", hex_code: "#FFFFFF", status: "פעיל" },
  { id: 3, code: "COL003", name: "אדום", hex_code: "#FF0000", status: "פעיל" },
  { id: 4, code: "COL004", name: "כחול", hex_code: "#0000FF", status: "פעיל" },
  { id: 5, code: "COL005", name: "ירוק", hex_code: "#00FF00", status: "פעיל" },
  { id: 6, code: "COL006", name: "צהוב", hex_code: "#FFFF00", status: "לא פעיל" },
]

// מוק דאטה למידות
const sizes = [
  { id: 1, code: "SIZ001", name: "S", description: "קטן", category: "חולצות", status: "פעיל" },
  { id: 2, code: "SIZ002", name: "M", description: "בינוני", category: "חולצות", status: "פעיל" },
  { id: 3, code: "SIZ003", name: "L", description: "גדול", category: "חולצות", status: "פעיל" },
  { id: 4, code: "SIZ004", name: "XL", description: "גדול מאוד", category: "חולצות", status: "פעיל" },
  { id: 5, code: "SIZ005", name: "XXL", description: "גדול במיוחד", category: "חולצות", status: "פעיל" },
  { id: 6, code: "SIZ006", name: "30", description: "מידה 30", category: "מכנסיים", status: "פעיל" },
  { id: 7, code: "SIZ007", name: "32", description: "מידה 32", category: "מכנסיים", status: "פעיל" },
  { id: 8, code: "SIZ008", name: "34", description: "מידה 34", category: "מכנסיים", status: "פעיל" },
  { id: 9, code: "SIZ009", name: "36", description: "מידה 36", category: "מכנסיים", status: "פעיל" },
  { id: 10, code: "SIZ010", name: "38", description: "מידה 38", category: "מכנסיים", status: "לא פעיל" },
]

// מוק דאטה לחומרים
const materials = [
  { id: 1, code: "MAT001", name: "כותנה", description: "100% כותנה", status: "פעיל" },
  { id: 2, code: "MAT002", name: "פוליאסטר", description: "100% פוליאסטר", status: "פעיל" },
  { id: 3, code: "MAT003", name: "משולב", description: "60% כותנה, 40% פוליאסטר", status: "פעיל" },
  { id: 4, code: "MAT004", name: "צמר", description: "100% צמר", status: "פעיל" },
  { id: 5, code: "MAT005", name: "ג'ינס", description: "דנים", status: "פעיל" },
]

export default function AttributesPage() {
  const [activeTab, setActiveTab] = useState("colors")
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)

  // מצב עבור הוספת צבע חדש
  const [newColor, setNewColor] = useState({
    code: "",
    name: "",
    hex_code: "#000000",
    status: true,
  })

  // מצב עבור הוספת מידה חדשה
  const [newSize, setNewSize] = useState({
    code: "",
    name: "",
    description: "",
    category: "",
    status: true,
  })

  // מצב עבור הוספת חומר חדש
  const [newMaterial, setNewMaterial] = useState({
    code: "",
    name: "",
    description: "",
    status: true,
  })

  const handleAddAttribute = () => {
    // בפועל, כאן היינו שולחים את הנתונים לשרת
    if (activeTab === "colors") {
      console.log("הוספת צבע:", newColor)
      setNewColor({
        code: "",
        name: "",
        hex_code: "#000000",
        status: true,
      })
    } else if (activeTab === "sizes") {
      console.log("הוספת מידה:", newSize)
      setNewSize({
        code: "",
        name: "",
        description: "",
        category: "",
        status: true,
      })
    } else if (activeTab === "materials") {
      console.log("הוספת חומר:", newMaterial)
      setNewMaterial({
        code: "",
        name: "",
        description: "",
        status: true,
      })
    }

    // סגירת הדיאלוג
    setIsAddDialogOpen(false)
  }

  const renderAddDialog = () => {
    if (activeTab === "colors") {
      return (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">קוד צבע</Label>
              <Input
                id="code"
                placeholder="COL001"
                value={newColor.code}
                onChange={(e) => setNewColor({ ...newColor, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">שם צבע</Label>
              <Input
                id="name"
                placeholder="שם הצבע"
                value={newColor.name}
                onChange={(e) => setNewColor({ ...newColor, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="hex_code">קוד צבע (HEX)</Label>
            <div className="flex gap-2">
              <Input
                id="hex_code"
                placeholder="#000000"
                value={newColor.hex_code}
                onChange={(e) => setNewColor({ ...newColor, hex_code: e.target.value })}
              />
              <div className="w-10 h-10 rounded border" style={{ backgroundColor: newColor.hex_code }} />
            </div>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="status">צבע פעיל</Label>
            <Switch
              id="status"
              checked={newColor.status}
              onCheckedChange={(checked) => setNewColor({ ...newColor, status: checked })}
            />
          </div>
        </div>
      )
    } else if (activeTab === "sizes") {
      return (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">קוד מידה</Label>
              <Input
                id="code"
                placeholder="SIZ001"
                value={newSize.code}
                onChange={(e) => setNewSize({ ...newSize, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">שם מידה</Label>
              <Input
                id="name"
                placeholder="שם המידה"
                value={newSize.name}
                onChange={(e) => setNewSize({ ...newSize, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              placeholder="תיאור המידה"
              value={newSize.description}
              onChange={(e) => setNewSize({ ...newSize, description: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="category">קטגוריה</Label>
            <Select value={newSize.category} onValueChange={(value) => setNewSize({ ...newSize, category: value })}>
              <SelectTrigger>
                <SelectValue placeholder="בחר קטגוריה" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="shirts">חולצות</SelectItem>
                <SelectItem value="pants">מכנסיים</SelectItem>
                <SelectItem value="accessories">אביזרים</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="status">מידה פעילה</Label>
            <Switch
              id="status"
              checked={newSize.status}
              onCheckedChange={(checked) => setNewSize({ ...newSize, status: checked })}
            />
          </div>
        </div>
      )
    } else if (activeTab === "materials") {
      return (
        <div className="space-y-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="code">קוד חומר</Label>
              <Input
                id="code"
                placeholder="MAT001"
                value={newMaterial.code}
                onChange={(e) => setNewMaterial({ ...newMaterial, code: e.target.value })}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="name">שם חומר</Label>
              <Input
                id="name"
                placeholder="שם החומר"
                value={newMaterial.name}
                onChange={(e) => setNewMaterial({ ...newMaterial, name: e.target.value })}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">תיאור</Label>
            <Textarea
              id="description"
              placeholder="תיאור החומר"
              value={newMaterial.description}
              onChange={(e) => setNewMaterial({ ...newMaterial, description: e.target.value })}
            />
          </div>
          <div className="flex items-center justify-between">
            <Label htmlFor="status">חומר פעיל</Label>
            <Switch
              id="status"
              checked={newMaterial.status}
              onCheckedChange={(checked) => setNewMaterial({ ...newMaterial, status: checked })}
            />
          </div>
        </div>
      )
    }

    return null
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">ניהול מאפיינים</h1>
        <div className="flex gap-2">
          <Link href="/bulk-import">
            <Button variant="outline">
              <Upload className="mr-2 h-4 w-4" />
              ייבוא מאפיינים
            </Button>
          </Link>
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                הוסף {activeTab === "colors" ? "צבע" : activeTab === "sizes" ? "מידה" : "חומר"}
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  הוספת {activeTab === "colors" ? "צבע" : activeTab === "sizes" ? "מידה" : "חומר"} חדש
                </DialogTitle>
                <DialogDescription>
                  הזן את פרטי ה{activeTab === "colors" ? "צבע" : activeTab === "sizes" ? "מידה" : "חומר"} החדש
                </DialogDescription>
              </DialogHeader>
              {renderAddDialog()}
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
                  ביטול
                </Button>
                <Button onClick={handleAddAttribute}>
                  הוסף {activeTab === "colors" ? "צבע" : activeTab === "sizes" ? "מידה" : "חומר"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
        <TabsList>
          <TabsTrigger value="colors">צבעים</TabsTrigger>
          <TabsTrigger value="sizes">מידות</TabsTrigger>
          <TabsTrigger value="materials">חומרים</TabsTrigger>
        </TabsList>

        <TabsContent value="colors">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input placeholder="חיפוש לפי שם, קוד..." />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>קוד</TableHead>
                  <TableHead>שם צבע</TableHead>
                  <TableHead>קוד צבע</TableHead>
                  <TableHead>דוגמה</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {colors.map((color) => (
                  <TableRow key={color.id}>
                    <TableCell>{color.code}</TableCell>
                    <TableCell className="font-medium">{color.name}</TableCell>
                    <TableCell>{color.hex_code}</TableCell>
                    <TableCell>
                      <div className="w-6 h-6 rounded-full border" style={{ backgroundColor: color.hex_code }} />
                    </TableCell>
                    <TableCell>
                      <Badge variant={color.status === "פעיל" ? "default" : "secondary"}>{color.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>ערוך</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>מחק</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="sizes">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input placeholder="חיפוש לפי שם, קוד..." />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>קוד</TableHead>
                  <TableHead>שם מידה</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>קטגוריה</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sizes.map((size) => (
                  <TableRow key={size.id}>
                    <TableCell>{size.code}</TableCell>
                    <TableCell className="font-medium">{size.name}</TableCell>
                    <TableCell>{size.description}</TableCell>
                    <TableCell>{size.category}</TableCell>
                    <TableCell>
                      <Badge variant={size.status === "פעיל" ? "default" : "secondary"}>{size.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>ערוך</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>מחק</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>

        <TabsContent value="materials">
          <div className="flex flex-col sm:flex-row gap-4 mb-4">
            <div className="flex-1">
              <Input placeholder="חיפוש לפי שם, קוד..." />
            </div>
          </div>

          <div className="border rounded-md">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>קוד</TableHead>
                  <TableHead>שם חומר</TableHead>
                  <TableHead>תיאור</TableHead>
                  <TableHead>סטטוס</TableHead>
                  <TableHead className="w-12"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {materials.map((material) => (
                  <TableRow key={material.id}>
                    <TableCell>{material.code}</TableCell>
                    <TableCell className="font-medium">{material.name}</TableCell>
                    <TableCell>{material.description}</TableCell>
                    <TableCell>
                      <Badge variant={material.status === "פעיל" ? "default" : "secondary"}>{material.status}</Badge>
                    </TableCell>
                    <TableCell>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <MoreHorizontal className="h-4 w-4" />
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuLabel>פעולות</DropdownMenuLabel>
                          <DropdownMenuSeparator />
                          <DropdownMenuItem>
                            <Edit className="mr-2 h-4 w-4" />
                            <span>ערוך</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem className="text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <span>מחק</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

