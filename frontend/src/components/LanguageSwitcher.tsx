import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { Button } from '@/components/ui/button';

const LanguageSwitcher: React.FC = () => {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language === 'en' ? 'vi' : 'en';
    i18n.changeLanguage(newLang);
  };

  return (
    <Button
      variant="ghost"
      size="sm"
      onClick={toggleLanguage}
      className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
    >
      <Globe className="w-4 h-4" />
      <span className="text-sm font-medium">
        {i18n.language === 'en' ? 'EN' : 'VI'}
      </span>
    </Button>
  );
};

export default LanguageSwitcher; 