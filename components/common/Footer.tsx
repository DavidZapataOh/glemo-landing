import React from 'react';
import { Send } from 'lucide-react';
import Image from 'next/image';

const Footer = () => {
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
              Leading platform for issuing verifiable digital certificates on blockchain.
            </p>
            <div className="flex space-x-4">
              {['twitter', 'github', 'discord', 'linkedin'].map((social, i) => (
                <a key={i} href="#" className="w-9 h-9 rounded-full bg-elementBackground flex items-center justify-center hover:bg-elementBackground/70 transition-colors">
                  <span className="sr-only">{social}</span>
                  <div className="w-5 h-5 text-textSecondary"></div>
                </a>
              ))}
            </div>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Platform</h4>
            <ul className="space-y-3">
              {['Features', 'Templates', 'Issuance', 'Verification'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-textSecondary hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Resources</h4>
            <ul className="space-y-3">
              {['Documentation', 'API', 'Tutorials', 'Blog'].map((item, i) => (
                <li key={i}>
                  <a href="#" className="text-textSecondary hover:text-primary transition-colors">
                    {item}
                  </a>
                </li>
              ))}
            </ul>
          </div>
          
          <div>
            <h4 className="text-lg font-semibold mb-4">Contact us</h4>
            <p className="text-textSecondary mb-4">
              Have questions about the platform? Write to us and we will answer you as soon as possible.
            </p>
            <div className="flex">
              <input 
                type="email" 
                placeholder="Your email" 
                className="px-4 py-2 bg-elementBackground border border-white/10 rounded-l-lg focus:outline-none focus:ring-1 focus:ring-primary text-sm flex-grow"
              />
              <button className="bg-gradient-to-r from-primary to-secondary text-white px-4 py-2 rounded-r-lg hover:opacity-90 transition-opacity">
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
        
        <div className="mt-12 pt-6 border-t border-elementBackground/50 flex flex-col md:flex-row justify-between items-center">
          <p className="text-textSecondary text-sm">
            © {new Date().getFullYear()} Glemo. All rights reserved.
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <a href="#" className="text-textSecondary hover:text-primary text-sm transition-colors">
              Terms
            </a>
            <a href="#" className="text-textSecondary hover:text-primary text-sm transition-colors">
              Privacy
            </a>
            <a href="#" className="text-textSecondary hover:text-primary text-sm transition-colors">
              Cookies
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

