# PT Mada Jagad Mulia - Corporate Landing Page

A modern, responsive landing page for PT Mada Jagad Mulia, showcasing the company's engineering and construction services with a focus on sustainable development.

![PT Mada Jagad Mulia](src/assets/hero-bg.jpg)

## 🌟 Features

- 🎨 Modern glass-morphism design
- 📱 Fully responsive for all devices
- ⚡ Fast and optimized performance
- 🔄 Real-time content management
- 📊 Built-in analytics dashboard
- 🔒 Secure admin panel
- 🌐 SEO optimized

## 🛠️ Tech Stack

- **Frontend:**
  - React 18
  - TypeScript
  - Tailwind CSS
  - shadcn/ui components
  - Lucide icons
  - React Router v6

- **Backend:**
  - Supabase (Database & Authentication)
  - Row Level Security (RLS)
  - Real-time subscriptions

- **Development Tools:**
  - Vite
  - ESLint
  - PostCSS
  - Git

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ (LTS recommended)
- npm or Bun
- Git

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/rikoarik/Landing-Page-Mada-Jagad-Mulia.git
   cd Landing-Page-Mada-Jagad-Mulia
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   bun install
   ```

3. Create a `.env` file in the root directory with your Supabase credentials:
   ```env
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   ```

4. Start the development server:
   ```bash
   npm run dev
   # or
   bun run dev
   ```

Visit `http://localhost:5173` to see the app running.

## 📋 Project Structure

```
src/
├── assets/          # Static assets (images, etc.)
├── components/      # Reusable React components
│   ├── admin/      # Admin panel components
│   ├── sections/   # Landing page sections
│   └── ui/         # UI components (shadcn/ui)
├── hooks/          # Custom React hooks
├── integrations/   # External service integrations
├── lib/           # Utility functions
└── pages/         # Main page components
```

## 🔑 Admin Panel

The admin panel provides a comprehensive content management system with features like:

- Content editing for all sections
- Site settings management
- Analytics dashboard
- User management
- Role-based access control

Access the admin panel at `/admin` route.

## 🔧 Configuration

### Site Settings

Edit site-wide settings through the admin panel:
- Company information
- Contact details
- Hero section content
- About section content

### Database Migrations

Run migrations to set up the database:
```bash
npm run db:migration:up
# or
bun run db:migration:up
```

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

Project Link: [https://github.com/rikoarik/Landing-Page-Mada-Jagad-Mulia](https://github.com/rikoarik/Landing-Page-Mada-Jagad-Mulia)
