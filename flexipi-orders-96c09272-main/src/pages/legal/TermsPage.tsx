
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';

const TermsPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-white dark:bg-darkgray-900">
        <div className="container-wide py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-primary mb-6">{t('pages.terms.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t('pages.terms.lastUpdated')}: 01/01/2023
            </p>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-darkgray-500 dark:text-gray-200 mb-8">
                {t('pages.terms.introduction')}
              </p>
              
              {/* Acceptance of Terms */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.terms.sections.acceptance.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.terms.sections.acceptance.content')}
              </p>

              {/* Changes to Terms */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.terms.sections.changes.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.terms.sections.changes.content')}
              </p>

              {/* User Account */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.terms.sections.account.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.terms.sections.account.content')}
              </p>

              {/* Privacy */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.terms.sections.privacy.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.terms.sections.privacy.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsPage;
