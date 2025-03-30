
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';

const PrivacyPage = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-white dark:bg-darkgray-900">
        <div className="container-wide py-12">
          <div className="max-w-4xl mx-auto">
            <h1 className="heading-primary mb-6">{t('pages.privacy.title')}</h1>
            <p className="text-gray-500 dark:text-gray-400 mb-8">
              {t('pages.privacy.lastUpdated')}: 01/01/2023
            </p>
            
            <div className="prose dark:prose-invert max-w-none">
              <p className="text-lg text-darkgray-500 dark:text-gray-200 mb-8">
                {t('pages.privacy.introduction')}
              </p>
              
              {/* Information Collection */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.privacy.sections.collection.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.privacy.sections.collection.content')}
              </p>

              {/* Information Use */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.privacy.sections.use.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.privacy.sections.use.content')}
              </p>

              {/* Information Sharing */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.privacy.sections.sharing.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.privacy.sections.sharing.content')}
              </p>

              {/* Information Security */}
              <h2 className="text-2xl font-bold text-darkgray-500 dark:text-white mt-8 mb-4">
                {t('pages.privacy.sections.security.title')}
              </h2>
              <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                {t('pages.privacy.sections.security.content')}
              </p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PrivacyPage;
