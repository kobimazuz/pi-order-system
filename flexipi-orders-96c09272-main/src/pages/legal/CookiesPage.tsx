
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';

const CookiesPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-white dark:bg-darkgray-900">
        <div className="container-wide py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-primary mb-6">{t('pages.cookies.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t('pages.cookies.lastUpdated')}: 01/01/2023
            </p>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-darkgray-500 dark:text-gray-200 mb-8">
                {t('pages.cookies.introduction')}
              </p>
              
              {/* What are Cookies */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.cookies.sections.what.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.cookies.sections.what.content')}
              </p>

              {/* Types of Cookies We Use */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.cookies.sections.types.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.cookies.sections.types.content')}
              </p>

              {/* Control Your Cookies */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.cookies.sections.control.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.cookies.sections.control.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default CookiesPage;
