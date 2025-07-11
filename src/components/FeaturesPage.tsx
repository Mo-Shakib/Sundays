import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  CheckSquare, 
  Users, 
  Calendar, 
  Bell, 
  Shield, 
  Zap, 
  Target, 
  Clock, 
  FileText, 
  Smartphone,
  Globe,
  TrendingUp,
  Filter,
  Search,
  Archive,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Menu,
  X
} from 'lucide-react';

const FeaturesPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const features = [
    {
      icon: CheckSquare,
      title: 'Smart Task Management',
      description: 'Create, assign, and track tasks with intelligent prioritization and automated workflows. Never miss a deadline again.',
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200',
      benefits: ['Drag & drop interface', 'Priority levels', 'Due date tracking', 'Status updates']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with your team members, comments, and activity feeds. Available with Team plans for seamless teamwork.',
      color: 'from-green-500 to-green-600',
      gradient: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200',
      benefits: ['Team member assignment', 'Real-time updates', 'Comment system', 'Activity tracking']
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights into productivity, completion rates, and team performance. Make data-driven decisions.',
      color: 'from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200',
      benefits: ['Completion rates', 'Time tracking', 'Performance metrics', 'Visual reports']
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent scheduling with deadline management and calendar integration. Plan better, achieve more.',
      color: 'from-orange-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200',
      benefits: ['Calendar view', 'Deadline alerts', 'Schedule optimization', 'Time blocking']
    },
    {
      icon: Bell,
      title: 'Intelligent Notifications',
      description: 'Stay updated with smart notifications and customizable alert preferences. Never miss what matters.',
      color: 'from-red-500 to-red-600',
      gradient: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200',
      benefits: ['Real-time alerts', 'Email notifications', 'Custom preferences', 'Mobile push']
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, SSO, and compliance certifications. Your data is always safe.',
      color: 'from-indigo-500 to-indigo-600',
      gradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200',
      benefits: ['Data encryption', 'Secure authentication', 'Privacy controls', 'Regular backups']
    }
  ];

  const additionalFeatures = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized performance for quick loading and smooth interactions', color: 'text-yellow-600' },
    { icon: Target, title: 'Goal Tracking', description: 'Set and monitor project goals with visual progress indicators', color: 'text-blue-600' },
    { icon: Clock, title: 'Time Management', description: 'Track time spent on tasks and optimize your productivity', color: 'text-green-600' },
    { icon: FileText, title: 'Rich Documentation', description: 'Add detailed descriptions, notes, and attachments to tasks', color: 'text-purple-600' },
    { icon: Smartphone, title: 'Mobile Responsive', description: 'Access your projects from any device with our responsive design', color: 'text-pink-600' },
    { icon: Globe, title: 'Cloud Sync', description: 'Your data syncs across all devices in real-time', color: 'text-indigo-600' },
    { icon: TrendingUp, title: 'Progress Tracking', description: 'Visual progress bars and completion statistics', color: 'text-emerald-600' },
    { icon: Filter, title: 'Advanced Filtering', description: 'Filter tasks by status, priority, assignee, and more', color: 'text-orange-600' },
    { icon: Search, title: 'Powerful Search', description: 'Find any task or project instantly with smart search', color: 'text-cyan-600' },
    { icon: Archive, title: 'Project Archiving', description: 'Keep your workspace clean by archiving completed projects', color: 'text-gray-600' }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Sundays</span>
              </Link>
              <div className="hidden md:flex md:items-center md:ml-10">
                <div className="flex items-center space-x-8">
                  <Link to="/" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Home</Link>
                  <Link to="/features" className="text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Features</Link>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Contact</Link>
                </div>
              </div>
            </div>
            <div className="hidden md:flex md:items-center md:space-x-4">
              <Link
                to="/login"
                className="text-gray-600 hover:text-gray-900 px-4 py-2 text-sm font-medium transition-colors duration-200"
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
              >
                Try Free Today
              </Link>
            </div>
            
            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none focus:text-gray-900 p-2"
              >
                <Menu className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b border-gray-200">
              <div className="flex items-center">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Sundays</span>
              </div>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-600 hover:text-gray-900 p-2"
              >
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="flex-1 px-4 py-6 space-y-6">
              <Link 
                to="/" 
                className="block text-gray-600 hover:text-blue-600 text-lg font-medium transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Home
              </Link>
              <Link 
                to="/features" 
                className="block text-blue-600 text-lg font-medium transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="block text-gray-600 hover:text-blue-600 text-lg font-medium transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                About
              </Link>
              <Link 
                to="/contact" 
                className="block text-gray-600 hover:text-blue-600 text-lg font-medium transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Contact
              </Link>
            </div>
            <div className="p-4 border-t border-gray-200 space-y-3">
              <Link
                to="/login"
                className="block w-full text-center text-gray-600 hover:text-gray-900 py-3 px-4 font-medium transition-colors duration-200"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Sign In
              </Link>
              <Link
                to="/signup"
                className="block w-full text-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 px-4 rounded-xl font-medium transition-all duration-200 shadow-lg"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Try Free Today
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-12">
          <div className="text-center">
            <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-6 border border-blue-200">
              <Sparkles className="w-4 h-4 mr-2" />
              <span>Everything you need to succeed</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Powerful
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Features
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Discover all the tools and capabilities that make Sundays the perfect project management solution for teams of all sizes.
            </p>
          </div>
        </div>
      </section>

      {/* Main Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Core <span className="text-blue-600">capabilities</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Essential features designed to streamline your workflow and boost team productivity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group ${feature.gradient} border-2 rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
                
                <div className="space-y-3">
                  {feature.benefits.map((benefit, benefitIndex) => (
                    <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                      <CheckCircle className="w-4 h-4 text-green-500 mr-3 flex-shrink-0" />
                      {benefit}
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Additional Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Even more</span> to love
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've packed Sundays with everything you need for successful project management
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
              {additionalFeatures.map((feature, index) => (
                <div key={index} className="group text-center">
                  <div className="relative w-16 h-16 bg-white rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300 border border-gray-100">
                    <feature.icon className={`w-8 h-8 ${feature.color}`} />
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 rounded-2xl transition-opacity duration-300"></div>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{feature.title}</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Feature Highlights Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Productivity Focus */}
            <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
              <div className="absolute top-4 right-4 opacity-20">
                <TrendingUp className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <TrendingUp className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold">Boost Productivity</h3>
                </div>
                <p className="text-blue-100 mb-8 leading-relaxed text-lg">
                  Our intuitive interface and smart features help you focus on what matters most. 
                  Spend less time managing and more time creating.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-blue-200 flex-shrink-0" />
                    <span className="text-blue-100 text-lg">Streamlined workflows</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-blue-200 flex-shrink-0" />
                    <span className="text-blue-100 text-lg">Automated notifications</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-blue-200 flex-shrink-0" />
                    <span className="text-blue-100 text-lg">Smart prioritization</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Collaboration */}
            <div className="relative bg-gradient-to-r from-green-600 to-emerald-600 rounded-3xl p-8 md:p-12 text-white overflow-hidden shadow-2xl">
              <div className="absolute top-4 right-4 opacity-20">
                <Users className="w-24 h-24" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mr-4 backdrop-blur-sm">
                    <Users className="w-8 h-8" />
                  </div>
                  <h3 className="text-3xl font-bold">Team Collaboration</h3>
                </div>
                <p className="text-green-100 mb-8 leading-relaxed text-lg">
                  Built for teams of all sizes. Collaborate seamlessly with real-time updates, 
                  shared workspaces, and transparent communication.
                </p>
                <div className="space-y-4">
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-green-200 flex-shrink-0" />
                    <span className="text-green-100 text-lg">Real-time collaboration</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-green-200 flex-shrink-0" />
                    <span className="text-green-100 text-lg">Team activity feeds</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="w-6 h-6 mr-4 text-green-200 flex-shrink-0" />
                    <span className="text-green-100 text-lg">Shared project spaces</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-blue-200">experience</span> these features?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams who are already using Sundays to streamline their workflow and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="group bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center mb-4">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold">Sundays</span>
              </div>
              <p className="text-gray-400 mb-6 max-w-md text-lg">
                The intelligent project management platform that helps teams work smarter, not harder.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors duration-200">Features</Link></li>
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Company</h3>
              <ul className="space-y-3">
                <li><Link to="/about" className="text-gray-400 hover:text-white transition-colors duration-200">About</Link></li>
                <li><Link to="/contact" className="text-gray-400 hover:text-white transition-colors duration-200">Contact</Link></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Careers</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Blog</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © <a href="#" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Sundays</a> 2025. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default FeaturesPage;