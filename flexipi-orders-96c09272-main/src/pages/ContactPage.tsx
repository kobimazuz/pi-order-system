
import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/common/Navbar';
import Footer from '@/components/landing/Footer';
import { Mail, Phone, MapPin, CheckCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const contactFormSchema = z.object({
  name: z.string().min(2, { message: 'Name must be at least 2 characters.' }),
  email: z.string().email({ message: 'Invalid email address.' }),
  subject: z.string().min(5, { message: 'Subject must be at least 5 characters.' }),
  message: z.string().min(10, { message: 'Message must be at least 10 characters.' }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

const ContactPage = () => {
  const { t } = useTranslation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const { toast } = useToast();
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: '',
      email: '',
      subject: '',
      message: '',
    },
  });
  
  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    
    // Simulate API call
    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Form submitted:', data);
      
      setIsSuccess(true);
      form.reset();
      
      toast({
        title: t('pages.contact.form.success'),
        description: 'We will get back to you as soon as possible.',
        // Changed from 'success' to 'default' to match allowed variants
        variant: 'default',
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      
      toast({
        title: t('pages.contact.form.error'),
        description: 'Please try again later.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-1 bg-gray-50 dark:bg-darkgray-900">
        <div className="container-wide py-16">
          <div className="text-center mb-16">
            <h1 className="heading-primary mb-6">{t('pages.contact.title')}</h1>
            <p className="text-body max-w-2xl mx-auto">
              {t('pages.contact.subtitle')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 max-w-6xl mx-auto">
            {/* Contact Form */}
            <div className="lg:col-span-2 bg-white dark:bg-darkgray-800 rounded-xl p-8 shadow-md">
              {!isSuccess ? (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pages.contact.form.name')}</FormLabel>
                          <FormControl>
                            <Input placeholder="John Doe" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pages.contact.form.email')}</FormLabel>
                          <FormControl>
                            <Input type="email" placeholder="john@example.com" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="subject"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pages.contact.form.subject')}</FormLabel>
                          <FormControl>
                            <Input placeholder="Your inquiry subject" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    
                    <FormField
                      control={form.control}
                      name="message"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>{t('pages.contact.form.message')}</FormLabel>
                          <FormControl>
                            <Textarea 
                              placeholder="How can we help you?" 
                              className="resize-none min-h-[150px]"
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
                      {isSubmitting ? 'Sending...' : t('pages.contact.form.submit')}
                    </Button>
                  </form>
                </Form>
              ) : (
                <div className="text-center py-12">
                  <CheckCircle className="h-16 w-16 text-teal-500 mx-auto mb-6" />
                  <h3 className="text-2xl font-bold text-darkgray-500 dark:text-white mb-4">
                    {t('pages.contact.form.success')}
                  </h3>
                  <p className="text-darkgray-400 dark:text-gray-300 mb-6">
                    We will get back to you as soon as possible.
                  </p>
                  <Button 
                    onClick={() => setIsSuccess(false)}
                    className="bg-teal-500 hover:bg-teal-600 dark:bg-teal-600 dark:hover:bg-teal-700"
                  >
                    Send another message
                  </Button>
                </div>
              )}
            </div>
            
            {/* Contact Information */}
            <div className="bg-teal-500 dark:bg-teal-600 text-white rounded-xl p-8 shadow-md">
              <h3 className="text-xl font-bold mb-6">{t('pages.contact.contactInfo.title')}</h3>
              
              <div className="space-y-6">
                <div className="flex items-start">
                  <Mail className="h-6 w-6 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Email</p>
                    <p className="opacity-90">{t('pages.contact.contactInfo.email')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <Phone className="h-6 w-6 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <p className="opacity-90">{t('pages.contact.contactInfo.phone')}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <MapPin className="h-6 w-6 mr-3 mt-0.5" />
                  <div>
                    <p className="font-medium">Address</p>
                    <p className="opacity-90">{t('pages.contact.contactInfo.address')}</p>
                  </div>
                </div>
              </div>
              
              <div className="mt-8 pt-8 border-t border-white/20">
                <h3 className="text-xl font-bold mb-4">{t('pages.contact.supportHours.title')}</h3>
                <p className="opacity-90">{t('pages.contact.supportHours.hours')}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ContactPage;
