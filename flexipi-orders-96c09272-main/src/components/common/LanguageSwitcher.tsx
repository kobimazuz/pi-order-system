
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation();

  const changeLanguage = (language: string) => {
    i18n.changeLanguage(language);
    // For RTL support when using Hebrew
    document.documentElement.dir = language === 'he' ? 'rtl' : 'ltr';
    document.documentElement.lang = language;
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center px-3 py-2 text-darkgray-400 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 focus:outline-none">
        <Globe size={20} className="mr-1" />
        <span className="hidden md:inline">{i18n.language === 'he' ? 'עב' : 'EN'}</span>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => changeLanguage('en')}>
          {t('language.en')}
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => changeLanguage('he')}>
          {t('language.he')}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default LanguageSwitcher;
