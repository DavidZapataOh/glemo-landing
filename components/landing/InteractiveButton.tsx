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
        whileHover={{ scale: 1.02 }} // Reduced from 1.05 to 1.02
        whileTap={{ scale: 0.98 }}
      >
        <Button {...props} className="relative z-10 overflow-hidden">
          {children}
          <AnimatePresence>
            {isHovered && (
              <motion.div 
                className="absolute inset-0 bg-white/5" // Reduced from bg-white/10 to bg-white/5
                initial={{ x: "-100%" }}
                animate={{ x: "100%" }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8, ease: "easeInOut" }} // Increased from 0.6 to 0.8 to be more subtle
              />
            )}
          </AnimatePresence>
        </Button>
        {isHovered && (
          <motion.div
            className="absolute -inset-1 bg-primary rounded-lg opacity-30 blur-sm -z-10" // Reduced from opacity-70 to opacity-30
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    );
  };

export default InteractiveButton;