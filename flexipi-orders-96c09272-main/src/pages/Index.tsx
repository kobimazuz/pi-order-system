
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Hero from '@/components/landing/Hero';
import Features from '@/components/landing/Features';
import HowItWorks from '@/components/landing/HowItWorks';
import Footer from '@/components/landing/Footer';

const Index = () => {
  const { t } = useTranslation();
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Hero />
      <Features />
      <HowItWorks />
      
      {/* Benefits Section */}
      <section className="section-padding bg-white dark:bg-darkgray-800">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="heading-secondary mb-4 text-5xl text-center">{t('benefits.title')}</h2>
            <p className="text-body max-w-2xl mx-auto">
              {t('benefits.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 text-center">
            <div className="p-6">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="heading-tertiary mb-2">{t('benefits.efficiency.title')}</h3>
              <p className="text-darkgray-400 dark:text-gray-300">
                {t('benefits.efficiency.description')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="heading-tertiary mb-2">{t('benefits.innovation.title')}</h3>
              <p className="text-darkgray-400 dark:text-gray-300">
                {t('benefits.innovation.description')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
              <h3 className="heading-tertiary mb-2">{t('benefits.transparency.title')}</h3>
              <p className="text-darkgray-400 dark:text-gray-300">
                {t('benefits.transparency.description')}
              </p>
            </div>
            
            <div className="p-6">
              <div className="w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-teal-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <h3 className="heading-tertiary mb-2">{t('benefits.reliability.title')}</h3>
              <p className="text-darkgray-400 dark:text-gray-300">
                {t('benefits.reliability.description')}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="bg-teal-500 dark:bg-teal-600 text-white py-16">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold mb-6">{t('cta.title')}</h2>
            <p className="text-lg md:text-xl mb-8 text-white/90">
              {t('cta.subtitle')}
            </p>
            <a href="/auth?signup=true" className="bg-orange-500 hover:bg-orange-600 text-white font-medium py-3 px-8 rounded-md text-lg transition-colors inline-block">
              {t('cta.button')}
            </a>
            <p className="mt-4 text-white/80">{t('cta.noCreditCard')}</p>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
