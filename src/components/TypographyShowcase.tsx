import React from 'react'

const TypographyShowcase: React.FC = () => {
  return (
    <div className="container mx-auto px-4 py-8 space-y-8">
      {/* Header Section */}
      <div className="text-center">
        <h1 className="typography-h1-center mb-4">
          🎮 Battle64 Typography System
        </h1>
        <p className="typography-body-center">
          Retro-Style Headings + Modern Readable Body Text
        </p>
      </div>

      {/* Heading Examples */}
      <section className="space-y-6">
        <h2 className="typography-h2">Heading Styles</h2>
        
        <div className="space-y-4">
          <div>
            <h1 className="typography-h1">H1: Main Title (Press Start 2P)</h1>
            <p className="typography-small">Font: Press Start 2P, Size: clamp(1.8rem, 2vw, 2.6rem)</p>
          </div>
          
          <div>
            <h2 className="typography-h2">H2: Section Header (Press Start 2P)</h2>
            <p className="typography-small">Font: Press Start 2P, Size: clamp(1.4rem, 1.8vw, 2.2rem)</p>
          </div>
          
          <div>
            <h3 className="typography-h3">H3: Subsection (Press Start 2P)</h3>
            <p className="typography-small">Font: Press Start 2P, Size: clamp(1.2rem, 1.6vw, 2rem)</p>
          </div>
        </div>
      </section>

      {/* Highlight Examples */}
      <section className="space-y-6">
        <h2 className="typography-h2">Highlight Styles</h2>
        
        <div className="space-y-4">
          <h1 className="typography-h1-highlight">Winner Announcement!</h1>
          <h2 className="typography-h2-highlight">Special Event Title</h2>
          <p className="typography-small">Golden color (#FFD700) for special occasions</p>
        </div>
      </section>

      {/* Body Text Examples */}
      <section className="space-y-6">
        <h2 className="typography-h2">Body Text Styles</h2>
        
        <div className="space-y-4">
          <div>
            <p className="typography-body">
              Primary body text using Inter font. Perfect for event descriptions, 
              speedrun details, and community content. Optimized for readability 
              with proper line height and letter spacing.
            </p>
            <p className="typography-small">Font: Inter, Size: clamp(0.95rem, 1.2vw, 1.05rem)</p>
          </div>
          
          <div>
            <p className="typography-body-secondary">
              Secondary body text for less important information or metadata.
              Slightly muted but still readable.
            </p>
            <p className="typography-small">Color: #B0B0B0</p>
          </div>
          
          <div>
            <p className="typography-body-muted">
              Muted text for timestamps, helper text, or background information.
            </p>
            <p className="typography-small">Color: #888888</p>
          </div>
          
          <div>
            <p className="typography-small">
              Small text for captions, footnotes, or metadata.
            </p>
          </div>
        </div>
      </section>

      {/* Link Examples */}
      <section className="space-y-6">
        <h2 className="typography-h2">Link Styles</h2>
        
        <div className="space-y-4">
          <p className="typography-body">
            This paragraph contains a <a href="#" className="typography-link">sample link</a> that 
            demonstrates the hover effects and styling.
          </p>
          <p className="typography-small">Links use #66ccff color with hover effects</p>
        </div>
      </section>

      {/* Event Card Examples */}
      <section className="space-y-6">
        <h2 className="typography-h2">Event Card Typography</h2>
        
        <div className="bg-slate-800 rounded-lg p-6 space-y-3">
          <h3 className="typography-event-title">Mario Kart 64 Championship</h3>
          <p className="typography-event-description">
            Join our weekly Mario Kart 64 tournament! Race through all 16 tracks 
            and compete for the fastest overall time. Registration closes at 8 PM.
          </p>
          <div className="flex justify-between items-center">
            <span className="typography-small">Starts: Today 9:00 PM</span>
            <span className="typography-small">Players: 24/32</span>
          </div>
        </div>
      </section>

      {/* Centered Examples */}
      <section className="space-y-6">
        <h2 className="typography-h2">Centered Layouts</h2>
        
        <div className="text-center space-y-4">
          <h1 className="typography-h1-center">Centered Main Title</h1>
          <h2 className="typography-h2-center">Centered Section Header</h2>
          <h3 className="typography-h3-center">Centered Subsection</h3>
          <p className="typography-body-center">
            Centered body text for special announcements or hero sections.
          </p>
        </div>
      </section>

      {/* Mobile Preview Note */}
      <section className="bg-slate-900 rounded-lg p-6">
        <h3 className="typography-h3 mb-4">📱 Mobile Optimizations</h3>
        <p className="typography-body mb-4">
          All typography automatically adjusts for mobile devices:
        </p>
        <ul className="typography-body space-y-2 ml-6">
          <li>• Smaller font sizes with clamp() for better mobile readability</li>
          <li>• Adjusted line heights for touch interfaces</li>
          <li>• Proper padding for body text on mobile</li>
          <li>• Responsive scaling based on viewport width</li>
        </ul>
      </section>

      {/* Usage Examples */}
      <section className="bg-slate-900 rounded-lg p-6">
        <h3 className="typography-h3 mb-4">🛠️ Usage Examples</h3>
        <div className="space-y-4">
          <div>
            <h4 className="typography-body font-bold mb-2">For Main Page Titles:</h4>
            <code className="bg-slate-800 px-3 py-1 rounded text-sm">
              &lt;h1 className="typography-h1"&gt;Battle64 Events&lt;/h1&gt;
            </code>
          </div>
          
          <div>
            <h4 className="typography-body font-bold mb-2">For Event Cards:</h4>
            <code className="bg-slate-800 px-3 py-1 rounded text-sm">
              &lt;h3 className="typography-event-title"&gt;Event Name&lt;/h3&gt;
            </code>
          </div>
          
          <div>
            <h4 className="typography-body font-bold mb-2">For Body Content:</h4>
            <code className="bg-slate-800 px-3 py-1 rounded text-sm">
              &lt;p className="typography-body"&gt;Description text&lt;/p&gt;
            </code>
          </div>
          
          <div>
            <h4 className="typography-body font-bold mb-2">For Special Highlights:</h4>
            <code className="bg-slate-800 px-3 py-1 rounded text-sm">
              &lt;h2 className="typography-h2-highlight"&gt;Winner!&lt;/h2&gt;
            </code>
          </div>
        </div>
      </section>
    </div>
  )
}

export default TypographyShowcase