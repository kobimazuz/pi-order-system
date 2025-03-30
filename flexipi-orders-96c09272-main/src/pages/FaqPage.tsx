
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Search } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

interface FaqItem {
  question: string;
  answer: string;
  category: string;
}

const FaqPage = () => {
  const { t } = useTranslation();
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('all');
  
  // Get FAQ items from translations
  const faqItems: FaqItem[] = [
    {
      question: t('pages.faq.questions.q1.question'),
      answer: t('pages.faq.questions.q1.answer'),
      category: 'general',
    },
    {
      question: t('pages.faq.questions.q2.question'),
      answer: t('pages.faq.questions.q2.answer'),
      category: 'billing',
    },
    {
      question: t('pages.faq.questions.q3.question'),
      answer: t('pages.faq.questions.q3.answer'),
      category: 'features',
    },
  ];
  
  // Filter FAQ items based on search query and active tab
  const filteredFaqs = faqItems.filter((faq) => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeTab === 'all' || faq.category === activeTab;
    
    return matchesSearch && matchesCategory;
  });
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 dark:bg-darkgray-900">
        <div className="container-wide py-16">
          <div className="text-center mb-16">
            <h1 className="heading-primary mb-6">{t('pages.faq.title')}</h1>
            <p className="text-body max-w-2xl mx-auto mb-8">
              {t('pages.faq.subtitle')}
            </p>
            
            {/* Search Bar */}
            <div className="max-w-md mx-auto relative mb-12">
              <Input
                type="text"
                placeholder={t('pages.faq.searchPlaceholder')}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 py-2 dark:bg-darkgray-800"
              />
              <Search className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
            </div>
          </div>
          
          {/* Category Tabs */}
          <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab} className="max-w-3xl mx-auto mb-8">
            <TabsList className="grid grid-cols-5 mb-6">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="general">{t('pages.faq.categories.general')}</TabsTrigger>
              <TabsTrigger value="account">{t('pages.faq.categories.account')}</TabsTrigger>
              <TabsTrigger value="features">{t('pages.faq.categories.features')}</TabsTrigger>
              <TabsTrigger value="billing">{t('pages.faq.categories.billing')}</TabsTrigger>
            </TabsList>
          </Tabs>
          
          {/* FAQ Accordion */}
          <div className="max-w-3xl mx-auto bg-white dark:bg-darkgray-800 rounded-xl shadow-md p-6">
            {filteredFaqs.length > 0 ? (
              <Accordion type="single" collapsible className="w-full">
                {filteredFaqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`}>
                    <AccordionTrigger className="text-left text-lg font-medium text-darkgray-500 dark:text-white hover:text-teal-500 dark:hover:text-teal-400">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-darkgray-400 dark:text-gray-300">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="text-center py-8">
                <p className="text-darkgray-400 dark:text-gray-300">
                  {t('pages.faq.noResults')}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default FaqPage;
