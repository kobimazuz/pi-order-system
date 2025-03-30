
import React from 'react';
import { useTranslation } from 'react-i18next';
import { FileText, Database, BarChart3, Download } from 'lucide-react';

const Features = () => {
  const { t } = useTranslation();

  const features = [
    {
      title: t('features.automatedPI.title'),
      description: t('features.automatedPI.description'),
      icon: <FileText className="text-teal-500" size={36} />,
    },
    {
      title: t('features.catalog.title'),
      description: t('features.catalog.description'),
      icon: <Database className="text-teal-500" size={36} />,
    },
    {
      title: t('features.tracking.title'),
      description: t('features.tracking.description'),
      icon: <BarChart3 className="text-teal-500" size={36} />,
    },
    {
      title: t('features.exports.title'),
      description: t('features.exports.description'),
      icon: <Download className="text-teal-500" size={36} />,
    },
  ];

  return (
    <section id="features" className="section-padding bg-gray-50 dark:bg-darkgray-800">
      <div className="container-wide">
        <div className="text-center mb-16">
          <h2 className="heading-secondary mb-4">{t('features.title')}</h2>
          <p className="text-body max-w-2xl mx-auto">
            {t('features.subtitle')}
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="bg-white dark:bg-darkgray-700 rounded-lg p-6 card-shadow flex flex-col"
            >
              <div className="mb-4">{feature.icon}</div>
              <h3 className="heading-tertiary mb-3">{feature.title}</h3>
              <p className="text-darkgray-400 dark:text-gray-300">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Features;
