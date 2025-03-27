"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import { useRouter } from "next/navigation"
import { Category, Color, Material, Size } from "@prisma/client"
import { toast } from "sonner"

// טיפוסים
type VariableType = 'category' | 'color' | 'size' | 'material'
type Variable = Category | Color | Size | Material

interface FormField {
  name: string
  label: string
  placeholder?: string
  type: 'text' | 'textarea' | 'color' | 'select' | 'switch'
  required?: boolean
}

interface FieldConfig {
  title: string
  fields: FormField[]
}

interface FormData {
  code: string
  name: string
  description?: string | null
  parent?: string | null
  status: string
  hex_code?: string
  category?: string | null
}

interface VariableFormProps {
  type?: VariableType
  item?: Variable
  items?: Category[]
  children?: React.ReactNode
}

// הגדרות שדות לפי סוג
const fieldConfigs: Record<VariableType, FieldConfig> = {
  category: {
    title: 'קטגוריה',
    fields: [
      { name: 'code', label: 'קוד', placeholder: 'CAT001', type: 'text', required: true },
      { name: 'name', label: 'שם', placeholder: 'שם הקטגוריה', type: 'text', required: true },
      { name: 'description', label: 'תיאור', placeholder: 'תיאור הקטגוריה', type: 'textarea' },
      { name: 'parent', label: 'קטגוריית אב', type: 'select' },
      { name: 'status', label: 'פעיל', type: 'switch' }
    ]
  },
  color: {
    title: 'צבע',
    fields: [
      { name: 'code', label: 'קוד', placeholder: 'COL001', type: 'text', required: true },
      { name: 'name', label: 'שם', placeholder: 'שם הצבע', type: 'text', required: true },
      { name: 'hex_code', label: 'קוד צבע', placeholder: '#000000', type: 'color', required: true },
      { name: 'status', label: 'פעיל', type: 'switch' }
    ]
  },
  size: {
    title: 'מידה',
    fields: [
      { name: 'code', label: 'קוד', placeholder: 'SIZ001', type: 'text', required: true },
      { name: 'name', label: 'שם', placeholder: 'שם המידה', type: 'text', required: true },
      { name: 'description', label: 'תיאור', placeholder: 'תיאור המידה', type: 'textarea' },
      { name: 'category', label: 'קטגוריית מידה', placeholder: 'למשל: בגדים, נעליים', type: 'text' },
      { name: 'status', label: 'פעיל', type: 'switch' }
    ]
  },
  material: {
    title: 'חומר',
    fields: [
      { name: 'code', label: 'קוד', placeholder: 'MAT001', type: 'text', required: true },
      { name: 'name', label: 'שם', placeholder: 'שם החומר', type: 'text', required: true },
      { name: 'description', label: 'תיאור', placeholder: 'תיאור החומר', type: 'textarea' },
      { name: 'status', label: 'פעיל', type: 'switch' }
    ]
  }
}

export function VariableForm({ type = 'category', item, items = [], children }: VariableFormProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [activeType, setActiveType] = useState<VariableType>(type)
  const [formData, setFormData] = useState<FormData>(() => {
    if (item) {
      return {
        ...item,
        status: item.status || 'active'
      } as FormData
    }
    return {
      code: '',
      name: '',
      description: '',
      status: 'active',
      ...(type === 'color' && { hex_code: '#000000' }),
      ...(type === 'category' && { parent: '' }),
      ...(type === 'size' && { category: '' })
    }
  })

  const isEditing = !!item

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault()
    setIsLoading(true)

    try {
      const endpoint = isEditing 
        ? `/api/${activeType}s?id=${item.id}` 
        : `/api/${activeType}s`

      const response = await fetch(endpoint, {
        method: isEditing ? "PATCH" : "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        throw new Error(isEditing ? `שגיאה בעדכון ה${fieldConfigs[activeType].title}` : `שגיאה בשמירת ה${fieldConfigs[activeType].title}`)
      }

      setIsOpen(false)
      router.refresh()
      toast.success(isEditing ? `ה${fieldConfigs[activeType].title} עודכן בהצלחה` : `ה${fieldConfigs[activeType].title} נוסף בהצלחה`)
    } catch (error) {
      console.error("שגיאה:", error)
      toast.error(isEditing ? `שגיאה בעדכון ה${fieldConfigs[activeType].title}` : `שגיאה בשמירת ה${fieldConfigs[activeType].title}`)
    } finally {
      setIsLoading(false)
    }
  }

  function renderField(field: FormField) {
    const value = formData[field.name as keyof FormData]
    
    switch (field.type) {
      case 'text':
        return (
          <Input
            id={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
            required={field.required}
          />
        )
      case 'textarea':
        return (
          <Textarea
            id={field.name}
            placeholder={field.placeholder}
            value={value || ''}
            onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
          />
        )
      case 'color':
        return (
          <div className="flex gap-2">
            <Input
              type="color"
              id={field.name}
              value={value || '#000000'}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              className="w-20"
              required={field.required}
            />
            <Input
              type="text"
              value={value || '#000000'}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              placeholder="#000000"
              className="flex-1"
              required={field.required}
            />
          </div>
        )
      case 'select':
        if (field.name === 'parent' && activeType === 'category') {
          // מיון הקטגוריות - קטגוריות ראשיות קודם
          const sortedItems = [...items].sort((a, b) => {
            if (!a.parent && b.parent) return -1
            if (a.parent && !b.parent) return 1
            return 0
          })

          // סינון קטגוריות שלא יכולות להיות הורה
          const availableParents = sortedItems.filter(cat => {
            // לא ניתן לבחור את הקטגוריה עצמה כהורה
            if (item && cat.id === item.id) return false
            
            // לא ניתן לבחור תת-קטגוריה כהורה
            if (item && cat.parent === item.id) return false
            
            return true
          })

          return (
            <Select
              value={value || ''}
              onValueChange={(value) => setFormData({ ...formData, [field.name]: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר קטגוריית אב (אופציונלי)" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="">ללא קטגוריית אב</SelectItem>
                {availableParents.map((cat) => (
                  <SelectItem 
                    key={cat.id} 
                    value={cat.id}
                    className={cat.parent ? "pr-6" : ""}
                  >
                    {cat.parent ? `└─ ${cat.name}` : cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )
        }
        return null
      case 'switch':
        return (
          <Switch
            id={field.name}
            checked={value === 'active'}
            onCheckedChange={(checked) => setFormData({ ...formData, [field.name]: checked ? 'active' : 'inactive' })}
          />
        )
      default:
        return null
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children || (
          <Button>
            <Plus className="mr-2 h-4 w-4" />
            {isEditing ? `ערוך ${fieldConfigs[activeType].title}` : `הוסף ${fieldConfigs[activeType].title}`}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {isEditing ? `עריכת ${fieldConfigs[activeType].title}` : `הוספת ${fieldConfigs[activeType].title} חדש`}
          </DialogTitle>
          <DialogDescription>
            {isEditing ? `ערוך את פרטי ה${fieldConfigs[activeType].title}` : `הזן את פרטי ה${fieldConfigs[activeType].title} החדש`}
          </DialogDescription>
        </DialogHeader>
        {!isEditing && (
          <Tabs value={activeType} onValueChange={(value) => setActiveType(value as VariableType)} className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="category">קטגוריות</TabsTrigger>
              <TabsTrigger value="color">צבעים</TabsTrigger>
              <TabsTrigger value="size">מידות</TabsTrigger>
              <TabsTrigger value="material">חומרים</TabsTrigger>
            </TabsList>
          </Tabs>
        )}
        <form onSubmit={onSubmit} className="space-y-4">
          {fieldConfigs[activeType].fields.map((field) => (
            <div key={field.name} className={field.type === 'switch' ? 'flex items-center justify-between' : 'space-y-2'}>
              <Label htmlFor={field.name}>{field.label}</Label>
              {renderField(field)}
            </div>
          ))}
          <DialogFooter>
            <Button variant="outline" type="button" onClick={() => setIsOpen(false)}>
              ביטול
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "שומר..." : isEditing ? `עדכן ${fieldConfigs[activeType].title}` : `הוסף ${fieldConfigs[activeType].title}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 