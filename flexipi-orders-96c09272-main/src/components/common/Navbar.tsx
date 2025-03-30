
import React, { useState } from 'react';
import { Menu, X } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router-dom';
import Logo from './Logo';
import Button from './Button';
import LanguageSwitcher from './LanguageSwitcher';
import { ThemeToggle } from './ThemeToggle';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { t } = useTranslation();
  const { user, signOut } = useAuth();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const navLinks = [
    { name: t('nav.features'), href: '/features' },
    { name: t('nav.howItWorks'), href: '/how-it-works' },
    { name: t('nav.pricing'), href: '/pricing' },
    { name: t('nav.faq'), href: '/faq' },
  ];

  return (
    <nav className="bg-white dark:bg-darkgray-800 py-4 sticky top-0 z-50 shadow-sm dark:shadow-md dark:shadow-black/20">
      <div className="container-wide flex justify-between items-center">
        <Logo size="md" />

        {/* Desktop Navigation */}
        <div className="hidden md:flex items-center space-x-8">
          <div className="flex space-x-6">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-darkgray-400 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 font-medium transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex items-center space-x-3">
            <ThemeToggle />
            <LanguageSwitcher />
            {user ? (
              <div className="flex items-center space-x-3">
                <span className="text-darkgray-400 dark:text-gray-300">{user.email}</span>
                <Button 
                  variant="outline" 
                  size="md"
                  onClick={signOut}
                >
                  {t('auth.logout')}
                </Button>
              </div>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="md"
                  as={Link}
                  to="/auth"
                >
                  {t('nav.login')}
                </Button>
                <Button 
                  variant="primary" 
                  size="md"
                  as={Link}
                  to="/auth?signup=true"
                >
                  {t('nav.getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden flex items-center space-x-2">
          <ThemeToggle />
          <LanguageSwitcher />
          <button
            className="text-darkgray-500 dark:text-white"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      <div
        className={cn(
          'fixed inset-0 top-16 bg-white dark:bg-darkgray-800 z-40 md:hidden overflow-y-auto transition-all duration-300 ease-in-out transform',
          isMenuOpen ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0'
        )}
      >
        <div className="container px-4 py-6 flex flex-col space-y-6">
          <div className="flex flex-col space-y-4">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-darkgray-400 dark:text-gray-300 hover:text-teal-500 dark:hover:text-teal-400 text-lg font-medium py-2 transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
          </div>
          <div className="flex flex-col space-y-3 pt-4">
            {user ? (
              <>
                <div className="text-darkgray-400 dark:text-gray-300 py-2">{user.email}</div>
                <Button 
                  variant="outline" 
                  size="lg" 
                  fullWidth
                  onClick={() => {
                    signOut();
                    setIsMenuOpen(false);
                  }}
                >
                  {t('auth.logout')}
                </Button>
              </>
            ) : (
              <>
                <Button 
                  variant="outline" 
                  size="lg" 
                  fullWidth
                  as={Link}
                  to="/auth"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.login')}
                </Button>
                <Button 
                  variant="primary" 
                  size="lg" 
                  fullWidth
                  as={Link}
                  to="/auth?signup=true"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {t('nav.getStarted')}
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
