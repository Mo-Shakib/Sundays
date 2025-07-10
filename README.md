# Sundays - AI Powered Project Management Platform

A beautiful, intuitive project management application built with React, TypeScript, and Supabase. Sundays helps teams organize their work, track progress, and collaborate effectively.

![Sundays Dashboard](https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&dpr=1)

## ✨ Features

### 🎯 **Core Functionality**
- **Project Management** - Create, organize, and track multiple projects
- **Task Management** - Add, assign, and monitor tasks with priorities and due dates
- **Team Collaboration** - Real-time updates and team member assignment
- **Progress Tracking** - Visual progress indicators and completion statistics
- **Smart Analytics** - Productivity scores and performance insights

### 📊 **Dashboard & Analytics**
- **Comprehensive Dashboard** - Overview of all projects and tasks
- **Productivity Metrics** - Track completion rates, overdue tasks, and time savings
- **Visual Progress Bars** - See project completion at a glance
- **Task Filtering** - Filter by status, priority, assignee, and due dates
- **Search Functionality** - Quickly find any task or project

### 🎨 **User Experience**
- **Beautiful UI** - Modern, clean design with smooth animations
- **Responsive Design** - Works perfectly on desktop, tablet, and mobile
- **Dark/Light Themes** - Customizable appearance (coming soon)
- **Intuitive Navigation** - Easy-to-use sidebar and navigation
- **Real-time Updates** - Live synchronization across all devices

### 🔐 **Security & Authentication**
- **Secure Authentication** - Email/password login with Supabase Auth
- **User Profiles** - Personal user accounts and data isolation
- **Data Privacy** - Your data is secure and private
- **Row Level Security** - Database-level security policies

## 🚀 Live Demo

Visit the live application: [https://musical-cranachan-067e33.netlify.app](https://musical-cranachan-067e33.netlify.app)

## 🛠️ Tech Stack

### **Frontend**
- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development
- **Tailwind CSS** - Utility-first CSS framework
- **Lucide React** - Beautiful, customizable icons
- **React Router** - Client-side routing

### **Backend & Database**
- **Supabase** - Backend-as-a-Service with PostgreSQL
- **PostgreSQL** - Robust, scalable database
- **Row Level Security** - Database-level security
- **Real-time Subscriptions** - Live data updates

### **Development & Deployment**
- **Vite** - Fast build tool and development server
- **ESLint** - Code linting and quality
- **Netlify** - Deployment and hosting
- **Git** - Version control

## 📦 Installation

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Supabase account (for backend)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/sundays-project-management.git
cd sundays-project-management
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Environment Setup
Create a `.env` file in the root directory:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 4. Database Setup
Run the SQL migrations in your Supabase dashboard:
```sql
-- Run the migration files in order:
-- 1. supabase/migrations/20250710193025_graceful_spire.sql
-- 2. supabase/migrations/20250710195926_bronze_jungle.sql
-- 3. supabase/migrations/20250710201903_crystal_tree.sql
-- 4. supabase/migrations/20250710201911_bitter_flame.sql
```

### 5. Start Development Server
```bash
npm run dev
```

Visit `http://localhost:5173` to see the application.

## 🗄️ Database Schema

### **Tables**
- **profiles** - User profile information
- **projects** - Project data with color themes and status
- **tasks** - Task details with assignments and priorities

### **Key Features**
- **Row Level Security** - Users can only access their own data
- **Foreign Key Constraints** - Data integrity and relationships
- **Automatic Timestamps** - Created and updated timestamps
- **Flexible Schema** - Support for tags, comments, and file attachments

## 🎨 Design System

### **Colors**
- **Primary** - Blue gradient (#3B82F6 to #8B5CF6)
- **Success** - Green (#10B981)
- **Warning** - Yellow (#F59E0B)
- **Error** - Red (#EF4444)
- **Neutral** - Gray scale

### **Typography**
- **Headings** - Bold, clear hierarchy
- **Body Text** - Readable, accessible
- **Code** - Monospace for technical content

### **Components**
- **Buttons** - Consistent styling with hover states
- **Cards** - Clean, shadowed containers
- **Modals** - Centered, accessible dialogs
- **Forms** - User-friendly inputs with validation

## 📱 Responsive Design

### **Breakpoints**
- **Mobile** - 320px to 768px
- **Tablet** - 768px to 1024px
- **Desktop** - 1024px and above

### **Mobile Features**
- **Collapsible Sidebar** - Space-efficient navigation
- **Touch-Friendly** - Optimized for touch interactions
- **Responsive Tables** - Horizontal scrolling on small screens
- **Mobile Search** - Expandable search functionality

## 🔧 Development

### **Available Scripts**
```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run lint         # Run ESLint
```

### **Code Structure**
```
src/
├── components/          # React components
│   ├── dashboard/      # Dashboard-specific components
│   ├── LandingPage.tsx # Marketing landing page
│   └── ...
├── context/            # React context providers
├── hooks/              # Custom React hooks
├── lib/                # Utility libraries
└── types/              # TypeScript type definitions
```

### **Best Practices**
- **Component Organization** - One component per file
- **TypeScript** - Strict type checking
- **Responsive Design** - Mobile-first approach
- **Accessibility** - WCAG 2.1 compliance
- **Performance** - Optimized builds and lazy loading

## 🚀 Deployment

### **Netlify Deployment**
The application is automatically deployed to Netlify on every push to the main branch.

1. **Build Command**: `npm run build`
2. **Publish Directory**: `dist`
3. **Environment Variables**: Set in Netlify dashboard

### **Manual Deployment**
```bash
npm run build
# Upload dist/ folder to your hosting provider
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. **Fork the repository**
2. **Create a feature branch** (`git checkout -b feature/amazing-feature`)
3. **Commit your changes** (`git commit -m 'Add amazing feature'`)
4. **Push to the branch** (`git push origin feature/amazing-feature`)
5. **Open a Pull Request**

### **Development Guidelines**
- Follow the existing code style
- Add TypeScript types for new features
- Write responsive, accessible components
- Test on multiple devices and browsers
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Supabase** - For the amazing backend platform
- **Tailwind CSS** - For the utility-first CSS framework
- **Lucide** - For the beautiful icon library
- **Pexels** - For the stock photography
- **Netlify** - For seamless deployment

## 📞 Support

- **Email**: [shakib@innovas.ai](mailto:shakib@innovas.ai)
- **Website**: [https://innovas.ai](https://innovas.ai)
- **Issues**: [GitHub Issues](https://github.com/mo-shakib/sundays/issues)

## 🗺️ Roadmap

### **Upcoming Features**
- [ ] **Real-time Collaboration** - Live cursors and editing
- [ ] **File Attachments** - Upload and manage files
- [ ] **Time Tracking** - Built-in time tracking tools
- [ ] **Calendar Integration** - Sync with Google Calendar
- [ ] **Mobile Apps** - Native iOS and Android apps
- [ ] **Advanced Analytics** - More detailed insights
- [ ] **Team Management** - Role-based permissions
- [ ] **API Access** - RESTful API for integrations

### **Recent Updates**
- ✅ **Mobile Responsiveness** - Improved mobile experience
- ✅ **Project Archiving** - Complete and archive projects
- ✅ **Task Filtering** - Advanced filtering options
- ✅ **Productivity Metrics** - Performance tracking
- ✅ **User Authentication** - Secure login system

---

**Built with ❤️ by [Innovas AI](https://innovas.ai)**

*Making project management simple, beautiful, and effective.*
