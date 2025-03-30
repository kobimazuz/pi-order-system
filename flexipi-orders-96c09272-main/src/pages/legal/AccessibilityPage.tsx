
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';

const AccessibilityPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-white dark:bg-darkgray-900">
        <div className="container-wide py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-primary mb-6">{t('pages.accessibility.title')}</h1>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-darkgray-500 dark:text-gray-200 mb-8">
                {t('pages.accessibility.introduction')}
              </p>
              
              {/* Accessibility Standards */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.accessibility.sections.standards.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.accessibility.sections.standards.content')}
              </p>

              {/* Accessibility Features */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.accessibility.sections.features.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.accessibility.sections.features.content')}
              </p>

              {/* Feedback */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.accessibility.sections.feedback.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.accessibility.sections.feedback.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AccessibilityPage;
