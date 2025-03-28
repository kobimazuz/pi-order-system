"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
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
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Category as PrismaCategory } from "@prisma/client"

// הגדרת ממשקים מקומיים במקום ייבוא מ-@prisma/client
interface Category {
  id: string;
  userId: string;
  code: string;
  name: string;
  description?: string | null;
  parent?: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface Color {
  id: string;
  userId: string;
  code: string;
  name: string;
  hex_code: string;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface Size {
  id: string;
  userId: string;
  code: string;
  name: string;
  description?: string | null;
  category?: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

interface Material {
  id: string;
  userId: string;
  code: string;
  name: string;
  description?: string | null;
  status: string;
  created_at: Date;
  updated_at: Date;
}

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

export interface VariableFormProps {
  type: 'category' | 'color' | 'size' | 'material'
  items?: Category[]
  children: React.ReactNode
  defaultCode?: string
  isMainCategory?: boolean
  defaultValues?: any
  isEdit?: boolean
  onSubmit?: (formData: any) => Promise<{ success: boolean; error?: string }>
}

interface FormData {
  name: string
  code: string
  description?: string
  parent?: string | null
  status: boolean
  hex_code?: string
  category?: string | null
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

export function VariableForm({ type, items = [], children, defaultCode = '', isMainCategory = false, defaultValues, isEdit = false, onSubmit }: VariableFormProps) {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [formData, setFormData] = useState<FormData>(defaultValues ? {
    name: defaultValues.name || '',
    code: defaultValues.code || defaultCode || '',
    description: defaultValues.description || '',
    parent: defaultValues.parent || null,
    status: defaultValues.status === 'active',
    ...(type === 'color' && { hex_code: defaultValues.hex_code || '#000000' }),
    ...(type === 'size' && { category: defaultValues.category || null })
  } : {
    name: '',
    code: defaultCode || '',
    description: '',
    parent: null,
    status: true,
    ...(type === 'color' && { hex_code: '#000000' }),
    ...(type === 'size' && { category: null })
  })

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen)
    if (newOpen && defaultValues) {
      setFormData({
        name: defaultValues.name || '',
        code: defaultValues.code || defaultCode || '',
        description: defaultValues.description || '',
        parent: defaultValues.parent || null,
        status: defaultValues.status === 'active',
        ...(type === 'color' && { hex_code: defaultValues.hex_code || '#000000' }),
        ...(type === 'size' && { category: defaultValues.category || null })
      })
    } else if (newOpen) {
      setFormData({
        name: '',
        code: defaultCode || '',
        description: '',
        parent: null,
        status: true,
        ...(type === 'color' && { hex_code: '#000000' }),
        ...(type === 'size' && { category: null })
      })
    }
  }

  const fields = [
    {
      name: 'name',
      label: 'שם',
      type: 'text',
      required: true
    },
    {
      name: 'description',
      label: 'תיאור',
      type: 'text',
      required: false
    },
    ...(type === 'category' && !isMainCategory && (!isEdit || (isEdit && defaultValues?.parent)) ? [
      {
        name: 'parent',
        label: 'קטגוריית אב',
        type: 'select',
        required: true,
        options: items
          .filter(item => !item.parent && item.id !== defaultValues?.id)
          .map(item => ({
            value: item.id,
            label: item.name
          }))
      }
    ] : []),
    ...(type === 'color' ? [
      {
        name: 'hex_code',
        label: 'קוד צבע',
        type: 'color',
        required: true
      }
    ] : []),
    ...(type === 'size' ? [
      {
        name: 'category',
        label: 'קטגוריית מידה',
        type: 'text',
        required: false
      }
    ] : []),
    {
      name: 'status',
      label: 'פעיל',
      type: 'switch',
      required: true
    }
  ]

  const renderField = (field: any) => {
    const value = formData[field.name as keyof FormData]
    
    switch (field.type) {
      case 'text':
        return (
          <div className="grid gap-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Input
              id={field.name}
              value={value as string}
              onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
              required={field.required}
            />
          </div>
        )
      case 'select':
        return (
          <div className="grid gap-2" key={field.name}>
            <Label>{field.label}</Label>
            <Select
              value={value as string || 'none'}
              onValueChange={(value) => setFormData({ ...formData, [field.name]: value === 'none' ? null : value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="בחר קטגוריית אב" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">ללא קטגוריית אב</SelectItem>
                {field.options.map((option: any) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )
      case 'color':
        return (
          <div className="grid gap-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                id={field.name}
                value={value as string}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                className="w-20"
                required={field.required}
              />
              <Input
                type="text"
                value={value as string}
                onChange={(e) => setFormData({ ...formData, [field.name]: e.target.value })}
                placeholder="#000000"
                className="flex-1"
                required={field.required}
              />
            </div>
          </div>
        )
      case 'switch':
        return (
          <div className="flex items-center justify-between gap-2" key={field.name}>
            <Label htmlFor={field.name}>{field.label}</Label>
            <Switch
              id={field.name}
              checked={value as boolean}
              onCheckedChange={(checked) => setFormData({ ...formData, [field.name]: checked })}
            />
          </div>
        )
      default:
        return null
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!onSubmit) {
      console.error('No onSubmit handler provided')
      return
    }

    try {
      const result = await onSubmit(formData)

      if (!result.success) {
        throw new Error(result.error || 'Failed to create variable')
      }

      toast.success('נוצר בהצלחה')
      setOpen(false)
      setFormData({
        name: '',
        code: defaultCode || '',
        description: '',
        parent: null,
        status: true,
        ...(type === 'color' && { hex_code: '#000000' }),
        ...(type === 'size' && { category: null })
      })
      router.refresh()
    } catch (error) {
      console.error('Error creating variable:', error)
      toast.error(error instanceof Error ? error.message : 'שגיאה ביצירת משתנה')
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `עריכת ${fieldConfigs[type].title}` : `הוספת ${fieldConfigs[type].title} חדש`}
          </DialogTitle>
          <DialogDescription>
            {isEdit ? `ערוך את פרטי ה${fieldConfigs[type].title}` : `הוסף ${fieldConfigs[type].title} חדש למערכת`}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="code">מק"ט</Label>
              <Input
                id="code"
                value={formData.code}
                disabled
                readOnly
              />
            </div>
            {fields.map(renderField)}
          </div>
          <DialogFooter>
            <Button type="submit">{isEdit ? 'שמור' : 'הוסף'}</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
} 