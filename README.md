# Battle64 Community - Fanart & Screenshot Gallery

A modern community platform for retro gaming enthusiasts to share fanart, screenshots, and connect with fellow Battle64 fans. Built with Next.js, TypeScript, and Tailwind CSS.

## 🌟 Features

### 🎨 Fanart Gallery
- Upload original fanart with drag-and-drop interface
- Support for JPG/PNG formats (max 10MB)
- Tag system and tools attribution
- Game-specific categorization
- NSFW content filtering

### 📷 Screenshot Gallery
- Share gaming moments and achievements
- Platform and region specification (N64, SNES, PAL/NTSC)
- Achievement tracking and speedrun records
- Highscore showcases

### 🏆 Gamification System
- **Level System**: Bronze → Silver → Gold → Platinum Artist
- **Point System**: Earn points through likes, comments, and uploads
- **Badges**: Unlock achievements like "Retro Picasso", "Speedrun Shooter"
- **Weekly/Monthly Rankings**: Top content gets featured
- **Competitions**: Monthly themed challenges

### 👥 Community Features
- Like, comment, and favorite content
- User profiles with personal galleries
- Follow other artists and creators
- Search and filter by game, content type, popularity
- Content moderation and reporting system

### 🎯 Content Organization
- **Tabs**: Fanart, Screenshots, Top This Month, New
- **Sorting**: Newest, Most Liked, Most Commented, Trending
- **Filtering**: By game, platform, region
- **Search**: Full-text search across titles and descriptions

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Cloudinary account (for image uploads)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/battle64-community.git
   cd battle64-community
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   Edit `.env.local` with your configuration:
   - Database connection string
   - Cloudinary credentials
   - NextAuth secret

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
battle64-community/
├── app/                    # Next.js App Router
│   ├── community/         # Community gallery page
│   ├── profile/          # User profile page
│   ├── upload/           # Upload form page
│   ├── globals.css       # Global styles
│   ├── layout.tsx        # Root layout
│   └── page.tsx          # Homepage
├── prisma/               # Database schema
│   └── schema.prisma     # Prisma schema definition
├── components/           # Reusable components
├── lib/                  # Utility functions
├── types/                # TypeScript type definitions
└── public/               # Static assets
```

## 🎨 Design System

### Color Palette
- **Retro Purple**: `#8B5CF6` - Primary brand color
- **Retro Pink**: `#EC4899` - Accent color
- **Retro Blue**: `#3B82F6` - Secondary color
- **Retro Green**: `#10B981` - Success states
- **Retro Yellow**: `#F59E0B` - Warning/achievement colors

### Typography
- **Primary Font**: Orbitron (gaming aesthetic)
- **Secondary Font**: System UI fallbacks

### Components
- **Retro Cards**: Glassmorphism effect with backdrop blur
- **Retro Buttons**: Gradient backgrounds with hover animations
- **Glow Effects**: Text and element highlighting
- **Like Animations**: 2000s-style pulse effects

## 🔐 Security & Moderation

### Content Guidelines
- ✅ Original fanart and personal screenshots
- ✅ Respectful community interactions
- ❌ No ROM content or direct game assets
- ❌ No offensive or inappropriate content
- ❌ No copyright violations

### Moderation Features
- Automated content filtering
- User reporting system
- Manual review queue
- NSFW content tagging
- Community guidelines enforcement

## 🎮 Supported Games

### Nintendo 64 Classics
- Mario Kart 64
- Super Mario 64
- The Legend of Zelda: Ocarina of Time
- The Legend of Zelda: Majora's Mask
- GoldenEye 007
- Perfect Dark
- Banjo-Kazooie
- Donkey Kong 64
- Star Fox 64
- F-Zero X

### Platform Support
- Nintendo 64 (Primary)
- Super Nintendo
- Nintendo Entertainment System
- Other retro platforms

## 🏆 Gamification Details

### Level System
- **Bronze Artist**: 0-999 points
- **Silver Artist**: 1,000-2,499 points
- **Gold Artist**: 2,500-4,999 points
- **Platinum Artist**: 5,000+ points

### Point System
- **Upload**: +10 points per piece
- **Like Received**: +1 point per like
- **Top Comment**: +5 bonus points
- **Weekly Top 3**: +50 bonus points
- **Monthly Winner**: +200 bonus points

### Badges
- **Retro Picasso**: Create 20+ fanart pieces
- **Speedrun Shooter**: Upload 10+ screenshots
- **Art of the Week**: Featured in weekly top
- **Community Pillar**: Receive 100+ likes
- **Competition Winner**: Win monthly challenges

## 🛠️ Technology Stack

### Frontend
- **Next.js 14** - React framework with App Router
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first styling
- **Framer Motion** - Smooth animations
- **Lucide React** - Icon library

### Backend
- **Prisma** - Database ORM
- **PostgreSQL** - Primary database
- **NextAuth.js** - Authentication
- **Cloudinary** - Image hosting and optimization

### Development
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **TypeScript** - Static type checking

## 📱 Responsive Design

The application is fully responsive and optimized for:
- Desktop (1920px+)
- Laptop (1024px-1919px)
- Tablet (768px-1023px)
- Mobile (320px-767px)

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
- **Netlify**: Compatible with Next.js
- **Railway**: Easy PostgreSQL integration
- **DigitalOcean**: App Platform support

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Use Tailwind CSS for styling
- Write meaningful commit messages
- Test on multiple screen sizes
- Ensure accessibility compliance

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- Nintendo for creating the amazing games that inspire this community
- The retro gaming community for their passion and creativity
- Open source contributors who made this project possible

## 📞 Support

- **Issues**: [GitHub Issues](https://github.com/your-username/battle64-community/issues)
- **Discussions**: [GitHub Discussions](https://github.com/your-username/battle64-community/discussions)
- **Email**: support@battle64-community.com

---

**Made with ❤️ for the retro gaming community**