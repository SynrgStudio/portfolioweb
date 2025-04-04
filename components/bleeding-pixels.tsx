"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Pixel {
  id: number;
  x: number; // Initial horizontal percentage (0-100)
  color: 'magenta' | 'cyan';
  fallDuration: number; // Duration of the fall animation (controls speed & fade time)
  fallDistance: number; // How far it falls
  deathTime: number; // Timestamp when the pixel should be removed
}

// Reduced max pixels and generation frequency for performance
const MAX_PIXELS = 25;
const PIXEL_GENERATION_INTERVAL = 120;
const PIXEL_CLEANUP_INTERVAL = 250;

// Simple random number generator within a range
const random = (min: number, max: number) => Math.random() * (max - min) + min;

export default function BleedingPixels() {
  const [pixels, setPixels] = useState<Pixel[]>([]);

  const addPixel = useCallback(() => {
    setPixels(prevPixels => {
      // Limit the number of pixels
      if (prevPixels.length >= MAX_PIXELS) {
        // Could remove the oldest, but AnimatePresence might handle exit anyway.
        // For simplicity now, just don't add more if full.
        // A better approach might involve removing oldest explicitly.
         return prevPixels;
      }

      const fallDuration = random(1.2, 2.2);
      const newPixel: Pixel = {
        id: Date.now() + Math.random(), // Unique ID
        x: random(10, 80), 
        color: Math.random() > 0.5 ? 'magenta' : 'cyan',
        fallDuration: fallDuration,
        fallDistance: random(20, 80),
        deathTime: Date.now() + fallDuration * 1000 + 50, // Add small buffer
      };

      // Removed the individual setTimeout for removal

      return [...prevPixels, newPixel];
    });
  }, []);

  // Effect for generating pixels
  useEffect(() => {
    const generationIntervalId = setInterval(addPixel, PIXEL_GENERATION_INTERVAL);
    return () => clearInterval(generationIntervalId);
  }, [addPixel]);

  // Effect for cleaning up expired pixels
  useEffect(() => {
    const cleanupIntervalId = setInterval(() => {
      const now = Date.now();
      setPixels(currentPixels => {
        const activePixels = currentPixels.filter(p => p.deathTime > now);
        // Only update state if pixels were actually removed
        if (activePixels.length < currentPixels.length) {
          return activePixels;
        }
        return currentPixels; // No change needed
      });
    }, PIXEL_CLEANUP_INTERVAL);

    return () => clearInterval(cleanupIntervalId); // Cleanup cleanup interval on unmount
  }, []); // Empty dependency array ensures this runs once

  return (
    // Removed explicit z-index. Button's z-10 in parent should control stacking.
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 w-full h-16 pointer-events-none overflow-visible">
      {/* Container for pixels */}
      <AnimatePresence>
        {pixels.map(pixel => (
          // Outer div: Handles positioning (left/top) and Framer Motion animation (y, opacity)
          <motion.div
            key={pixel.id}
            className="absolute" // Positioned absolutely
            style={{
              left: `${pixel.x}%`,
              top: '0px',
            }}
            initial={{ opacity: 1, y: 0 }}
            animate={{
              y: pixel.fallDistance,
              opacity: 0
            }}
            exit={{ opacity: 0 }}
            transition={{
              duration: pixel.fallDuration,
              ease: "easeIn"
            }}
          >
            {/* Inner div: Now also a motion.div, handles appearance and jitter animation */}
            <motion.div
              className={`w-2 h-2 ${pixel.color === 'magenta' ? 'bg-[#FF00FF]' : 'bg-[#00FFFF]'}`}
              // Removed animate-pixel-jitter class
              // Added Framer Motion animation for jitter
              animate={{
                x: [-0.5, 0.5, -0.5, 0, 0.5, -0.5] // Jitter pattern
              }}
              transition={{
                x: { // Specific transition for x property
                  duration: 0.15, // Faster jitter
                  repeat: Infinity,
                  repeatType: "loop", // Loop back to start
                  ease: "linear"
                }
              }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
} 