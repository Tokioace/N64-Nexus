import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Home, Brain, Trophy, User, Gamepad2, Menu, X } from 'lucide-react'

interface NavItem {
  to: string
  icon: React.ComponentType<any>
  label: string
  color: string
}

const navItems: NavItem[] = [
  { to: '/', icon: Home, label: 'Home', color: 'n64-purple' },
  { to: '/quiz', icon: Brain, label: 'Quiz', color: 'n64-blue' },
  { to: '/minigames', icon: Gamepad2, label: 'Minigames', color: 'n64-green' },
  { to: '/leaderboard', icon: Trophy, label: 'Rangliste', color: 'n64-yellow' },
  { to: '/profile', icon: User, label: 'Profil', color: 'n64-red' }
]

const RetroNavigation3D: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false)
  const location = useLocation()

  const toggleMenu = () => {
    setIsOpen(!isOpen)
  }

  return (
    <>
      {/* Mobile Menu Button */}
      <motion.button
        className="fixed top-4 right-4 z-50 p-3 bg-gradient-to-br from-n64-purple to-purple-800 rounded-lg shadow-[0_4px_0_#553C9A,0_8px_15px_rgba(107,70,193,0.4)] border-2 border-white/20 md:hidden"
        onClick={toggleMenu}
        whileHover={{ scale: 1.05, rotateZ: 5 }}
        whileTap={{ scale: 0.95 }}
      >
        <motion.div
          animate={{ rotateZ: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <X size={24} className="text-white" /> : <Menu size={24} className="text-white" />}
        </motion.div>
      </motion.button>

      {/* Desktop Navigation */}
      <nav className="hidden md:fixed md:bottom-0 md:left-0 md:right-0 md:block z-40">
        <div className="relative">
          {/* 3D Base */}
          <div className="absolute inset-0 bg-gradient-to-t from-n64-gray to-gray-700 transform translate-y-2 opacity-60" />
          
          {/* Main Navigation Bar */}
          <div className="relative bg-gradient-to-t from-n64-gray/95 to-gray-600/95 backdrop-blur-sm border-t-2 border-white/20">
            <div className="flex justify-around items-center py-3">
              {navItems.map((item, index) => (
                <NavLink3D key={item.to} item={item} index={index} />
              ))}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Slide-In Menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <motion.div
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 md:hidden"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={toggleMenu}
            />
            
            {/* Slide-In Menu */}
            <motion.div
              className="fixed top-0 right-0 h-full w-80 bg-gradient-to-br from-n64-gray to-gray-800 shadow-[0_0_50px_rgba(0,0,0,0.5)] border-l-2 border-white/20 z-40 md:hidden"
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            >
              {/* 3D Polygon Background */}
              <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-n64-purple/10 to-transparent" />
                <div className="absolute top-1/4 right-0 w-32 h-32 bg-n64-blue/20 transform rotate-45 rounded-lg" />
                <div className="absolute bottom-1/4 left-0 w-24 h-24 bg-n64-green/20 transform -rotate-12 rounded-lg" />
              </div>
              
              {/* Menu Header */}
              <div className="relative p-6 border-b border-white/20">
                <h2 className="text-2xl font-bold text-white font-game text-shadow">
                  Battle64
                </h2>
                <p className="text-white/70 text-sm mt-1">Retro Gaming Menu</p>
              </div>
              
              {/* Menu Items */}
              <div className="relative p-4 space-y-2">
                {navItems.map((item, index) => (
                  <MobileNavLink3D
                    key={item.to}
                    item={item}
                    index={index}
                    onClose={toggleMenu}
                  />
                ))}
              </div>
              
              {/* Menu Footer */}
              <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/20">
                <div className="text-center text-white/50 text-xs font-game">
                  Nintendo 64 Style
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  )
}

const NavLink3D: React.FC<{ item: NavItem; index: number }> = ({ item, index }) => {
  const location = useLocation()
  const isActive = location.pathname === item.to
  const Icon = item.icon

  return (
    <Link to={item.to}>
      <motion.div
        className={`
          relative flex flex-col items-center p-3 rounded-lg cursor-pointer
          transition-all duration-200
          ${isActive ? 'text-white' : 'text-white/70 hover:text-white'}
        `}
        whileHover={{ 
          scale: 1.1,
          rotateX: -10,
          rotateY: 10,
          z: 20
        }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        style={{ transformStyle: 'preserve-3d' }}
      >
        {/* Active Indicator */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 bg-gradient-to-br from-${item.color}/30 to-${item.color}/10 rounded-lg border border-${item.color}/50`}
            layoutId="activeTab"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        {/* 3D Icon Container */}
        <motion.div
          className={`
            relative p-2 rounded-lg mb-1
            ${isActive ? `bg-gradient-to-br from-${item.color} to-${item.color}/80 shadow-[0_4px_8px_rgba(0,0,0,0.3)]` : 'bg-white/10'}
          `}
          animate={isActive ? {
            rotateY: [0, 360],
          } : {}}
          transition={isActive ? {
            duration: 2,
            repeat: Infinity,
            ease: "linear"
          } : {}}
        >
          <Icon size={20} />
        </motion.div>
        
        {/* Label */}
        <span className="text-xs font-game">{item.label}</span>
        
        {/* Glow Effect */}
        {isActive && (
          <motion.div
            className={`absolute inset-0 rounded-lg shadow-[0_0_20px_rgba(107,70,193,0.5)]`}
            animate={{
              opacity: [0.5, 1, 0.5],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </Link>
  )
}

const MobileNavLink3D: React.FC<{ 
  item: NavItem; 
  index: number; 
  onClose: () => void 
}> = ({ item, index, onClose }) => {
  const location = useLocation()
  const isActive = location.pathname === item.to
  const Icon = item.icon

  return (
    <Link to={item.to} onClick={onClose}>
      <motion.div
        className={`
          relative flex items-center gap-4 p-4 rounded-lg cursor-pointer
          transition-all duration-200
          ${isActive ? 'text-white bg-white/10' : 'text-white/70 hover:text-white hover:bg-white/5'}
        `}
        initial={{ x: 100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ 
          scale: 1.02,
          x: 10,
          rotateY: 5
        }}
        whileTap={{ scale: 0.98 }}
      >
        {/* 3D Icon Container */}
        <motion.div
          className={`
            relative p-3 rounded-lg
            ${isActive ? `bg-gradient-to-br from-${item.color} to-${item.color}/80 shadow-[0_4px_8px_rgba(0,0,0,0.3)]` : 'bg-white/10'}
          `}
          whileHover={{ rotateY: 15 }}
        >
          <Icon size={24} />
        </motion.div>
        
        {/* Label */}
        <span className="text-lg font-game">{item.label}</span>
        
        {/* Active Indicator */}
        {isActive && (
          <motion.div
            className="absolute right-4 w-2 h-2 bg-white rounded-full"
            animate={{
              scale: [1, 1.5, 1],
              opacity: [0.5, 1, 0.5]
            }}
            transition={{
              duration: 1,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}
      </motion.div>
    </Link>
  )
}

export default RetroNavigation3D