import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  Mail, 
  Bug, 
  Heart, 
  Code, 
  Coffee, 
  Sparkles,
  Target,
  Users,
  Zap,
  Shield,
  CheckCircle,
  ArrowRight,
  Rocket,
  Globe,
  Award,
  Menu,
  X
} from 'lucide-react';

const AboutPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const values = [
    {
      icon: Heart,
      title: 'Simplicity',
      description: 'Clean, intuitive design that gets out of your way so you can focus on what matters.',
      color: 'from-pink-500 to-red-500',
      gradient: 'bg-gradient-to-br from-pink-50 to-red-50 border-pink-200'
    },
    {
      icon: Code,
      title: 'Efficiency',
      description: 'Powerful features that help you work smarter, not harder, and deliver results faster.',
      color: 'from-blue-500 to-indigo-500',
      gradient: 'bg-gradient-to-br from-blue-50 to-indigo-50 border-blue-200'
    },
    {
      icon: Coffee,
      title: 'Enjoyment',
      description: 'Making project management enjoyable rather than a chore you have to endure.',
      color: 'from-amber-500 to-orange-500',
      gradient: 'bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200'
    }
  ];

  const technologies = [
    { name: 'React', description: 'Modern UI Framework', color: 'text-blue-600', bg: 'bg-blue-100' },
    { name: 'TypeScript', description: 'Type Safety', color: 'text-blue-700', bg: 'bg-blue-100' },
    { name: 'Supabase', description: 'Backend & Database', color: 'text-green-600', bg: 'bg-green-100' },
    { name: 'Tailwind', description: 'Styling Framework', color: 'text-cyan-600', bg: 'bg-cyan-100' },
    { name: 'Vite', description: 'Build Tool', color: 'text-purple-600', bg: 'bg-purple-100' },
    { name: 'Vercel', description: 'Deployment', color: 'text-gray-800', bg: 'bg-gray-100' }
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
                  <Link to="/features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Features</Link>
                  <Link to="/about" className="text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Contact</Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                className="block text-gray-600 hover:text-blue-600 text-lg font-medium transition-colors duration-200 py-3 border-b border-gray-100"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link 
                to="/about" 
                className="block text-blue-600 text-lg font-medium transition-colors duration-200 py-3 border-b border-gray-100"
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
              <span>Built with passion for productivity</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              About
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Sundays
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              A modern project management platform designed to make your Sundays (and every other day) more productive and organized.
            </p>
          </div>
        </div>
      </section>

      {/* Mission Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Our <span className="text-blue-600">Mission</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              We believe that great work happens when teams have the right tools to collaborate, organize, and execute their ideas. 
              Sundays was built to eliminate the chaos of scattered tasks and bring clarity to your workflow.
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {values.map((value, index) => (
                <div key={index} className={`group ${value.gradient} border-2 rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl text-center`}>
                  <div className={`w-16 h-16 bg-gradient-to-r ${value.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <value.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">{value.title}</h3>
                  <p className="text-gray-600 leading-relaxed">{value.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Developer Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Meet the <span className="text-blue-600">Developer</span>
            </h2>
            <p className="text-xl text-gray-600">
              Built with passion and attention to detail
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <div className="bg-white rounded-3xl shadow-xl border border-gray-200 overflow-hidden">
              <div className="relative bg-gradient-to-r from-blue-600 to-purple-600 px-8 py-12 text-white">
                <div className="absolute top-4 right-4 opacity-20">
                  <Code className="w-24 h-24" />
                </div>
                <div className="relative z-10">
                  <div className="flex items-center mb-6">
                    <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center text-white text-2xl font-bold mr-6 backdrop-blur-sm">
                      S
                    </div>
                    <div>
                      <h3 className="text-3xl font-bold">Shakib</h3>
                      <p className="text-blue-200 text-lg">Full Stack Developer</p>
                    </div>
                  </div>
                  
                  <p className="text-blue-100 text-lg leading-relaxed">
                    Hi! I'm Shakib, the developer behind Sundays. I created this platform because I believe that good project management 
                    tools should be powerful yet simple, beautiful yet functional. Every feature has been carefully crafted to help teams 
                    work better together.
                  </p>
                </div>
              </div>
              
              <div className="p-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Contact</p>
                      <a href="mailto:shakib@innovas.ai" className="text-blue-600 hover:text-blue-700 transition-colors">
                        shakib@innovas.ai
                      </a>
                    </div>
                  </div>
                  
                  <div className="flex items-center p-4 bg-red-50 rounded-2xl border border-red-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                      <Bug className="w-6 h-6 text-red-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Bug Reports</p>
                      <a href="mailto:shakib@innovas.ai?subject=Bug Report - Sundays App" className="text-red-600 hover:text-red-700 transition-colors">
                        Report an Issue
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Built with <span className="text-blue-600">Modern Technology</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Leveraging the latest tools and frameworks for the best user experience
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6">
              {technologies.map((tech, index) => (
                <div key={index} className="group text-center p-6 bg-white rounded-2xl border border-gray-100 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1">
                  <div className={`w-16 h-16 ${tech.bg} rounded-2xl flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    <span className={`${tech.color} font-bold text-xl`}>{tech.name.charAt(0)}</span>
                  </div>
                  <h4 className="font-bold text-gray-900 mb-2">{tech.name}</h4>
                  <p className="text-sm text-gray-600">{tech.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Why <span className="text-blue-600">Sundays</span> Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Team-First</h3>
              <p className="text-gray-600">Designed for collaboration</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-green-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Zap className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Lightning Fast</h3>
              <p className="text-gray-600">Optimized performance</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Shield className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Secure</h3>
              <p className="text-gray-600">Your data is protected</p>
            </div>
            
            <div className="text-center p-8 bg-white rounded-3xl shadow-xl border border-gray-200 hover:shadow-2xl transition-shadow duration-300">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-orange-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-2">Goal-Oriented</h3>
              <p className="text-gray-600">Focus on what matters</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to <span className="text-blue-200">transform</span> your workflow?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams who have already made the switch to smarter project management.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="group bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
            >
              <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
              Start Your Free Trial
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Get in Touch
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
              © <a href="$" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Sundays</a> 2025. All rights reserved.
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

export default AboutPage;