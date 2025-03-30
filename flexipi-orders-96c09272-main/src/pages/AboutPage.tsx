
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';

const AboutPage = () => {
  const { t } = useTranslation();
  
  const values = t('pages.about.values.items', { returnObjects: true }) as Array<{
    title: string;
    content: string;
  }>;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-teal-500 dark:bg-teal-600 text-white py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('pages.about.title')}</h1>
              <p className="text-xl opacity-90">
                {t('pages.about.subtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Mission Section */}
        <section className="py-16 bg-white dark:bg-darkgray-900">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-secondary mb-8 text-center">{t('pages.about.mission.title')}</h2>
              <p className="text-lg text-darkgray-400 dark:text-gray-300 leading-relaxed">
                {t('pages.about.mission.content')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Story Section */}
        <section className="py-16 bg-gray-50 dark:bg-darkgray-800">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-secondary mb-8 text-center">{t('pages.about.story.title')}</h2>
              <p className="text-lg text-darkgray-400 dark:text-gray-300 leading-relaxed">
                {t('pages.about.story.content')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Team Section */}
        <section className="py-16 bg-white dark:bg-darkgray-900">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-secondary mb-8 text-center">{t('pages.about.team.title')}</h2>
              <p className="text-lg text-darkgray-400 dark:text-gray-300 leading-relaxed">
                {t('pages.about.team.content')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Values Section */}
        <section className="py-16 bg-gray-50 dark:bg-darkgray-800">
          <div className="container-wide">
            <h2 className="heading-secondary mb-12 text-center">{t('pages.about.values.title')}</h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {values.map((value, index) => (
                <div key={index} className="bg-white dark:bg-darkgray-700 p-6 rounded-lg shadow-md">
                  <h3 className="text-xl font-bold text-teal-500 mb-3">{value.title}</h3>
                  <p className="text-darkgray-400 dark:text-gray-300">{value.content}</p>
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </div>
  );
};

export default AboutPage;
