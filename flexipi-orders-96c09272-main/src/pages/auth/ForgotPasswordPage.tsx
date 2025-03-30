
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { KeyRound, Mail } from 'lucide-react';

const forgotPasswordSchema = z.object({
  email: z.string().email({ message: 'Invalid email address' }),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { resetPassword } = useAuth();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isEmailSent, setIsEmailSent] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
  });

  const onSubmit = async (data: ForgotPasswordFormValues) => {
    setIsSubmitting(true);
    try {
      await resetPassword(data.email);
      setIsEmailSent(true);
    } catch (error) {
      console.error('Reset password error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8 bg-gray-50 dark:bg-darkgray-900">
        <div className="w-full max-w-md space-y-8 bg-white dark:bg-darkgray-800 p-8 rounded-xl shadow-md">
          {!isEmailSent ? (
            <>
              <div className="text-center">
                <div className="mx-auto w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                  <KeyRound className="h-8 w-8 text-teal-500" />
                </div>
                
                <h2 className="mt-6 text-3xl font-bold text-darkgray-500 dark:text-white">
                  {t('auth.resetPassword')}
                </h2>
                
                <p className="mt-2 text-sm text-darkgray-400 dark:text-gray-300">
                  {t('auth.resetPasswordDescription')}
                </p>
              </div>

              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>{t('auth.email')}</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="email@example.com" 
                            type="email" 
                            autoComplete="email"
                            disabled={isSubmitting}
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button
                    type="submit"
                    className="w-full bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? 'Sending...' : t('auth.resetPassword')}
                  </Button>
                  
                  <div className="text-center mt-4">
                    <Link 
                      to="/auth" 
                      className="text-sm text-teal-500 hover:text-teal-600 dark:text-teal-400 dark:hover:text-teal-300"
                    >
                      {t('auth.backToLogin')}
                    </Link>
                  </div>
                </form>
              </Form>
            </>
          ) : (
            <div className="text-center">
              <div className="mx-auto w-16 h-16 bg-teal-50 dark:bg-teal-900/30 rounded-full flex items-center justify-center">
                <Mail className="h-8 w-8 text-teal-500" />
              </div>
              
              <h2 className="mt-6 text-3xl font-bold text-darkgray-500 dark:text-white">
                {t('auth.resetPasswordSuccess')}
              </h2>
              
              <p className="mt-2 text-darkgray-400 dark:text-gray-300">
                {t('auth.resetPasswordSuccessDescription')}
              </p>
              
              <div className="mt-6">
                <Link 
                  to="/auth" 
                  className="inline-block w-full text-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                >
                  {t('auth.backToLogin')}
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ForgotPasswordPage;
