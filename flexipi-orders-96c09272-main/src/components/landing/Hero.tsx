
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import Button from '../common/Button';

const Hero = () => {
  const { t } = useTranslation();

  return (
    <section className="hero-gradient text-white py-20 md:py-28">
      <div className="container-wide">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="animate-fade-in-up">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 tracking-tight">
              {t('hero.title')}
            </h1>
            <p className="text-lg md:text-xl opacity-90 mb-8 max-w-lg">
              {t('hero.subtitle')}
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button 
                variant="secondary" 
                size="lg"
                icon={<ArrowRight size={20} />}
                as={Link}
                to="/auth?signup=true"
              >
                {t('hero.cta')}
              </Button>
              <Button 
                variant="outline" 
                size="lg"
                className="border-white text-white hover:bg-white/10 dark:hover:bg-white/5"
              >
                {t('hero.viewDemo')}
              </Button>
            </div>
          </div>
          <div className="hidden lg:block animate-fade-in">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-72 h-72 bg-orange-500 rounded-full opacity-20 blur-3xl"></div>
              <div className="relative bg-white bg-opacity-10 backdrop-blur-sm rounded-xl p-6 shadow-2xl border border-white/20">
                <div className="bg-white/10 rounded-lg p-4 mb-4">
                  <h3 className="text-lg font-semibold mb-2">{t('hero.orderDetails')}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>{t('hero.products')}</span>
                      <span className="font-medium">12</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('hero.totalUnits')}</span>
                      <span className="font-medium">1,250</span>
                    </div>
                    <div className="flex justify-between">
                      <span>{t('hero.cartons')}</span>
                      <span className="font-medium">48</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="font-bold">{t('hero.totalCost')}</span>
                      <span className="font-bold">$12,450.00</span>
                    </div>
                  </div>
                </div>
                <div className="flex justify-end mt-4">
                  <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-md text-sm font-medium transition-colors">
                    {t('hero.exportToExcel')}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
