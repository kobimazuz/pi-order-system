
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { Link } from 'react-router-dom';

const CareersPage = () => {
  const { t } = useTranslation();
  
  const benefits = t('pages.careers.benefits.items', { returnObjects: true }) as string[];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-teal-500 dark:bg-teal-600 text-white py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('pages.careers.title')}</h1>
              <p className="text-xl opacity-90">
                {t('pages.careers.subtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Why Join Us Section */}
        <section className="py-16 bg-white dark:bg-darkgray-900">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-secondary mb-8 text-center">{t('pages.careers.whyJoin.title')}</h2>
              <p className="text-lg text-darkgray-400 dark:text-gray-300 leading-relaxed">
                {t('pages.careers.whyJoin.content')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Benefits Section */}
        <section className="py-16 bg-gray-50 dark:bg-darkgray-800">
          <div className="container-wide">
            <h2 className="heading-secondary mb-12 text-center">{t('pages.careers.benefits.title')}</h2>
            
            <div className="max-w-3xl mx-auto bg-white dark:bg-darkgray-700 rounded-xl p-8 shadow-md">
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <Check className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                    <span className="text-darkgray-400 dark:text-gray-300">{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
        
        {/* Open Positions Section */}
        <section className="py-16 bg-white dark:bg-darkgray-900">
          <div className="container-wide">
            <h2 className="heading-secondary mb-12 text-center">{t('pages.careers.openings.title')}</h2>
            
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-lg text-darkgray-400 dark:text-gray-300 mb-8">
                {t('pages.careers.openings.noOpenings')}
              </p>
              
              <Button asChild className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700">
                <Link to="/contact">
                  {t('pages.careers.openings.submitResume')}
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default CareersPage;
