import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

const resources = {
  en: {
    translation: {
      "login": "Login",
      "email": "Email Address",
      "password": "Password",
      "dashboard": "Dashboard",
      "threats": "Active Threats",
      "vulnerabilities": "Vulnerabilities",
      "security_score": "Security Score",
      "ai_alerts": "AI Alerts",
      "welcome": "Welcome to CyberSentinel AI",
      "logout": "Logout"
    }
  },
  es: {
    translation: {
      "login": "Iniciar Sesión",
      "email": "Correo Electrónico",
      "password": "Contraseña",
      "dashboard": "Panel de Control",
      "threats": "Amenazas Activas",
      "vulnerabilities": "Vulnerabilidades",
      "security_score": "Puntuación de Seguridad",
      "ai_alerts": "Alertas de IA",
      "welcome": "Bienvenido a CyberSentinel AI",
      "logout": "Cerrar Sesión"
    }
  },
  fr: {
    translation: {
      "login": "Connexion",
      "email": "Adresse Email",
      "password": "Mot de Passe",
      "dashboard": "Tableau de Bord",
      "threats": "Menaces Actives",
      "vulnerabilities": "Vulnérabilités",
      "security_score": "Score de Sécurité",
      "ai_alerts": "Alertes IA",
      "welcome": "Bienvenue sur CyberSentinel AI",
      "logout": "Déconnexion"
    }
  },
  de: {
    translation: {
      "login": "Anmelden",
      "email": "E-Mail-Adresse",
      "password": "Passwort",
      "dashboard": "Dashboard",
      "threats": "Aktive Bedrohungen",
      "vulnerabilities": "Schwachstellen",
      "security_score": "Sicherheitsbewertung",
      "ai_alerts": "KI-Warnungen",
      "welcome": "Willkommen bei CyberSentinel AI",
      "logout": "Abmelden"
    }
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: 'en',
    debug: process.env.NODE_ENV === 'development',
    interpolation: {
      escapeValue: false
    }
  });

export default i18n;