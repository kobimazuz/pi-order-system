const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function createModules() {
  const modules = [
    {
      id: 'products',
      name: 'products',
      label: 'מוצרים',
      description: 'ניהול מוצרים במערכת',
      status: 'active',
    },
    {
      id: 'orders',
      name: 'orders',
      label: 'הזמנות',
      description: 'ניהול הזמנות במערכת',
      status: 'active',
    },
    {
      id: 'suppliers',
      name: 'suppliers',
      label: 'ספקים',
      description: 'ניהול ספקים במערכת',
      status: 'active',
    },
    {
      id: 'categories',
      name: 'categories',
      label: 'קטגוריות',
      description: 'ניהול קטגוריות מוצרים',
      status: 'active',
    },
    {
      id: 'statistics',
      name: 'statistics',
      label: 'סטטיסטיקות',
      description: 'צפייה בנתונים סטטיסטיים',
      status: 'active',
    }
  ];

  try {
    for (const module of modules) {
      await prisma.module.create({
        data: module
      });
    }
    console.log('Basic modules created successfully');
  } catch (error) {
    console.error('Error creating modules:', error);
  } finally {
    await prisma.$disconnect();
  }
}

createModules().catch(console.error); 