import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, 
  CheckCircle, 
  Users, 
  Calendar, 
  BarChart3, 
  Star,
  Play,
  Zap,
  Shield,
  Clock,
  Target,
  TrendingUp,
  MessageSquare,
  Bell,
  Filter,
  Search,
  Archive,
  Award,
  Globe,
  Smartphone,
  ChevronRight,
  Quote,
  Sparkles,
  Rocket,
  Heart,
  CheckCircle2
} from 'lucide-react';

const LandingPage = () => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  // Auto-rotate testimonials
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: CheckCircle,
      title: 'Smart Task Management',
      description: 'Create, assign, and track tasks with intelligent prioritization and automated workflows. Never miss a deadline again.',
      color: 'from-blue-500 to-blue-600',
      gradient: 'bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with your team members, comments, and activity feeds. Available with Team plans for seamless teamwork.',
      color: 'from-green-500 to-green-600',
      gradient: 'bg-gradient-to-br from-green-50 to-green-100 border-green-200'
    },
    {
      icon: BarChart3,
      title: 'Advanced Analytics',
      description: 'Detailed insights into productivity, completion rates, and team performance. Make data-driven decisions.',
      color: 'from-purple-500 to-purple-600',
      gradient: 'bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200'
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Intelligent scheduling with deadline management and calendar integration. Plan better, achieve more.',
      color: 'from-orange-500 to-orange-600',
      gradient: 'bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200'
    },
    {
      icon: Bell,
      title: 'Intelligent Notifications',
      description: 'Stay updated with smart notifications and customizable alert preferences. Never miss what matters.',
      color: 'from-red-500 to-red-600',
      gradient: 'bg-gradient-to-br from-red-50 to-red-100 border-red-200'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level security with encryption, SSO, and compliance certifications. Your data is always safe.',
      color: 'from-indigo-500 to-indigo-600',
      gradient: 'bg-gradient-to-br from-indigo-50 to-indigo-100 border-indigo-200'
    }
  ];

  const stats = [
    { number: '50K+', label: 'Active Users', icon: Users },
    { number: '1M+', label: 'Tasks Completed', icon: CheckCircle },
    { number: '99.9%', label: 'Uptime', icon: Zap },
    { number: '4.9/5', label: 'User Rating', icon: Star }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager at TechCorp',
      avatar: 'SJ',
      content: 'Sundays transformed how our team manages projects. The intuitive interface and powerful features helped us increase productivity by 40%.',
      rating: 5
    },
    {
      name: 'Michael Chen',
      role: 'Startup Founder',
      avatar: 'MC',
      content: 'As a growing startup, we needed a solution that could scale with us. Sundays delivered exactly that with its flexible project management tools.',
      rating: 5
    },
    {
      name: 'Emily Rodriguez',
      role: 'Team Lead at DesignStudio',
      avatar: 'ER',
      content: 'The collaboration features are outstanding. Our remote team feels more connected than ever, and project visibility has never been better.',
      rating: 5
    }
  ];

  const pricingPlans = [
    {
      name: 'Solo',
      price: 'Free',
      description: 'Perfect for individuals getting started',
      features: ['Up to 5 projects', 'Basic task management', 'Personal dashboard', 'Mobile app access', 'Individual workspace'],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'Team',
      price: '$10',
      period: '/seat/month',
      description: 'Collaboration features for teams',
      features: ['Everything in Solo', 'Team collaboration', 'Advanced analytics', 'Time tracking', 'Priority support', 'Unlimited projects'],
      cta: 'Start Team Trial',
      popular: true
    },
    {
      name: 'Enterprise',
      price: 'Custom',
      description: 'Advanced solutions for large organizations',
      features: ['Everything in Team', 'SSO integration', 'Advanced security', 'Custom integrations', 'Dedicated support', 'Performance insights'],
      cta: 'Contact Sales',
      popular: false
    }
  ];

  const tabContent = {
    dashboard: {
      title: 'Comprehensive Dashboard',
      description: 'Get a bird\'s eye view of all your projects, tasks, and team performance with our intuitive dashboard.',
      image: 'https://images.pexels.com/photos/590022/pexels-photo-590022.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    tasks: {
      title: 'Smart Task Management',
      description: 'Create, assign, and track tasks with intelligent prioritization and automated workflows.',
      image: 'https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    },
    analytics: {
      title: 'Powerful Analytics',
      description: 'Make data-driven decisions with detailed insights into productivity and team performance.',
      image: 'https://images.pexels.com/photos/590020/pexels-photo-590020.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1'
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Navbar */}
      <nav className="bg-white/95 backdrop-blur-md border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center">
                <div className="w-9 h-9 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-3 text-xl font-bold text-gray-900">Sundays</span>
              </div>
              <div className="hidden md:flex md:items-center md:ml-10">
                <div className="flex items-center space-x-8">
                  <Link to="/landing" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Home</Link>
                  <Link to="/features" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Features</Link>
                  <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                  <Link to="/contact" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Contact</Link>
                </div>
              </div>
            </div>
            <div className="flex items-center space-x-4">
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
                Try Today
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-white to-purple-50">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-left">
              <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-blue-100 to-purple-100 text-blue-800 rounded-full text-sm font-medium mb-8 border border-blue-200">
                <Sparkles className="w-4 h-4 mr-2" />
                <span>New: Smart Task Prioritization</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
                Project Management
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                  Made Simple
                </span>
              </h1>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Transform your team's productivity with Sundays - the intuitive project management platform that adapts to your workflow, not the other way around.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mb-8">
                <Link
                  to="/signup"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Rocket className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Start Free Trial
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center hover:bg-blue-50">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch Demo
                </button>
              </div>
              <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-8 space-y-2 sm:space-y-0 text-sm text-gray-500">
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-medium">Free 14-day trial</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-medium">No credit card required</span>
                </div>
                <div className="flex items-center">
                  <CheckCircle2 className="w-4 h-4 text-green-500 mr-2" />
                  <span className="font-medium">Cancel anytime</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="relative z-10">
                <img 
                  src="https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
                  alt="Team collaborating on project management"
                  className="w-full h-auto rounded-3xl shadow-2xl border border-gray-200"
                />
              </div>
              <div className="absolute -top-4 -right-4 w-72 h-72 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
              <div className="absolute -bottom-8 -left-4 w-72 h-72 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
            </div>
          </div>
        </div>
      </section>

      {/* User-Focused Benefits Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              Why teams <span className="text-blue-600">choose</span> Sundays
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join thousands of teams who've transformed their productivity with our intuitive project management platform
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="group text-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-green-500 to-emerald-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Clock className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Save 5+ Hours Weekly</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Streamline your workflow and eliminate time-wasting meetings with smart automation</p>
            </div>
            
            <div className="group text-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-blue-500 to-cyan-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <TrendingUp className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">40% Faster Delivery</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Complete projects ahead of schedule with intelligent task prioritization and tracking</p>
            </div>
            
            <div className="group text-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-purple-500 to-pink-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Users className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Better Team Sync</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Keep everyone aligned with real-time updates and transparent communication</p>
            </div>
            
            <div className="group text-center">
              <div className="relative w-20 h-20 bg-gradient-to-br from-orange-500 to-red-600 rounded-3xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300 shadow-lg">
                <Target className="w-10 h-10 text-white" />
                <div className="absolute inset-0 bg-white opacity-0 group-hover:opacity-20 rounded-3xl transition-opacity duration-300"></div>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">Zero Learning Curve</h3>
              <p className="text-gray-600 text-sm leading-relaxed">Get your team productive from day one with our intuitive, user-friendly interface</p>
            </div>
          </div>
          
          {/* Call to Action */}
          <div className="text-center mt-16">
            <div className="relative bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
              <div className="absolute top-4 right-4">
                <Heart className="w-6 h-6 text-pink-400 animate-pulse" />
              </div>
              <h3 className="text-3xl font-bold text-gray-900 mb-4">
                Ready to <span className="text-blue-600">boost</span> your team's productivity?
              </h3>
              <p className="text-gray-600 mb-8 max-w-2xl mx-auto text-lg">
                Start your free 14-day trial today. No credit card required, cancel anytime.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link
                  to="/signup"
                  className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1 flex items-center justify-center"
                >
                  <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
                  Try Today - It's Free
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <button className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center hover:bg-blue-50">
                  <Play className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Watch 2-min Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Interactive Features Section */}
      <section id="features" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Everything you need to <span className="text-blue-600">manage projects</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Powerful features designed to streamline your workflow and boost team productivity
            </p>
          </div>

          {/* Interactive Tabs */}
          <div className="mb-20">
            <div className="flex justify-center mb-12">
              <div className="bg-white rounded-2xl p-2 shadow-xl border border-gray-200 overflow-x-auto">
                <div className="flex space-x-1 min-w-fit">
                  {Object.keys(tabContent).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold transition-all duration-200 whitespace-nowrap text-sm sm:text-base ${
                        activeTab === tab
                          ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg transform scale-105'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                      }`}
                    >
                      {tab.charAt(0).toUpperCase() + tab.slice(1)}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-3xl shadow-2xl overflow-hidden border border-gray-200">
              <div className="grid grid-cols-1 lg:grid-cols-2">
                <div className="p-12 flex items-center">
                  <div>
                    <h3 className="text-4xl font-bold text-gray-900 mb-6">
                      {tabContent[activeTab].title}
                    </h3>
                    <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                      {tabContent[activeTab].description}
                    </p>
                    <Link
                      to="/features"
                      className="inline-flex items-center text-blue-600 hover:text-blue-700 font-semibold text-lg group"
                    >
                      Learn more
                      <ChevronRight className="w-5 h-5 ml-1 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>
                <div className="relative">
                  <img 
                    src={tabContent[activeTab].image}
                    alt={tabContent[activeTab].title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-600/10 to-purple-600/10"></div>
                </div>
              </div>
            </div>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className={`group ${feature.gradient} border-2 rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
                <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
          
          {/* View All Features Link */}
          <div className="text-center mt-12">
            <Link
              to="/features"
              className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              <Sparkles className="w-5 h-5 mr-2 group-hover:animate-spin" />
              View All Features
              <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              <span className="text-blue-600">Loved</span> by teams worldwide
            </h2>
            <p className="text-xl text-gray-600">
              See what our customers have to say about Sundays
            </p>
          </div>

          <div className="relative">
            <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
              <div className="flex items-center justify-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
                  <Quote className="w-8 h-8 text-white" />
                </div>
              </div>
              <blockquote className="text-2xl md:text-3xl font-medium text-gray-900 text-center mb-8 leading-relaxed">
                "{testimonials[currentTestimonial].content}"
              </blockquote>
              <div className="flex items-center justify-center">
                <div className="flex items-center">
                  <div className="w-14 h-14 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold mr-4 shadow-lg">
                    {testimonials[currentTestimonial].avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900 text-lg">{testimonials[currentTestimonial].name}</div>
                    <div className="text-gray-600">{testimonials[currentTestimonial].role}</div>
                  </div>
                </div>
              </div>
              <div className="flex justify-center mt-6">
                <div className="flex space-x-1">
                  {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                    <Star key={i} className="w-6 h-6 text-yellow-400 fill-current" />
                  ))}
                </div>
              </div>
            </div>

            {/* Testimonial indicators */}
            <div className="flex justify-center mt-8 space-x-3">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentTestimonial(index)}
                  className={`w-4 h-4 rounded-full transition-all duration-200 ${
                    index === currentTestimonial ? 'bg-blue-600 scale-125' : 'bg-gray-300 hover:bg-gray-400'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="pricing" className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Simple, <span className="text-blue-600">transparent</span> pricing
            </h2>
            <p className="text-xl text-gray-600">
              Choose the plan that's right for your team
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {pricingPlans.map((plan, index) => (
              <div key={index} className={`relative bg-white rounded-3xl shadow-xl overflow-hidden border-2 transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 ${
                plan.popular ? 'border-blue-600 transform scale-105' : 'border-gray-200'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-purple-600 text-white text-center py-3 text-sm font-semibold">
                    <Sparkles className="w-4 h-4 inline mr-2" />
                    Most Popular
                  </div>
                )}
                <div className={`p-8 ${plan.popular ? 'pt-16' : ''}`}>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  <div className="mb-8">
                    <span className="text-5xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period && <span className="text-gray-600 text-lg">{plan.period}</span>}
                  </div>
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center">
                        <CheckCircle className="w-5 h-5 text-green-500 mr-3 flex-shrink-0" />
                        <span className="text-gray-600">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <button className={`w-full py-4 px-6 rounded-2xl font-semibold transition-all duration-200 ${
                    plan.popular
                      ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:-translate-y-1'
                      : 'border-2 border-gray-300 text-gray-700 hover:border-blue-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}>
                    {plan.cta}
                  </button>
                </div>
              </div>
            ))}
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
            </Link>
            <Link
              to="/contact"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Talk to Sales
            </Link>
          </div>
        </div>
      </section>

      {/* Learn More About Us Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className="inline-flex items-center px-5 py-2.5 bg-gradient-to-r from-green-100 to-blue-100 text-green-800 rounded-full text-sm font-medium mb-6 border border-green-200">
                <Heart className="w-4 h-4 mr-2" />
                <span>Built with passion for teams</span>
              </div>
              <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                Meet the team behind <span className="text-blue-600">Sundays</span>
              </h2>
              <p className="text-xl text-gray-600 mb-8 leading-relaxed">
                Discover our story, mission, and the technology that powers your productivity. Learn how we're building the future of project management.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/about"
                  className="group inline-flex items-center bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                >
                  <Users className="w-5 h-5 mr-2 group-hover:animate-pulse" />
                  Learn About Us
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Link>
                <Link
                  to="/contact"
                  className="group border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center hover:bg-blue-50"
                >
                  <MessageSquare className="w-5 h-5 mr-2 group-hover:scale-110 transition-transform" />
                  Get in Touch
                </Link>
              </div>
            </div>
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 border border-blue-100 shadow-xl">
                <div className="text-center">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    S
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">Hi, I'm Shakib!</h3>
                  <p className="text-blue-600 font-medium mb-4">Full Stack Developer</p>
                  <p className="text-gray-600 leading-relaxed">
                    I created Sundays because I believe teams deserve better tools. Every feature is crafted with care to help you work smarter, not harder.
                  </p>
                  <div className="mt-6 flex justify-center">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-500 mt-2">Rated 4.9/5 by users worldwide</p>
                </div>
              </div>
            </div>
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
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                  <Globe className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                  <MessageSquare className="w-5 h-5" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200 p-2 rounded-lg hover:bg-gray-800">
                  <Award className="w-5 h-5" />
                </a>
              </div>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3">
                <li><Link to="/features" className="text-gray-400 hover:text-white transition-colors duration-200">Features</Link></li>
                <li><a href="#pricing" className="text-gray-400 hover:text-white transition-colors duration-200">Pricing</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">Integrations</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white transition-colors duration-200">API</a></li>
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
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .bg-grid-pattern {
          background-image: radial-gradient(circle, #e5e7eb 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </div>
  );
};

export default LandingPage;