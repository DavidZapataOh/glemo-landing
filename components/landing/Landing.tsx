"use client"
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { motion, Variants } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import dynamic from 'next/dynamic';
import { ChevronDown, ArrowRight, Star, ShieldCheck, ChevronRight, FileText, Link, Zap, Search, Trophy, Plug, Settings, Building2, User, Eye, Award, Hand, Palette } from 'lucide-react';
import Image from 'next/image';
import Footer from '@/components/common/Footer';
import InteractiveButton from './InteractiveButton';
import { useTranslations } from 'next-intl';
const ParticleEffect = dynamic(() => import('./ParticleEffect'), { ssr: false });
const GlowEffect = dynamic(() => import('./GlowEffect'), { ssr: false });
const Certificate3D = dynamic(() => import('./Certificate3D'), { ssr: false });
const Gallery3D = dynamic(() => import('./Gallery3D'), { ssr: false });

const Landing = () => {
  const t = useTranslations();
  const featuresRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLDivElement>(null);
  const ecosystemRef = useRef<HTMLDivElement>(null);
  const toolsRef = useRef<HTMLDivElement>(null);
  const [currentSection, setCurrentSection] = useState('hero');
  const [typedWord, setTypedWord] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [wordIndex, setWordIndex] = useState(0);
  const words = useMemo(() => [t('hero.skills'), t('hero.expertise'), t('hero.knowledge'), t('hero.achievements')], []);
  const typingSpeed = 150;
  const deletingSpeed = 100;
  const pauseSpeed = 1500;
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      gsap.registerPlugin(ScrollTrigger);
      
      const cards = document.querySelectorAll('.feature-card');
      
        gsap.fromTo(
        cards,
          { opacity: 0, y: 50 },
          { 
            opacity: 1, 
            y: 0, 
            duration: 0.8,
          stagger: 0.2,
            scrollTrigger: {
              trigger: '.features-section',
              start: 'top 70%',
              once: true, 
            }
          }
        );
      
      const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setCurrentSection(entry.target.id);
          }
        });
      }, { threshold: 0.5 });
      
      const sections = document.querySelectorAll('section[id]');
      sections.forEach(section => observer.observe(section));
      
      return () => {
        sections.forEach(section => observer.unobserve(section));
      };
    }
  }, []);

  useEffect(() => {
    const currentWord = words[wordIndex];
    
    const handleTyping = () => {
      if (isDeleting) {
        // Borrar letras
        setTypedWord(currentWord.substring(0, typedWord.length - 1));
        
        // Cuando se borra completamente, cambiar al siguiente
        if (typedWord === "") {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      } else {
        // Escribir letras
        setTypedWord(currentWord.substring(0, typedWord.length + 1));
        
        // Cuando se completa la palabra, esperar y luego borrar
        if (typedWord === currentWord) {
          setTimeout(() => {
            setIsDeleting(true);
          }, pauseSpeed);
          return;
        }
      }
    };

    const timer = setTimeout(
      handleTyping, 
      isDeleting ? deletingSpeed : typingSpeed
    );

    return () => clearTimeout(timer);
  }, [typedWord, isDeleting, wordIndex, words]);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: {
        type: 'spring',
        stiffness: 100
      }
    }
  };

  const memorizedCertificate = useMemo(() => <Certificate3D />, []);

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Navegación fija */}
      <nav className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-white/10">
        <div className="container mx-auto flex items-center justify-between px-4 py-3">
          <div className="flex items-center space-x-1">
            <motion.div
              className="w-10 h-10 bg-primary rounded-md flex items-center justify-center"
              whileHover={{ rotate: 5 }}
            >
              <Image src="/logos/logo.png" alt="GLEMO" width={32} height={32} />
            </motion.div>
            <span className="text-lg font-bold">GLEMO</span>
          </div>
          
          <div className="hidden md:flex space-x-6">
            {[
              { key: 'home', label: t('nav.home') },
              { key: 'features', label: t('nav.features') },
              { key: 'ecosystem', label: t('nav.ecosystem') },
              { key: 'tools', label: t('nav.tools') }
            ].map((item, index) => (
              <motion.a
                key={index}
                href={`#${item.key}`}
                className={`text-sm ${currentSection === item.key ? 'text-primary' : 'text-textSecondary'} hover:text-primary transition-colors`}
                whileHover={{ y: -2 }}
              >
                {item.label}
              </motion.a>
            ))}
          </div>
          
          <InteractiveButton variant="gradient" size="sm">
            <a href="https://app.glemo.io" className="flex items-center">
            {t('nav.login')} <ChevronRight className="ml-1 w-4 h-4" />
            </a>
          </InteractiveButton>
        </div>
      </nav>
      
      <section id="home" ref={heroRef} className="relative pt-24 overflow-hidden min-h-screen flex items-center">
        <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 z-0 opacity-40">
          <ParticleEffect />
          </div>
          
          <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/10 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-1/4 h-1/3 bg-secondary/10 rounded-full blur-[120px]"></div>
        </div>
        
        <div className="relative z-10 container mx-auto px-4 flex flex-col lg:flex-row items-center justify-between gap-16">
          <motion.div 
            className="flex flex-col max-w-xl"
            initial="hidden"
            animate="visible"
            variants={containerVariants}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6 }}
              className="mb-8"
            >
              <div className="inline-block p-px bg-primary rounded-full backdrop-blur-xl">
                <div className="bg-background/80 rounded-full px-4 py-1.5">
                  <div className="text-transparent bg-clip-text bg-primary font-medium text-sm">
                    {t('hero.badge')}
                  </div>
                </div>
              </div>
            </motion.div>
            
            <motion.h1 
              variants={itemVariants}
              className="text-5xl md:text-7xl font-extrabold mb-6 leading-tight"
            >
              {t('hero.title')} <span className="text-transparent bg-clip-text bg-primary"> {t('hero.verify')} </span>{" "}
              <span className="whitespace-nowrap">
                {t('hero.your')}{" "}
              <span className="relative inline-block">
                  <span className="text-transparent bg-clip-text bg-primary whitespace-nowrap">
                  {typedWord}
                  <motion.span 
                    animate={{ opacity: [0, 1, 0] }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block ml-1 w-[2px] h-[1em] bg-primary"
                  />
                </span>
                <motion.div 
                    className="absolute -bottom-2 left-0 right-0 h-1 bg-primary"
                  initial={{ width: 0 }}
                  animate={{ width: "100%" }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                />
                </span>
              </span>
            </motion.h1>
            
            <motion.p 
              variants={itemVariants}
              className="text-xl mb-10 text-textSecondary"
            >
              {t('hero.description')}
            </motion.p>
            
            <motion.div 
              variants={itemVariants}
              className="flex flex-col sm:flex-row gap-4"
            >
              <a href="https://app.glemo.io">
                <InteractiveButton variant="gradient" size="lg">
                  {t('hero.createTemplate')}
                </InteractiveButton>
              </a>
              <motion.a 
                href="https://app.glemo.io/verify"
                className="px-8 py-2 flex items-center justify-center border border-white/10 rounded-lg hover:bg-elementBackground/50 transition-all backdrop-blur-sm"
                whileHover={{ scale: 1.05, backgroundColor: "rgba(255,255,255,0.05)" }}
                  whileTap={{ scale: 0.98 }}
                >
                {t('hero.verifyCertificate')}
              </motion.a>
            </motion.div>
            
            <motion.div 
              variants={itemVariants}
              className="mt-12 flex items-center gap-6 text-textSecondary text-sm"
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                {t('hero.secureVerification')}
              </div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-primary" />
                +150 {t('hero.certificatesIssued')}
              </div>
            </motion.div>
          </motion.div>
          
          <motion.div 
            className="relative w-full max-w-xl aspect-[4/3]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            <div className="w-full h-full rounded-xl relative">
              {memorizedCertificate}
              
              <motion.div 
                className="absolute -bottom-5 -right-5 bg-elementBackground border border-elementBackground p-3 rounded-xl shadow-xl flex items-center gap-2 text-sm backdrop-blur-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 1.2, duration: 0.5 }}
              >
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                {t('hero.blockchainTechnology')}
                </motion.div>
              
                <motion.div 
                className="absolute -left-4 top-1/3 bg-elementBackground/80 backdrop-blur-md border border-white/10 p-4 rounded-xl shadow-xl max-w-[180px]"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 1.3, duration: 0.5 }}
              >
                <div className="text-xs text-textSecondary mb-1">{t('hero.features')}</div>
                <div className="text-sm font-medium mb-3">{t('hero.verifiableCredentials')}</div>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-primary/20 text-primary px-2 py-1 rounded-full">{t('hero.secure')}</span>
                  <span className="text-xs bg-secondary/20 text-secondary px-2 py-1 rounded-full">{t('hero.permanent')}</span>
                </div>
                </motion.div>
            </div>
            </motion.div>
            
            <motion.div 
              className="absolute left-0 right-0 bottom-10 mx-auto flex justify-center items-center"
              animate={{ 
                y: [0, 10, 0],
                opacity: [0.5, 1, 0.5]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
              }}
            >
            <a href="#features" className="flex flex-col items-center">
              <p className="text-textSecondary text-sm mb-2">{t('hero.discoverMore')}</p>
              <ChevronDown className="h-5 w-5 text-primary" />
            </a>
          </motion.div>
        </div>
      </section>
      
      <section id="features" ref={featuresRef} className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-elementBackground/30 -z-10"></div>
        <div className="absolute top-20 left-10 w-96 h-96 bg-primary/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-secondary/5 rounded-full blur-[120px] -z-10"></div>
        
        <GlowEffect />
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-16 max-w-2xl mx-auto">
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <span className="text-transparent bg-clip-text bg-primary">
                {t('features.title')}
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg text-textSecondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('features.description')}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 features-section">
          {[
            {
              icon: FileText,
              title: t('features.items.customizable.title'),
              description: t('features.items.customizable.description'),
              color: "from-primary/20 to-primary/5"
            },
            {
              icon: Link,
              title: t('features.items.blockchain.title'),
              description: t('features.items.blockchain.description'),
              color: "from-secondary/20 to-secondary/5"
            },
            {
              icon: Zap,
              title: t('features.items.mass.title'),
              description: t('features.items.mass.description'),
              color: "from-primary/20 to-secondary/5"
            },
            {
              icon: Search,
              title: t('features.items.verification.title'),
              description: t('features.items.verification.description'),
              color: "from-secondary/20 to-primary/5"
            },
            {
              icon: Trophy,
              title: t('features.items.gallery.title'),
              description: t('features.items.gallery.description'),
              color: "from-primary/20 to-primary/5"
            },
            {
              icon: Plug,
              title: t('features.items.api.title'),
              description: t('features.items.api.description'),
              color: "from-secondary/20 to-secondary/5"
            }
          ].map((feature, index) => {
            const IconComponent = feature.icon;
            return (
            <motion.div 
              key={index}
                className="feature-card backdrop-blur-md border border-white/10 p-8 rounded-2xl transition-all duration-300 overflow-hidden"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-br opacity-20 rounded-full w-16 h-16 -z-10" style={{ background: `linear-gradient(to bottom right, ${feature.color.split(" ")[0].replace("from-", "")}, ${feature.color.split(" ")[1].replace("to-", "")})` }}></div>
                  <div className="w-16 h-16 flex items-center justify-center mb-5 relative">
                    <IconComponent className="w-8 h-8 text-primary" />
                </div>
              </div>
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-textSecondary mb-6">
                {feature.description}
              </p>
              <motion.div 
                className="w-full h-1.5 rounded-full overflow-hidden"
                initial={{ width: 0 }}
                whileInView={{ width: "100%" }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 + index * 0.1, duration: 0.8 }}
              >
                <div className={`w-full h-full bg-gradient-to-r ${feature.color}`}></div>
              </motion.div>
            </motion.div>
            );
          })}
        </div>
          
          <motion.div 
            className="mt-20 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <a href="https://app.glemo.io">
              <InteractiveButton
                variant="gradient"
                size="lg"
                className="group"
              >
                {t('features.startNow')}
                <motion.div
                  className="ml-2"
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight className="h-5 w-5" />
                </motion.div>
              </InteractiveButton>
            </a>
          </motion.div>
        </div>
      </section>
      
      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-elementBackground/30 -z-10"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-primary/5 rounded-full blur-[150px] -z-5"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.span 
              className="inline-block text-sm font-medium bg-clip-text text-transparent bg-primary tracking-wider mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('gallery.badge')}
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('gallery.title')} <span className="text-transparent bg-clip-text bg-primary">
                {t('gallery.gallery')}
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg text-textSecondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('gallery.description')}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 items-center">
            {/* Reemplazar esto en la sección Digital Gallery */}
            <div className="lg:col-span-3 relative h-96 lg:h-[550px] rounded-2xl overflow-hidden backdrop-blur-sm border border-white/10">
              <motion.div
                className="absolute inset-0 z-10"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Gallery3D />
              </motion.div>
              
              {/* Botón interactivo */}
              <motion.div
                className="absolute bottom-6 right-6 p-3 bg-elementBackground/80 backdrop-blur-md border border-white/10 rounded-full shadow-lg z-20"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                  <ArrowRight className="w-5 h-5 text-white" />
                </div>
              </motion.div>
            </div>
            
            <div className="lg:col-span-2 space-y-6">
              {[
                {
                  title: t('gallery.personalizedRoom.title'),
                  description: t('gallery.personalizedRoom.description'),
                  icon: Award,
                  color: "from-primary/20 to-primary/5"
                },
                {
                  title: t('gallery.interactive.title'),
                  description: t('gallery.interactive.description'),
                  icon: Hand,
                  color: "from-secondary/20 to-secondary/5"
                },
                {
                  title: t('gallery.customizable.title'),
                  description: t('gallery.customizable.description'),
                  icon: Palette,
                  color: "from-primary/20 to-secondary/5"
                }
              ].map((feature, index) => {
                const IconComponent = feature.icon;
                return (
                <motion.div 
                  key={index}
                    className="backdrop-blur-md border border-white/10 p-6 rounded-2xl transition-all duration-300 overflow-hidden"
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="flex gap-5 items-start">
                      {/* Icon container */}
                      <div className="relative">
                        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.color} flex items-center justify-center`}>
                          <IconComponent className="w-6 h-6 text-white" />
                    </div>
                        {/* Decorative element */}
                        <div className={`absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gradient-to-br ${feature.color} opacity-60`}></div>
                      </div>
                      
                      {/* Content */}
                      <div className="flex-1">
                        <h3 className="text-xl font-bold mb-2">
                          {feature.title}
                        </h3>
                        <p className="text-textSecondary text-sm leading-relaxed">
                          {feature.description}
                        </p>
                    </div>
                  </div>
                </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden" id="ecosystem" ref={ecosystemRef}>
        <div className="absolute inset-0 bg-gradient-to-b from-background/50 via-elementBackground/20 to-background/70 -z-10"></div>
        <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-primary/5 rounded-full blur-[150px] -z-5"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.span 
              className="inline-block text-sm font-medium bg-clip-text text-transparent bg-primary tracking-wider mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('ecosystem.badge')}
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              {t('ecosystem.title')} <span className="text-transparent bg-clip-text bg-primary">
                {t('ecosystem.certificates')}
              </span>
            </motion.h2>
            <motion.p 
              className="text-lg text-textSecondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('ecosystem.description')}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {[
              {
                title: t('ecosystem.types.certificates.title'),
                description: t('ecosystem.types.certificates.description'),
                features: [t('ecosystem.types.certificates.features.0'), t('ecosystem.types.certificates.features.1'), t('ecosystem.types.certificates.features.2'), t('ecosystem.types.certificates.features.3')],
                visualColor: "from-blue-500/20 to-primary/20",
                accentColor: "bg-blue-500/10",
                visual: (
                  <div className="w-48 h-32 bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border-2 border-blue-200 shadow-lg relative overflow-hidden">
                    {/* Certificate Header */}
                    <div className="absolute top-2 left-2 right-2 h-8 bg-gradient-to-r from-blue-600 to-blue-700 rounded-t flex items-center justify-center">
                      <div className="w-6 h-6 bg-white/20 rounded-full flex items-center justify-center">
                        <div className="w-3 h-3 bg-white rounded-full"></div>
                      </div>
                    </div>
                    
                    {/* Certificate Content */}
                    <div className="pt-12 px-3 pb-2 h-full flex flex-col justify-between">
                      <div>
                        <div className="text-xs font-bold text-blue-800 mb-1">CERTIFICATE OF COMPLETION</div>
                        <div className="text-xs text-blue-700 mb-2">Blockchain Development Course</div>
                        <div className="text-xs text-blue-600">Issued to: John Doe</div>
                      </div>
                      
                      {/* Certificate Footer */}
                      <div className="flex justify-between items-end">
                        <div className="text-xs text-blue-500">Date: 2024</div>
                        <div className="w-8 h-6 bg-blue-200 rounded flex items-center justify-center">
                          <div className="w-4 h-4 bg-blue-400 rounded-sm"></div>
                        </div>
                      </div>
                    </div>
                    
                    {/* Decorative elements */}
                    <div className="absolute top-1 right-1 w-2 h-2 bg-blue-300 rounded-full"></div>
                    <div className="absolute bottom-1 left-1 w-1 h-1 bg-blue-400 rounded-full"></div>
                  </div>
                )
              },
              {
                title: t('ecosystem.types.badges.title'),
                description: t('ecosystem.types.badges.description'),
                features: [t('ecosystem.types.badges.features.0'), t('ecosystem.types.badges.features.1'), t('ecosystem.types.badges.features.2'), t('ecosystem.types.badges.features.3')],
                visualColor: "from-purple-500/20 to-pink-500/20",
                accentColor: "bg-purple-500/10",
                visual: (
                  <div className="w-32 h-32 bg-gradient-to-br from-purple-400 to-pink-400 rounded-full shadow-lg relative overflow-hidden">
                    {/* Badge outer ring */}
                    <div className="absolute inset-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full"></div>
                    
                    {/* Badge inner content */}
                    <div className="absolute inset-4 bg-gradient-to-br from-purple-300 to-pink-300 rounded-full flex flex-col items-center justify-center">
                      {/* Badge icon */}
                      <div className="w-8 h-8 bg-white/30 rounded-full flex items-center justify-center mb-1">
                        <div className="w-5 h-5 bg-white rounded-full flex items-center justify-center">
                          <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        </div>
                      </div>
                      
                      {/* Badge text */}
                      <div className="text-xs font-bold text-white text-center">
                        <div>SKILL</div>
                        <div className="text-xs">MASTER</div>
                      </div>
                    </div>
                    
                    {/* Badge decorative elements */}
                    <div className="absolute top-1 right-1 w-3 h-3 bg-white/40 rounded-full"></div>
                    <div className="absolute bottom-1 left-1 w-2 h-2 bg-white/30 rounded-full"></div>
                    <div className="absolute top-1/2 left-0 w-1 h-1 bg-white/50 rounded-full"></div>
                    <div className="absolute top-1/2 right-0 w-1 h-1 bg-white/50 rounded-full"></div>
                  </div>
                )
              }
            ].map((item, index) => {
              return (
              <motion.div 
                key={index}
                  className="group relative backdrop-blur-md border border-white/10 rounded-3xl overflow-hidden bg-elementBackground/30"
                  initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1, ease: "easeOut" }}
                >
                  {/* Visual Section - Takes up 60% of the card */}
                  <div className={`h-64 p-8 relative bg-gradient-to-br ${item.visualColor} overflow-hidden`}>
                    {/* Background pattern */}
                    <div className="absolute inset-0 opacity-10">
                      <div className="absolute top-8 right-8 w-32 h-32 rounded-full bg-white/20 blur-3xl"></div>
                      <div className="absolute bottom-8 left-8 w-24 h-24 rounded-full bg-white/20 blur-2xl"></div>
                    </div>
                    
                    {/* Certificate/Badge representation with mouse follow effect */}
                    <div className="relative z-10 flex items-center justify-center h-full">
                      <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.3, delay: 0.2, ease: "easeOut" }}
                        className="relative"
                        whileHover="hover"
                        variants={{
                          hover: {
                            transition: { duration: 0.3, ease: "easeOut" }
                          }
                        }}
                        onMouseMove={(e) => {
                          const rect = e.currentTarget.getBoundingClientRect();
                          const x = e.clientX - rect.left;
                          const y = e.clientY - rect.top;
                          const centerX = rect.width / 2;
                          const centerY = rect.height / 2;
                          const rotateX = (y - centerY) / 10;
                          const rotateY = (centerX - x) / 10;
                          
                          e.currentTarget.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(10px)`;
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
                        }}
                        style={{ transformStyle: 'preserve-3d' }}
                      >
                        {item.visual}
                        
                        {/* Floating elements around the visual */}
                        <motion.div 
                          className="absolute -top-2 -right-2 w-4 h-4 bg-white/20 rounded-lg"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 0.4, ease: "easeOut" }}
                        ></motion.div>
                        <motion.div 
                          className="absolute -bottom-2 -left-2 w-3 h-3 bg-white/30 rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 0.5, ease: "easeOut" }}
                        ></motion.div>
                        <motion.div 
                          className="absolute top-1/2 -left-4 w-2 h-2 bg-white/25 rounded-full"
                          initial={{ opacity: 0, scale: 0 }}
                          whileInView={{ opacity: 1, scale: 1 }}
                          viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 0.6, ease: "easeOut" }}
                        ></motion.div>
                      </motion.div>
                    </div>
                </div>
                
                  {/* Text Section - Takes up 40% of the card */}
                  <div className="p-6">
                    <motion.h3 
                      className="text-xl font-bold mb-2"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.3, ease: "easeOut" }}
                    >
                      {item.title}
                    </motion.h3>
                    <motion.p 
                      className="text-textSecondary text-sm mb-4 leading-relaxed"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.4, ease: "easeOut" }}
                    >
                      {item.description}
                    </motion.p>
                    
                    {/* Compact features list */}
                    <div className="space-y-2 mb-6">
                      {item.features.slice(0, 2).map((feature, fIndex) => (
                        <motion.div 
                        key={fIndex} 
                          className="flex items-center gap-2 text-xs"
                          initial={{ opacity: 0, x: -5 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                          transition={{ duration: 0.2, delay: 0.5 + fIndex * 0.1, ease: "easeOut" }}
                        >
                          <div className="w-1 h-1 rounded-full bg-primary flex-shrink-0"></div>
                          <span className="text-textSecondary">{feature}</span>
                        </motion.div>
                      ))}
                </div>
                
                    {/* Action button */}
                  <motion.button 
                      className="w-full py-2.5 px-4 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-medium flex items-center justify-center gap-2 transition-all duration-200"
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.3, delay: 0.7, ease: "easeOut" }}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                      onClick={() => window.open('https://app.glemo.io', '_blank')}
                  >
                    {t('ecosystem.learnMore')}
                      <ArrowRight className="h-3 w-3" />
                  </motion.button>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden" id="tools" ref={toolsRef}>
        <div className="absolute inset-0 bg-gradient-to-r from-elementBackground/30 to-background -z-10"></div>
        <div className="absolute top-1/3 right-0 w-1/2 h-1/2 bg-secondary/5 rounded-full blur-[150px] -z-5"></div>
        
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <motion.div 
              className="lg:w-1/2"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <motion.span 
                className="inline-block text-sm font-medium bg-clip-text text-transparent bg-primary tracking-wider mb-3"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                {t('tools.badge')}
              </motion.span>
              <motion.h2 
                className="text-4xl md:text-5xl font-bold mb-6"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                {t('tools.title')} <span className="text-transparent bg-clip-text bg-primary">  
                  {t('tools.integration')}
                </span>
              </motion.h2>
              <motion.p 
                className="text-lg text-textSecondary mb-8"
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                {t('tools.description')}
              </motion.p>
              
              <div className="space-y-6 mb-10">
                {[
                  { 
                    title: t('tools.features.automated.title'), 
                    desc: t('tools.features.automated.description') 
                  },
                  { 
                    title: t('tools.features.custom.title'), 
                    desc: t('tools.features.custom.description') 
                  },
                  { 
                    title: t('tools.features.webhook.title'), 
                    desc: t('tools.features.webhook.description') 
                  }
                ].map((item, index) => (
                  <motion.div 
                    key={index} 
                    className="flex gap-4 items-start"
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: 0.3 + index * 0.1 }}
                  >
                    <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white flex-shrink-0 mt-1">
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M10 3L4.5 8.5L2 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                    </div>
                    <div>
                      <h3 className="font-bold mb-1">{item.title}</h3>
                      <p className="text-textSecondary text-sm">{item.desc}</p>
                    </div>
                  </motion.div>
                ))}
              </div>
              
              <InteractiveButton
                variant="gradient"
                size="lg"
              >
                {t('tools.exploreApi')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </InteractiveButton>
            </motion.div>
            
            <motion.div 
              className="lg:w-1/2 relative"
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <div className="rounded-xl border border-white/10 backdrop-blur-md bg-elementBackground/30 overflow-hidden shadow-xl">
                <div className="flex items-center gap-2 py-3 px-4 border-b border-white/5 bg-elementBackground/70">
                  <div className="w-3 h-3 rounded-full bg-red-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-yellow-500/70"></div>
                  <div className="w-3 h-3 rounded-full bg-green-500/70"></div>
                  <div className="ml-2 text-xs text-textSecondary">api-example.js</div>
                </div>
                
                <div className="p-5 font-mono text-sm overflow-hidden">
                  <motion.pre 
                    className="text-[13px] leading-relaxed"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, delay: 0.4 }}
                  >
                    <code className="language-javascript">
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.5 }}
                        className="block text-blue-400"
                      >
                        {'// Initialize the GLEMO API client'}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.6 }}
                        className="block text-purple-400"
                      >
                        const credentials = new GlemoAPI(&#123;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.7 }}
                        className="block ml-4"
                      >
                        <span className="text-green-400">apiKey:</span> <span className="text-orange-300">&apos;YOUR_API_KEY&apos;</span>,
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.8 }}
                        className="block ml-4"
                      >
                        <span className="text-green-400">environment:</span> <span className="text-orange-300">&apos;production&apos;</span>
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 0.9 }}
                        className="block text-purple-400"
                      >
                        &#125;);
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.0 }}
                        className="block mt-4 text-blue-400"
                      >
                        {'// Create a new certificate'}
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.1 }}
                        className="block text-yellow-200"
                      >
                        async function <span className="text-blue-300">issueCertificate</span>() &#123;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.2 }}
                        className="block ml-4 text-purple-400"
                      >
                        const response = await credentials.certificates.create(&#123;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.3 }}
                        className="block ml-8"
                      >
                        <span className="text-green-400">templateId:</span> <span className="text-orange-300">&apos;template_12345&apos;</span>,
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.4 }}
                        className="block ml-8"
                      >
                        <span className="text-green-400">recipient:</span> &#123;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.5 }}
                        className="block ml-12"
                      >
                        <span className="text-green-400">name:</span> <span className="text-orange-300">&apos;John Doe&apos;</span>,
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.6 }}
                        className="block ml-12"
                      >
                        <span className="text-green-400">email:</span> <span className="text-orange-300">&apos;john@example.com&apos;</span>,
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.7 }}
                        className="block ml-12"
                      >
                        <span className="text-green-400">wallet:</span> <span className="text-orange-300">&apos;0x1234...&apos;</span>
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.8 }}
                        className="block ml-8"
                      >
                        &#125;,
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 1.9 }}
                        className="block ml-8"
                      >
                        <span className="text-green-400">metadata:</span> &#123;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 2.0 }}
                        className="block ml-12"
                      >
                        <span className="text-green-400">course:</span> <span className="text-orange-300">&apos;Blockchain Development&apos;</span>,
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 2.1 }}
                        className="block ml-12"
                      >
                        <span className="text-green-400">grade:</span> <span className="text-orange-300">&apos;A&apos;</span>
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 2.2 }}
                        className="block ml-8"
                      >
                        &#125;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 2.3 }}
                        className="block ml-4"
                      >
                        &#125;);
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 2.4 }}
                        className="block ml-4 text-green-300"
                      >
                        return response;
                      </motion.span>
                      <motion.span
                        initial={{ opacity: 0 }}
                        whileInView={{ opacity: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5, delay: 2.5 }}
                        className="block"
                      >
                        &#125;
                      </motion.span>
                      </code>
                  </motion.pre>
                </div>
                
                <div className="border-t border-white/5 p-4 flex items-center justify-between bg-elementBackground/50">
                  <div className="text-xs text-textSecondary">Response status: <span className="text-green-400">200 OK</span></div>
                  <button className="px-3 py-1 text-xs bg-primary/20 text-primary rounded hover:bg-primary/30 transition-colors">
                    Copy code
                  </button>
                </div>
              </div>
              
              <div className="absolute -bottom-4 -left-4 p-3 bg-elementBackground/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl">
                <div className="text-xs font-medium mb-1 text-textSecondary">Success Rate</div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-primary">99.9%</div>
              </div>
              
              <div className="absolute -top-4 -right-4 p-3 bg-elementBackground/80 backdrop-blur-lg border border-white/10 rounded-lg shadow-xl">
                <div className="text-xs font-medium mb-1 text-textSecondary">Response Time</div>
                <div className="text-lg font-bold text-transparent bg-clip-text bg-primary">230ms</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background to-elementBackground/30 -z-10"></div>
        <div className="absolute top-0 left-0 w-1/2 h-1/3 bg-primary/5 rounded-full blur-[150px] -z-5"></div>
        
        <div className="container mx-auto px-4">
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <motion.span 
              className="inline-block text-sm font-medium bg-clip-text text-transparent bg-primary tracking-wider mb-3"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              {t('roles.badge')}
            </motion.span>
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <span className="text-transparent bg-clip-text bg-primary">
                {t('roles.tailored')}
              </span> {t('roles.title')}
            </motion.h2>
            <motion.p 
              className="text-lg text-textSecondary"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('roles.description')}
            </motion.p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
            {[
              {
                role: t('roles.admin.role'),
                icon: Settings,
                description: t('roles.admin.description'),
                features: [t('roles.admin.features.0'), t('roles.admin.features.1'), t('roles.admin.features.2'), t('roles.admin.features.3')],
                color: "from-blue-600/20 to-blue-400/20",
                buttonText: t('roles.admin.button')
              },
              {
                role: t('roles.issuers.role'),
                icon: Building2,
                description: t('roles.issuers.description'),
                features: [t('roles.issuers.features.0'), t('roles.issuers.features.1'), t('roles.issuers.features.2'), t('roles.issuers.features.3')],
                color: "from-green-600/20 to-green-400/20",
                buttonText: t('roles.issuers.button')
              },
              {
                role: t('roles.recipients.role'),
                icon: User,
                description: t('roles.recipients.description'),
                features: [t('roles.recipients.features.0'), t('roles.recipients.features.1'), t('roles.recipients.features.2'), t('roles.recipients.features.3')],
                color: "from-purple-600/20 to-purple-400/20",
                buttonText: t('roles.recipients.button')
              },
              {
                role: t('roles.verifiers.role'),
                icon: Eye,
                description: t('roles.verifiers.description'),
                features: [t('roles.verifiers.features.0'), t('roles.verifiers.features.1'), t('roles.verifiers.features.2'), t('roles.verifiers.features.3')],
                color: "from-red-600/20 to-red-400/20",
                buttonText: t('roles.verifiers.button')
              }
            ].map((item, index) => {
              const IconComponent = item.icon;
              return (
              <motion.div 
                key={index} 
                  className="relative h-full bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
                  initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                >
                  {/* Subtle background */}
                  <div className={`absolute inset-0 bg-gradient-to-br ${item.color} opacity-30`}></div>
                  
                  {/* Content */}
                  <div className="relative z-10 p-6 h-full flex flex-col">
                    {/* Icon */}
                    <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center mb-4">
                      <IconComponent className="w-6 h-6 text-white" />
                </div>
                
                    {/* Title */}
                    <h3 className="text-lg font-semibold text-white mb-2">{item.role}</h3>
                    
                    {/* Description */}
                    <p className="text-white/70 text-sm mb-6 leading-relaxed flex-1">{item.description}</p>
                    
                    {/* Features - minimal */}
                    <div className="mb-6">
                      {item.features.slice(0, 2).map((feature, fIndex) => (
                        <div key={fIndex} className="flex items-center gap-2 text-xs text-white/60 mb-1">
                          <div className="w-1 h-1 rounded-full bg-white/40"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                    
                    {/* Button */}
                    <button 
                      className="w-full py-2.5 px-4 bg-white/10 border border-white/20 rounded-lg text-sm font-medium text-white flex items-center justify-center gap-2 transition-all duration-200"
                      onClick={() => {
                        const urls = [
                          'https://app.glemo.io',
                          'https://app.glemo.io', 
                          'https://app.glemo.io',
                          'https://app.glemo.io/verify'
                        ];
                        window.open(urls[index], '_blank');
                      }}
                  >
                    {item.buttonText}
                      <ArrowRight className="h-3 w-3" />
                    </button>
                </div>
              </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-28 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-elementBackground/20 to-background/90 -z-10"></div>
        <div className="absolute top-0 right-0 w-1/3 h-1/2 bg-primary/5 rounded-full blur-[150px] -z-5"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/2 bg-secondary/5 rounded-full blur-[150px] -z-5"></div>
        
        <GlowEffect />
        
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-4xl mx-auto bg-elementBackground/30 backdrop-blur-md border border-white/10 p-12 rounded-2xl text-center relative overflow-hidden"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full blur-[50px]"></div>
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-gradient-to-br from-secondary/20 to-primary/20 rounded-full blur-[50px]"></div>
            
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-8"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="w-2 h-2 bg-primary rounded-full animate-pulse mr-2"></div>
              <span className="text-sm font-medium">{t('cta.badge')}</span>
            </motion.div>
            
            <motion.h2 
              className="text-4xl md:text-5xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              {t('cta.title')} <span className="text-transparent bg-clip-text bg-primary">
                {t('cta.certification')}
              </span> {t('cta.journey')}
            </motion.h2>
            
            <motion.p 
              className="text-lg text-textSecondary mb-10 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              {t('cta.description')}
            </motion.p>
            
            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <a href="https://app.glemo.io">
              <InteractiveButton
                variant="gradient"
                size="lg"
              >
                {t('cta.createFirst')}
                <ArrowRight className="ml-2 h-5 w-5" />
              </InteractiveButton>
              </a>
            </motion.div>
            
            <motion.div 
              className="mt-12 pt-12 border-t border-white/10 grid grid-cols-2 md:grid-cols-4 gap-8"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              {[
                { label: t('cta.stats.issued'), value: "150+" },
                { label: t('cta.stats.organizations'), value: "2+" },
                { label: t('cta.stats.countries'), value: "2+" },
                { label: t('cta.stats.successRate'), value: "99.9%" }
              ].map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="text-2xl md:text-3xl font-bold mb-1">{stat.value}</div>
                  <div className="text-sm text-textSecondary">{stat.label}</div>
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>
      </section>
      <Footer />
    </div>
  );
};

export default Landing;