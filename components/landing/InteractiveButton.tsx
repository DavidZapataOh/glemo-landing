import { AnimatePresence } from "framer-motion";
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";

interface InteractiveButtonProps {
  children: React.ReactNode;
  className?: string;
  variant?: 'gradient' | 'default';
  size?: 'sm' | 'lg';
  props?: React.ButtonHTMLAttributes<HTMLButtonElement>;
}

const InteractiveButton: React.FC<InteractiveButtonProps> = ({ children, className, ...props }) => {
    const [isHovered, setIsHovered] = useState(false);
    
    return (
      <motion.div
        className={`relative inline-block ${className}`}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.98 }}
      >
        <Button {...props} className="relative z-10 overflow-hidden">
          {children}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-white/10"
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6, ease: "easeInOut" }}
              />
            )}
          </AnimatePresence>
        </Button>
        {isHovered && (
          <motion.div
            className="absolute -inset-1 bg-gradient-to-r from-primary to-secondary rounded-lg opacity-70 blur-sm -z-10"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.7 }}
            exit={{ opacity: 0 }}
          />
        )}
      </motion.div>
    );
  };

export default InteractiveButton;