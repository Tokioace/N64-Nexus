import React from 'react'

interface ScanFrameProps {
  children: React.ReactNode
  isActive?: boolean
}

const ScanFrame: React.FC<ScanFrameProps> = ({ children, isActive = true }) => {
  return (
    <div className="scan-frame">
      {children}
      {isActive && (
        <>
          <div className="scan-line"></div>
          <div className="absolute top-0 left-0 w-full h-full pointer-events-none">
            {/* Corner indicators */}
            <div className="absolute top-2 left-2 w-8 h-8 border-l-4 border-t-4 border-retro-green"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-r-4 border-t-4 border-retro-green"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-l-4 border-b-4 border-retro-green"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-r-4 border-b-4 border-retro-green"></div>
          </div>
        </>
      )}
    </div>
  )
}

export default ScanFrame