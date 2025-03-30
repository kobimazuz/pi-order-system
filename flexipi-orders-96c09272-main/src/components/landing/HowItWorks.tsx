
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';

const HowItWorks = () => {
  const { t } = useTranslation();

  const steps = [
    {
      number: t('howItWorks.step1.number'),
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
    },
    {
      number: t('howItWorks.step2.number'),
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
    },
    {
      number: t('howItWorks.step3.number'),
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
    },
  ];

  return (
    <section id="how-it-works" className="section-padding bg-white dark:bg-darkgray-900">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">{t('howItWorks.title')}</h2>
          <p className="text-body max-w-2xl mx-auto">
            {t('howItWorks.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {steps.map((step, index) => (
            <div 
              key={index}
              className="relative"
            >
              {/* Step number */}
              <div className="absolute -top-5 -left-5 bg-orange-500 text-white text-xl font-bold w-10 h-10 rounded-full flex items-center justify-center">
                {step.number}
              </div>
              
              {/* Step content */}
              <div className="bg-gray-50 dark:bg-darkgray-800 rounded-lg p-8 pt-10 h-full">
                <h3 className="heading-tertiary mb-3">{step.title}</h3>
                <p className="text-darkgray-400 dark:text-gray-300">{step.description}</p>
              </div>
              
              {/* Connector (except for last item) */}
              {index < steps.length - 1 && (
                <div className="hidden md:block absolute top-1/2 -right-4 transform -translate-y-1/2">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M5 12H19M19 12L12 5M19 12L12 19" stroke="#008F8C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                </div>
              )}
            </div>
          ))}
        </div>
        
        {/* Call to action */}
        <div className="mt-16 text-center">
          <Link to="/auth?signup=true" className="bg-teal-500 dark:bg-teal-600 hover:bg-teal-600 dark:hover:bg-teal-700 text-white font-medium py-3 px-6 rounded-md transition-colors inline-block">
            {t('howItWorks.cta')}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
