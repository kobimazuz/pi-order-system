
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { MailCheck } from 'lucide-react';

const VerifyEmailPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { user } = useAuth();

  // If user is already verified, redirect to home
  if (user?.email_confirmed_at) {
    navigate('/');
  }

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-darkgray-900">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-darkgray-800 p-8 rounded-xl shadow-md text-center">
          <div className="mx-auto w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
            <MailCheck className="h-8 w-8 text-teal-500" />
          </div>
          
          <h2 className="text-3xl font-bold text-darkgray-500 dark:text-white">
            {t('auth.verifyEmail')}
          </h2>
          
          <p className="text-darkgray-400 dark:text-gray-300">
            {t('auth.verifyEmailDescription')}
          </p>
          
          <div className="pt-4">
            <Button
              className="w-full"
              onClick={() => navigate('/auth')}
            >
              {t('auth.backToLogin')}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmailPage;
