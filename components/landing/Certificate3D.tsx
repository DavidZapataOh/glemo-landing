import { motion } from "framer-motion";

const Certificate3D = () => {
    return (
      <div className="relative w-full h-full perspective-1000">
        <motion.div 
          className="w-full h-full"
          initial={{ rotateY: 0, rotateX: 0 }}
          animate={{ 
            rotateY: [0, 15, 0, -15, 0],
            rotateX: [0, -10, 5, -5, 0],
            z: [0, 50, 0, -20, 0]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          <div className="w-full h-full bg-gradient-to-br from-gray-100/90 to-white/80 rounded-2xl backdrop-blur-sm border border-white/20 shadow-xl relative overflow-hidden">
            <div className="absolute inset-3 border-4 border-gray-700/10 rounded-xl"></div>
            <div className="absolute inset-5 border border-dashed border-gray-500/10 rounded-lg"></div>
            
            <div className="absolute inset-0 opacity-5">
              {Array.from({ length: 10 }).map((_, i) => (
                <div 
                  key={i} 
                  className="absolute opacity-30"
                  style={{
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    width: `${50 + Math.random() * 100}px`,
                    height: `${50 + Math.random() * 100}px`,
                    border: '1px solid rgba(0,200,150,0.2)',
                    borderRadius: '50%',
                    transform: `rotate(${Math.random() * 360}deg)`
                  }}
                ></div>
              ))}
            </div>
            
            <div className="absolute top-12 left-0 w-full text-center">
              <div className="text-md text-gray-500 font-semibold tracking-wider">CERTIFICATE OF ACHIEVEMENT</div>
              <div className="mt-2 text-xs text-gray-400">BLOCKCHAIN VERIFIED</div>
            </div>
  
            <div className="absolute top-[4.5rem] left-1/2 -translate-x-1/2 w-1/3 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
            
            <div className="absolute top-28 left-0 w-full px-10">
              <div className="text-xs text-center text-gray-500 mb-2">This certifies that</div>
              <div className="text-center text-lg font-serif text-gray-800 mb-3 border-b border-gray-300/30 pb-1">Elizabeth Anderson</div>
              <div className="text-xs text-center text-gray-500 mb-1">has successfully completed the course</div>
              <div className="text-center text-sm font-medium text-gray-700 mb-5">Blockchain Development Fundamentals</div>
            </div>
            
            <div className="absolute bottom-28 left-8 right-8 flex justify-between items-end">
              <div className="text-center">
                <div className="w-20 h-px bg-gray-400/50 mb-1 mx-auto"></div>
                <div className="text-xs text-gray-500">May 15, 2025</div>
                <div className="text-[10px] text-gray-400">DATE</div>
              </div>
              <div className="text-center">
                <div className="font-cursive text-lg text-gray-600 italic mb-1">J. Smith</div>
                <div className="w-24 h-px bg-gray-400/50 mb-1 mx-auto"></div>
                <div className="text-[10px] text-gray-400">INSTRUCTOR</div>
              </div>
            </div>
            
            <div className="absolute bottom-8 right-8 w-16 h-16 rounded-full flex items-center justify-center">
              <motion.div 
                className="w-14 h-14 rounded-full border-2 border-primary/30 flex items-center justify-center"
                animate={{ rotate: 360 }}
                transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 flex items-center justify-center text-xs text-white font-bold">
                  NFT
                </div>
              </motion.div>
            </div>
            
            <div className="absolute bottom-8 left-8 w-14 h-14 bg-white/70 rounded-md p-1">
              <div className="w-full h-full grid grid-cols-3 grid-rows-3 gap-0.5">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div 
                    key={i} 
                    className={`${Math.random() > 0.5 ? 'bg-gray-800' : 'bg-transparent'} rounded-sm`}
                  ></div>
                ))}
              </div>
            </div>
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-primary/10 blur-3xl rounded-full"></div>
            <div className="absolute bottom-10 left-10 w-40 h-40 bg-secondary/10 blur-3xl rounded-full"></div>
            
            <div className="absolute top-8 left-8 text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary font-bold text-lg">
              GLEMO
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

export default Certificate3D;