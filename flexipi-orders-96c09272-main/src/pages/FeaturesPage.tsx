
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Database, BarChart3, Download } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';

const FeaturesPage = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.automatedPI.title'),
      description: t('features.automatedPI.description'),
      icon: <FileText className="text-teal-500" size={36} />,
      details: "Our AI-powered system automates the creation of professional proforma invoices, ensuring accuracy and consistency across all your documents. Simply select your products, specify quantities, and let our system generate detailed PIs with all necessary information.",
    },
    {
      title: t('features.catalog.title'),
      description: t('features.catalog.description'),
      icon: <Database className="text-teal-500" size={36} />,
      details: "Manage your entire product inventory in one centralized location. Upload product images, set pricing tiers, add detailed specifications, and organize everything with custom categories and tags for easy access.",
    },
    {
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      icon: <BarChart3 className="text-teal-500" size={36} />,
      details: "Never lose track of an order again with our comprehensive tracking system. Monitor the status of all orders in real-time, receive automated notifications for key milestones, and maintain a complete history of all your supplier interactions.",
    },
    {
      title: t('features.exports.title'),
      description: t('features.exports.description'),
      icon: <Download className="text-teal-500" size={36} />,
      details: "Export your data in multiple formats including Excel, CSV, and PDF. Our custom export templates ensure your exported data matches your exact requirements, including product images, specifications, pricing, and more.",
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
              <h1 className="text-4xl md:text-5xl font-bold mb-6">{t('features.title')}</h1>
              <p className="text-xl opacity-90">
                {t('features.subtitle')}
              </p>
            </div>
          </div>
        </section>
        
        {/* Features Details */}
        <section className="py-16 bg-white dark:bg-darkgray-900">
          <div className="container-wide">
            <div className="space-y-24">
              {features.map((feature, index) => (
                <div 
                  key={index} 
                  className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
                    index % 2 === 1 ? 'lg:flex-row-reverse' : ''
                  }`}
                >
                  <div className={index % 2 === 1 ? 'lg:order-2' : ''}>
                    <div className="flex items-center mb-4">
                      <div className="mr-4">{feature.icon}</div>
                      <h2 className="text-3xl font-bold text-darkgray-500 dark:text-white">
                        {feature.title}
                      </h2>
                    </div>
                    <p className="text-xl text-darkgray-400 dark:text-gray-300 mb-6">
                      {feature.description}
                    </p>
                    <p className="text-darkgray-400 dark:text-gray-300 leading-relaxed">
                      {feature.details}
                    </p>
                  </div>
                  
                  <div className={`bg-gray-100 dark:bg-darkgray-800 rounded-xl p-8 h-80 flex items-center justify-center ${
                    index % 2 === 1 ? 'lg:order-1' : ''
                  }`}>
                    <div className="text-center">
                      {feature.icon && <div className="mx-auto w-16 h-16">{React.cloneElement(feature.icon, { size: 64 })}</div>}
                      <p className="mt-4 text-darkgray-400 dark:text-gray-300">Feature illustration</p>
                    </div>
                  </div>
                </div>
              ))}
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
      </div>
      <Footer />
    </div>
  );
};

export default FeaturesPage;
