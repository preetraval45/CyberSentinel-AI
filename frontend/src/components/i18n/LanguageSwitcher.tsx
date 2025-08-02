'use client'

import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { motion } from 'framer-motion';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸' },
  { code: 'es', name: 'Español', flag: '🇪🇸' },
  { code: 'fr', name: 'Français', flag: '🇫🇷' },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪' }
];

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  return (
    <div className="relative group">
      <motion.button
        className="flex items-center space-x-2 glass-button px-3 py-2"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
      >
        <Globe className="w-4 h-4" />
        <span className="text-sm">{languages.find(l => l.code === i18n.language)?.flag}</span>
      </motion.button>
      
      <div className="absolute right-0 mt-2 w-48 glass-card opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
        {languages.map((lang) => (
          <motion.button
            key={lang.code}
            onClick={() => i18n.changeLanguage(lang.code)}
            className={`w-full flex items-center space-x-3 px-4 py-2 text-left hover:bg-blue-500/20 transition-colors ${
              i18n.language === lang.code ? 'bg-blue-500/30' : ''
            }`}
            whileHover={{ x: 5 }}
          >
            <span className="text-lg">{lang.flag}</span>
            <span className="text-sm text-gray-300">{lang.name}</span>
          </motion.button>
        ))}
      </div>
    </div>
  );
}