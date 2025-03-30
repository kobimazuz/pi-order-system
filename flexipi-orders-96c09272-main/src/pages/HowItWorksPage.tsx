
import React from 'react';
import { useTranslation } from 'react-i18next';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const HowItWorksPage = () => {
  const { t } = useTranslation();

  // Get steps from translation files
  const steps = [
    {
      number: t('howItWorks.step1.number'),
      title: t('howItWorks.step1.title'),
      description: t('howItWorks.step1.description'),
      details: t('pages.howItWorks.step1Details', 
        "Begin by setting up your product catalog. Add each product with detailed information including SKU, name, description, images, pricing, dimensions, packaging details, and any other relevant specifications. Organize products into categories for easy access, and set custom attributes based on your business needs."),
    },
    {
      number: t('howItWorks.step2.number'),
      title: t('howItWorks.step2.title'),
      description: t('howItWorks.step2.description'),
      details: t('pages.howItWorks.step2Details', 
        "When it's time to place an order, create a new order and select the supplier. Browse your product catalog to add items to the order, specifying quantities for each product. The system automatically calculates totals, including quantities, cartons, and costs. Review all details before finalizing the order."),
    },
    {
      number: t('howItWorks.step3.number'),
      title: t('howItWorks.step3.title'),
      description: t('howItWorks.step3.description'),
      details: t('pages.howItWorks.step3Details', 
        "Once your order is ready, generate a professional Proforma Invoice with a single click. Choose from various templates or create a customized format that includes all necessary details. Export the PI to Excel for sharing with your suppliers via email, or use our direct integration options to send it directly through the platform."),
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1">
        {/* Hero Section */}
        <section className="bg-teal-500 dark:bg-teal-600 text-white py-20">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto text-center">
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('howItWorks.title')}</h1>
              <p className="text-xl opacity-90">
                {t('howItWorks.subtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Detailed Steps */}
        <section className="py-16 bg-white dark:bg-darkgray-900">
          <div className="container-wide">
            <div className="max-w-4xl mx-auto space-y-24">
              {steps.map((step, index) => (
                <div key={index} className="relative">
                  <div className="flex flex-col md:flex-row gap-8 items-start">
                    {/* Step number */}
                    <div className="bg-teal-500 dark:bg-teal-600 text-white text-2xl font-bold w-16 h-16 rounded-full flex items-center justify-center flex-shrink-0">
                      {step.number}
                    </div>
                    
                    <div>
                      <h2 className="text-3xl font-bold text-darkgray-500 dark:text-white mb-4">
                        {step.title}
                      </h2>
                      <p className="text-xl text-darkgray-400 dark:text-gray-300 mb-6">
                        {step.description}
                      </p>
                      <div className="bg-gray-50 dark:bg-darkgray-800 rounded-lg p-6 mb-8">
                        <p className="text-darkgray-400 dark:text-gray-300 leading-relaxed">
                          {step.details}
                        </p>
                      </div>
                      
                      {/* Illustration or screenshot placeholder */}
                      <div className="bg-gray-100 dark:bg-darkgray-700 rounded-xl p-8 h-64 flex items-center justify-center">
                        <p className="text-darkgray-400 dark:text-gray-300">{t('pages.howItWorks.stepIllustration', { number: step.number })}</p>
                      </div>
                    </div>
                  </div>
                  
                  {/* Connector (except for last item) */}
                  {index < steps.length - 1 && (
                    <div className="absolute left-8 top-24 h-24 w-0.5 bg-gray-200 dark:bg-darkgray-700 hidden md:block"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA Section */}
        <section className="py-16 bg-gray-50 dark:bg-darkgray-800 text-center">
          <div className="container-wide">
            <div className="max-w-3xl mx-auto">
              <h2 className="heading-secondary mb-8">{t('cta.title')}</h2>
              <p className="text-lg text-darkgray-400 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <Button asChild className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-lg py-6 px-8">
                <Link to="/auth?signup=true">
                  {t('howItWorks.cta')}
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

export default HowItWorksPage;
