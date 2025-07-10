import React from 'react';
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
  Archive
} from 'lucide-react';

const FeaturesPage = () => {
  const features = [
    {
      icon: CheckSquare,
      title: 'Task Management',
      description: 'Create, assign, and track tasks with ease. Set priorities, due dates, and monitor progress in real-time.',
      color: 'bg-blue-100 text-blue-600',
      benefits: ['Drag & drop interface', 'Priority levels', 'Due date tracking', 'Status updates']
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Work together seamlessly with your team. Assign tasks, share updates, and communicate effectively.',
      color: 'bg-green-100 text-green-600',
      benefits: ['Team member assignment', 'Real-time updates', 'Comment system', 'Activity tracking']
    },
    {
      icon: BarChart3,
      title: 'Project Analytics',
      description: 'Get insights into your project performance with detailed analytics and progress tracking.',
      color: 'bg-purple-100 text-purple-600',
      benefits: ['Completion rates', 'Time tracking', 'Performance metrics', 'Visual reports']
    },
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'Organize your work with intelligent calendar integration and deadline management.',
      color: 'bg-orange-100 text-orange-600',
      benefits: ['Calendar view', 'Deadline alerts', 'Schedule optimization', 'Time blocking']
    },
    {
      icon: Bell,
      title: 'Notifications',
      description: 'Stay updated with smart notifications for task updates, deadlines, and team activities.',
      color: 'bg-red-100 text-red-600',
      benefits: ['Real-time alerts', 'Email notifications', 'Custom preferences', 'Mobile push']
    },
    {
      icon: Shield,
      title: 'Security & Privacy',
      description: 'Your data is protected with enterprise-grade security and privacy controls.',
      color: 'bg-indigo-100 text-indigo-600',
      benefits: ['Data encryption', 'Secure authentication', 'Privacy controls', 'Regular backups']
    }
  ];

  const additionalFeatures = [
    { icon: Zap, title: 'Lightning Fast', description: 'Optimized performance for quick loading and smooth interactions' },
    { icon: Target, title: 'Goal Tracking', description: 'Set and monitor project goals with visual progress indicators' },
    { icon: Clock, title: 'Time Management', description: 'Track time spent on tasks and optimize your productivity' },
    { icon: FileText, title: 'Rich Documentation', description: 'Add detailed descriptions, notes, and attachments to tasks' },
    { icon: Smartphone, title: 'Mobile Responsive', description: 'Access your projects from any device with our responsive design' },
    { icon: Globe, title: 'Cloud Sync', description: 'Your data syncs across all devices in real-time' },
    { icon: TrendingUp, title: 'Progress Tracking', description: 'Visual progress bars and completion statistics' },
    { icon: Filter, title: 'Advanced Filtering', description: 'Filter tasks by status, priority, assignee, and more' },
    { icon: Search, title: 'Powerful Search', description: 'Find any task or project instantly with smart search' },
    { icon: Archive, title: 'Project Archiving', description: 'Keep your workspace clean by archiving completed projects' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Navbar */}
      <nav className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0 flex items-center">
                <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-white" />
                </div>
                <span className="ml-2 text-xl font-bold text-gray-900">Sundays</span>
              </Link>
            </div>
            <div className="flex items-center space-x-4">
              <Link
                to="/"
                className="inline-flex items-center text-blue-600 hover:text-blue-700 transition-colors"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to home
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Features</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Discover all the tools and capabilities that make Sundays the perfect project management solution for your team.
          </p>
        </div>

        {/* Main Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 hover:shadow-2xl transition-shadow duration-300">
              <div className={`w-16 h-16 ${feature.color} rounded-2xl flex items-center justify-center mb-6`}>
                <feature.icon className="w-8 h-8" />
              </div>
              
              <h3 className="text-xl font-bold text-gray-900 mb-4">{feature.title}</h3>
              <p className="text-gray-600 mb-6 leading-relaxed">{feature.description}</p>
              
              <div className="space-y-2">
                {feature.benefits.map((benefit, benefitIndex) => (
                  <div key={benefitIndex} className="flex items-center text-sm text-gray-600">
                    <div className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></div>
                    {benefit}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Additional Features */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Even More Features</h2>
            <p className="text-lg text-gray-600">
              We've packed Sundays with everything you need for successful project management
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {additionalFeatures.map((feature, index) => (
              <div key={index} className="text-center p-4 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                  <feature.icon className="w-6 h-6 text-gray-600" />
                </div>
                <h4 className="font-semibold text-gray-900 mb-2">{feature.title}</h4>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Feature Highlights */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-16">
          {/* Productivity Focus */}
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Boost Productivity</h3>
            </div>
            <p className="text-blue-100 mb-6 leading-relaxed">
              Our intuitive interface and smart features help you focus on what matters most. 
              Spend less time managing and more time creating.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-blue-200" />
                <span className="text-blue-100">Streamlined workflows</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-blue-200" />
                <span className="text-blue-100">Automated notifications</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-blue-200" />
                <span className="text-blue-100">Smart prioritization</span>
              </div>
            </div>
          </div>

          {/* Team Collaboration */}
          <div className="bg-gradient-to-r from-green-500 to-teal-600 rounded-2xl p-8 text-white">
            <div className="flex items-center mb-6">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center mr-4">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-bold">Team Collaboration</h3>
            </div>
            <p className="text-green-100 mb-6 leading-relaxed">
              Built for teams of all sizes. Collaborate seamlessly with real-time updates, 
              shared workspaces, and transparent communication.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-green-200" />
                <span className="text-green-100">Real-time collaboration</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-green-200" />
                <span className="text-green-100">Team activity feeds</span>
              </div>
              <div className="flex items-center">
                <CheckSquare className="w-5 h-5 mr-3 text-green-200" />
                <span className="text-green-100">Shared project spaces</span>
              </div>
            </div>
          </div>
        </div>

        {/* Call to Action */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 text-center">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Get Started?</h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of teams who are already using Sundays to streamline their workflow and boost productivity.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/signup"
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-3 rounded-lg text-lg font-medium hover:from-blue-700 hover:to-purple-700 transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-1"
            >
              Try Today
            </Link>
            <Link
              to="/contact"
              className="border-2 border-gray-300 hover:border-blue-500 text-gray-700 hover:text-blue-600 px-8 py-3 rounded-lg text-lg font-medium transition-all"
            >
              Contact Sales
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <p className="text-gray-400">
              © <a href="https://innovas.ai/" target="_blank" rel="noopener noreferrer" className="text-blue-400 hover:text-blue-300 transition-colors">Innovas AI</a> 2025. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default FeaturesPage;