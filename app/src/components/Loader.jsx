import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Wand2, FileText, Code, Sparkles } from "lucide-react";
import SiteLogo from "../assets/logo.png";

export default function Loader() {
  const [progress, setProgress] = useState(0);
  const [loadingText, setLoadingText] = useState("Loading tools");
  
  // Simulate loading progress
  useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(prev => {
        if (prev >= 100) return 100;
        return prev + 2; // Increment by 2%
      });
    }, 50);
    
    return () => clearTimeout(timer);
  }, [progress]);
  
  // Change loading text periodically
  useEffect(() => {
    const texts = [
      "Loading tools",
      "Preparing workspace",
      "Gathering utilities",
      "Almost ready"
    ];
    let index = 0;
    
    const textTimer = setInterval(() => {
      index = (index + 1) % texts.length;
      setLoadingText(texts[index]);
    }, 2000);
    
    return () => clearInterval(textTimer);
  }, []);
  
  // Tool icons that appear during loading
  const toolIcons = [
    { icon: <Wand2 />, color: "text-purple-500", delay: 0 },
    { icon: <FileText />, color: "text-blue-500", delay: 0.1 },
    { icon: <Code />, color: "text-amber-500", delay: 0.2 },
    { icon: <Sparkles />, color: "text-primary", delay: 0.3 }
  ];

  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center z-50">
      {/* Gradient background */}
      <div className="absolute inset-0 overflow-hidden -z-10">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-background to-primary/5" />
        
        {/* Animated dots/particles */}
        <div className="absolute inset-0">
          {Array.from({ length: 20 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute rounded-full bg-primary/10 w-2 h-2"
              initial={{ 
                top: `${Math.random() * 100}%`, 
                left: `${Math.random() * 100}%`,
                opacity: 0.1
              }}
              animate={{ 
                top: `${Math.random() * 100}%`,
                left: `${Math.random() * 100}%`,
                opacity: [0.1, 0.3, 0.1]
              }}
              transition={{ 
                duration: 3 + Math.random() * 2,
                repeat: Infinity,
                repeatType: "reverse" 
              }}
            />
          ))}
        </div>
      </div>
      
      <div className="w-64 flex flex-col items-center">
        {/* Logo animation */}
        <div className="mb-8 relative">
          <motion.div 
            className="w-16 h-16 rounded-full bg-primary/10 backdrop-blur-lg flex items-center justify-center"
            animate={{ 
              scale: [1, 1.05, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity
            }}
          >
            {/* Rotating ring */}
            <motion.div 
              className="absolute inset-0 rounded-full border-2 border-transparent border-t-primary border-l-primary"
              animate={{ rotate: 360 }}
              transition={{ 
                duration: 2, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
            
            <img
              src={SiteLogo}
              alt="Toolzer"
              className="w-8 h-8 rounded-full"
            />
          </motion.div>
          
          {/* Orbiting tools */}
          <div className="absolute inset-0">
            {toolIcons.map((tool, index) => (
              <motion.div
                key={index}
                className={`absolute w-8 h-8 rounded-full bg-background/80 backdrop-blur border border-border/50 flex items-center justify-center ${tool.color}`}
                initial={{ scale: 0, x: 0, y: 0 }}
                animate={{ 
                  scale: 1,
                  x: [0, 50 * Math.cos(index * Math.PI/2)],
                  y: [0, 50 * Math.sin(index * Math.PI/2)],
                }}
                transition={{ 
                  duration: 0.5,
                  delay: tool.delay,
                  x: {
                    delay: tool.delay + 0.5,
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  },
                  y: {
                    delay: tool.delay + 0.5,
                    duration: 3,
                    repeat: Infinity,
                    repeatType: "reverse"
                  }
                }}
              >
                {tool.icon}
              </motion.div>
            ))}
          </div>
        </div>

        {/* Loading text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={loadingText}
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -5 }}
            transition={{ duration: 0.2 }}
            className="text-sm text-muted-foreground text-center mt-1 mb-6 h-5"
          >
            {loadingText}
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full bg-muted/50 rounded-full h-1.5 mb-1 overflow-hidden">
          <motion.div 
            className="h-full bg-primary rounded-full"
            initial={{ width: "0%" }}
            animate={{ width: `${progress}%` }}
            transition={{ type: "spring", stiffness: 50 }}
          />
        </div>
        
        {/* Timestamp */}
        <div className="text-xs text-muted-foreground mt-6 opacity-50">
          2025-04-23 06:59:28
        </div>
      </div>
    </div>
  );
}