import React from 'react';
import { Send, Globe, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import Image from 'next/image'; 
import { useTranslations } from 'next-intl';
import { useLanguage } from '@/lib/useLanguage';

const Footer = () => {
  const t = useTranslations();
  const { locale, changeLanguage } = useLanguage();

  // Configuración de redes sociales
  const socialLinks = [
    {
      name: 'X (Twitter)',
      icon: Twitter,
      url: 'https://x.com/GLEMOIO',
    },
    {
      name: 'Instagram', 
      icon: Instagram,
      url: 'https://www.instagram.com/glemo_io/',
    },
    {
      name: 'LinkedIn',
      icon: Linkedin, 
      url: 'https://www.linkedin.com/company/107714928/',
    },
    {
      name: 'YouTube',
      icon: Youtube,
      url: 'https://www.youtube.com/@glemo-io',
    },
  ];

  return (
    <footer className="relative z-10 py-12 border-t border-elementBackground/50 backdrop-blur-md">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div>
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-md flex items-center justify-center">
                <Image src="/logos/logo.png" alt="GLEMO" width={32} height={32} />
              </div>
              <span className="text-lg font-bold">GLEMO</span>
            </div>
            <p className="text-textSecondary mb-6">
              {t('footer.description')}
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((social, i) => {
                const IconComponent = social.icon;
                return (
                  <a 
                    key={i} 
                    href={social.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-9 h-9 rounded-full bg-elementBackground flex items-center justify-center hover:bg-elementBackground/70 transition-colors group"
                    aria-label={social.name}
                  >
                    <IconComponent className="w-5 h-5 text-textSecondary group-hover:text-primary transition-colors" />
                  </a>
                );
              })}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.platform')}</h4>
            <ul className="space-y-3">
              {[t('footer.platformItems.0'), t('footer.platformItems.1'), t('footer.platformItems.2'), t('footer.platformItems.3')].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-textSecondary hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.resources')}</h4>
            <ul className="space-y-3">
              {[t('footer.resourceItems.0'), t('footer.resourceItems.1'), t('footer.resourceItems.2'), t('footer.resourceItems.3')].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-textSecondary hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">{t('footer.contact')}</h4>
            <p className="text-textSecondary mb-4">
              {t('footer.contactDescription')}
            </p>
            <div className="flex mb-6">
              <input 
                type="email" 
                placeholder={t('footer.emailPlaceholder')} 
                className="px-4 py-2 bg-elementBackground border border-white/10 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm flex-grow"
              />
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
            
            {/* Selector de idioma */}
            <div>
              <h5 className="text-sm font-semibold mb-3 flex items-center gap-2">
                <Globe className="w-4 h-4" />
                {t('footer.language')}
              </h5>
              <div className="flex gap-2">
                <button 
                  onClick={() => changeLanguage('es')}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    locale === 'es' 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-elementBackground text-textSecondary border-white/10 hover:border-primary/50'
                  }`}
                >
                  Español
                </button>
                <button 
                  onClick={() => changeLanguage('en')}
                  className={`px-3 py-1.5 text-xs rounded-md border transition-colors ${
                    locale === 'en' 
                      ? 'bg-primary text-white border-primary' 
                      : 'bg-elementBackground text-textSecondary border-white/10 hover:border-primary/50'
                  }`}
                >
                  English
                </button>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-elementBackground/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-textSecondary text-sm">
            © {new Date().getFullYear()} Glemo. {t('footer.copyright')}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-textSecondary hover:text-primary text-sm transition-colors">
              {t('footer.terms')}
            </a>
            <a href="#" className="text-textSecondary hover:text-primary text-sm transition-colors">
              {t('footer.privacy')}
            </a>
            <a href="#" className="text-textSecondary hover:text-primary text-sm transition-colors">
              {t('footer.cookies')}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

