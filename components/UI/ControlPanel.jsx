import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ControlPanel() {
  const [autoRotate, setAutoRotate] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState('dark');
  const [showContactModal, setShowContactModal] = useState(false);

  const handleResetView = () => {
    // Dispatch custom event for 3D scene reset
    window.dispatchEvent(new CustomEvent('reset-view'));
  };

  const handleDownloadVCard = () => {
    // Create vCard download
    const vCardData = `BEGIN:VCARD
VERSION:3.0
N:Abdelaziz;Said;;;
FN:Said Abdelaziz
TITLE:Full-Stack JavaScript Developer
ORG:Freelance Developer
EMAIL;TYPE=INTERNET:said.abd.el.aziz.cs@gmail.com
TEL;TYPE=CELL:+213 669 085 027
URL:https://linkedin.com/in/said-abdelaziz
URL:https://github.com/x-aziz
URL:https://abdelaziz-portfolio-vercel.vercel.app
NOTE:Specializing in MERN stack and Laravel\\nE-Commerce Specialist\\n98.5/100 Bootcamp Graduate
END:VCARD`;
    const blob = new Blob([vCardData], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'Said_Abdelaziz.vcf';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const ContactModal = () => (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={() => setShowContactModal(false)}
    >
      <motion.div
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        className="glass rounded-xl p-6 max-w-md w-full mx-4"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="text-xl font-bold text-white mb-4">Contact Said</h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-cyan-500/20 rounded-lg flex items-center justify-center">
              📧
            </div>
            <div>
              <p className="text-sm text-gray-400">Email</p>
              <p className="text-white">said.abd.el.aziz.cs@gmail.com</p>
            </div>
          </div>
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
              📱
            </div>
            <div>
              <p className="text-sm text-gray-400">Phone</p>
              <p className="text-white">+213 669 085 027 / +213 553 643 785</p>
            </div>
          </div>
        </div>
        <div className="mt-6 space-y-3">
          <button
            onClick={() => {
              navigator.clipboard.writeText('said.abd.el.aziz.cs@gmail.com');
              // Show toast notification
              window.dispatchEvent(new CustomEvent('show-toast', {
                detail: { message: 'Email copied to clipboard!' }
              }));
            }}
            className="w-full py-3 bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 rounded-lg transition-colors"
          >
            Copy Email
          </button>
          <button
            onClick={() => window.open('https://linkedin.com/in/said-abdelaziz', '_blank')}
            className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
          >
            LinkedIn Profile
          </button>
          <button
            onClick={() => window.open('https://abdelaziz-portfolio-vercel.vercel.app', '_blank')}
            className="w-full py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 rounded-lg transition-colors"
          >
            Portfolio Website
          </button>
        </div>
      </motion.div>
    </motion.div>
  );

  return (
    <>
      <AnimatePresence>
        {showContactModal && <ContactModal />}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass rounded-xl p-4 w-64 space-y-4"
      >
        <h3 className="text-white font-semibold mb-2">Controls</h3>
        
        <div className="space-y-3">
          {/* Reset View Button */}
          <button
            onClick={handleResetView}
            className="flex items-center justify-between w-full p-3 hover:bg-gray-700/50 rounded-lg transition-colors group"
          >
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 group-hover:bg-cyan-500/20 rounded-lg flex items-center justify-center transition-colors">
                <span className="text-lg">🔄</span>
              </div>
              <span className="text-gray-300">Reset View</span>
            </div>
            <span className="text-xs text-gray-500">Ctrl+R</span>
          </button>

          {/* Auto-Rotate Toggle */}
          <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">⚡</span>
              </div>
              <span className="text-gray-300">Auto-Rotate</span>
            </div>
            <button
              onClick={() => setAutoRotate(!autoRotate)}
              className={`relative w-12 h-6 rounded-full transition-colors ${autoRotate ? 'bg-cyan-500' : 'bg-gray-600'}`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ x: autoRotate ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Sound Toggle */}
          <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎵</span>
              </div>
              <span className="text-gray-300">Sound</span>
            </div>
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`relative w-12 h-6 rounded-full transition-colors ${soundEnabled ? 'bg-green-500' : 'bg-gray-600'}`}
            >
              <motion.div
                className="absolute top-1 w-4 h-4 bg-white rounded-full"
                animate={{ x: soundEnabled ? 28 : 4 }}
                transition={{ type: "spring", stiffness: 500, damping: 30 }}
              />
            </button>
          </div>

          {/* Theme Selector */}
          <div className="flex items-center justify-between p-3 hover:bg-gray-700/50 rounded-lg transition-colors">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gray-700 rounded-lg flex items-center justify-center">
                <span className="text-lg">🎨</span>
              </div>
              <span className="text-gray-300">Theme</span>
            </div>
            <select
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-800 text-gray-300 text-sm rounded-lg px-2 py-1"
            >
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="cyberpunk">Cyberpunk</option>
            </select>
          </div>

          {/* Divider */}
          <div className="border-t border-gray-700/50 my-2" />

          {/* Contact Me Button */}
          <button
            onClick={() => setShowContactModal(true)}
            className="flex items-center space-x-3 w-full p-3 hover:bg-cyan-500/20 rounded-lg transition-colors group"
          >
            <div className="w-8 h-8 bg-cyan-500/20 group-hover:bg-cyan-500/30 rounded-lg flex items-center justify-center transition-colors">
              <span className="text-lg">📱</span>
            </div>
            <span className="text-cyan-300">Contact Me</span>
          </button>

          {/* Download vCard Button */}
          <button
            onClick={handleDownloadVCard}
            className="flex items-center space-x-3 w-full p-3 hover:bg-purple-500/20 rounded-lg transition-colors group"
          >
            <div className="w-8 h-8 bg-purple-500/20 group-hover:bg-purple-500/30 rounded-lg flex items-center justify-center transition-colors">
              <span className="text-lg">📥</span>
            </div>
            <span className="text-purple-300">Download vCard</span>
          </button>

          {/* Portfolio Button */}
          <button
            onClick={() => window.open('https://github.com/x-aziz', '_blank')}
            className="flex items-center space-x-3 w-full p-3 hover:bg-green-500/20 rounded-lg transition-colors group"
          >
            <div className="w-8 h-8 bg-green-500/20 group-hover:bg-green-500/30 rounded-lg flex items-center justify-center transition-colors">
              <span className="text-lg">🌐</span>
            </div>
            <span className="text-green-300">View Portfolio</span>
          </button>
        </div>

        {/* Quick Tips */}
        <div className="mt-4 pt-4 border-t border-gray-700/50">
          <p className="text-xs text-gray-400 mb-2">Quick Tips:</p>
          <ul className="text-xs text-gray-500 space-y-1">
            <li>• Click card to lift</li>
            <li>• Drag to rotate when lifted</li>
            <li>• Double-click to flip</li>
            <li>• Scroll to zoom</li>
          </ul>
        </div>
      </motion.div>
    </>
  );
}