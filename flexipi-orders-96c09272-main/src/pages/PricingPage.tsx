
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Check } from 'lucide-react';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { Link } from 'react-router-dom';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';

const PricingPage = () => {
  const { t } = useTranslation();
  const [annual, setAnnual] = useState(false);
  
  const toggleBilling = () => {
    setAnnual(!annual);
  };
  
  const discountPercentage = 20;
  
  const plans = [
    {
      name: t('pages.pricing.plans.free.name'),
      price: '0',
      description: t('pages.pricing.plans.free.description'),
      features: t('pages.pricing.plans.free.features', { returnObjects: true }) as string[],
      highlighted: false,
    },
    {
      name: t('pages.pricing.plans.pro.name'),
      price: annual ? (29 * (1 - discountPercentage / 100)).toString() : '29',
      description: t('pages.pricing.plans.pro.description'),
      features: t('pages.pricing.plans.pro.features', { returnObjects: true }) as string[],
      highlighted: true,
    },
    {
      name: t('pages.pricing.plans.business.name'),
      price: annual ? (99 * (1 - discountPercentage / 100)).toString() : '99',
      description: t('pages.pricing.plans.business.description'),
      features: t('pages.pricing.plans.business.features', { returnObjects: true }) as string[],
      highlighted: false,
    },
  ];
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 dark:bg-darkgray-900">
        <div className="container-wide py-16">
          <div className="text-center mb-16">
            <h1 className="heading-primary mb-6">{t('pages.pricing.title')}</h1>
            <p className="text-body max-w-2xl mx-auto mb-10">
              {t('pages.pricing.subtitle')}
            </p>
            
            {/* Billing toggle */}
            <div className="flex items-center justify-center space-x-4">
              <Label htmlFor="billing-toggle" className="text-sm font-medium">
                {t('pages.pricing.monthly')}
              </Label>
              <Switch
                id="billing-toggle"
                checked={annual}
                onCheckedChange={toggleBilling}
              />
              <div className="flex items-center">
                <Label htmlFor="billing-toggle" className="text-sm font-medium mr-2">
                  {t('pages.pricing.yearly')}
                </Label>
                <span className="bg-teal-100 dark:bg-teal-900 text-teal-800 dark:text-teal-200 text-xs font-medium px-2 py-1 rounded-full">
                  -{discountPercentage}%
                </span>
              </div>
            </div>
          </div>
          
          {/* Pricing cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <div 
                key={index}
                className={`bg-white dark:bg-darkgray-800 rounded-xl overflow-hidden shadow-lg transition-all duration-300 ${
                  plan.highlighted 
                    ? 'ring-2 ring-teal-500 scale-105 md:transform md:-translate-y-4' 
                    : 'hover:shadow-xl'
                }`}
              >
                {plan.highlighted && (
                  <div className="bg-teal-500 text-white text-center py-2 font-medium">
                    Popular Choice
                  </div>
                )}
                <div className="p-8">
                  <h3 className="text-2xl font-bold text-darkgray-500 dark:text-white mb-2">
                    {plan.name}
                  </h3>
                  <div className="flex items-baseline mb-5">
                    <span className="text-4xl font-bold text-darkgray-500 dark:text-white">${plan.price}</span>
                    <span className="text-gray-500 dark:text-gray-400 ml-2">/{annual ? 'year' : 'month'}</span>
                  </div>
                  <p className="text-darkgray-400 dark:text-gray-300 mb-8">
                    {plan.description}
                  </p>
                  
                  <Link 
                    to="/auth?signup=true"
                    className={`w-full block text-center py-3 px-4 rounded-md font-medium transition-colors ${
                      plan.highlighted
                        ? 'bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700 text-white'
                        : 'bg-gray-100 hover:bg-gray-200 dark:bg-darkgray-700 dark:hover:bg-darkgray-600 text-darkgray-500 dark:text-white'
                    }`}
                  >
                    {t('pages.pricing.cta')}
                  </Link>
                </div>
                
                <div className="border-t border-gray-100 dark:border-darkgray-700 p-8">
                  <h4 className="font-semibold text-darkgray-500 dark:text-white mb-5">
                    Features
                  </h4>
                  <ul className="space-y-4">
                    {plan.features.map((feature, idx) => (
                      <li key={idx} className="flex items-start">
                        <Check className="h-5 w-5 text-teal-500 mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-darkgray-400 dark:text-gray-300">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          
          <div className="text-center">
            <p className="text-darkgray-400 dark:text-gray-300">
              {t('pages.pricing.questions')}
            </p>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default PricingPage;
