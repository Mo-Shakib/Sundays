import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, BarChart3, Mail, Bug, Heart, Code, Coffee } from 'lucide-react';

const AboutPage = () => {
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
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            About <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">Sundays</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            A modern project management platform designed to make your Sundays (and every other day) more productive and organized.
          </p>
        </div>

        {/* Mission Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              We believe that great work happens when teams have the right tools to collaborate, organize, and execute their ideas. 
              Sundays was built to eliminate the chaos of scattered tasks and bring clarity to your workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <BarChart3 className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Simplicity</h3>
              <p className="text-gray-600">Clean, intuitive design that gets out of your way so you can focus on what matters.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Code className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Efficiency</h3>
              <p className="text-gray-600">Powerful features that help you work smarter, not harder, and deliver results faster.</p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                <Coffee className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Enjoyment</h3>
              <p className="text-gray-600">Making project management enjoyable rather than a chore you have to endure.</p>
            </div>
          </div>
        </div>

        {/* Developer Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 mb-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Developer</h2>
            <p className="text-lg text-gray-600">
              Built with passion and attention to detail
            </p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
              <div className="flex items-center mb-4">
                <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-xl font-bold mr-4">
                  S
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Shakib</h3>
                  <p className="text-blue-600">Full Stack Developer</p>
                </div>
              </div>
              
              <p className="text-gray-700 mb-6">
                Hi! I'm Shakib, the developer behind Mondays. I created this platform because I believe that good project management 
                tools should be powerful yet simple, beautiful yet functional. Every feature has been carefully crafted to help teams 
                work better together.
              </p>

              <div className="space-y-3">
                <div className="flex items-center text-gray-600">
                  <Mail className="w-5 h-5 mr-3 text-blue-500" />
                  <span className="font-medium">Contact:</span>
                  <a href="mailto:shakib@innovas.ai" className="ml-2 text-blue-600 hover:text-blue-700 transition-colors">
                    shakib@innovas.ai
                  </a>
                </div>
                
                <div className="flex items-center text-gray-600">
                  <Bug className="w-5 h-5 mr-3 text-red-500" />
                  <span className="font-medium">Bug Reports:</span>
                  <a href="mailto:shakib@innovas.ai?subject=Bug Report - Mondays App" className="ml-2 text-red-600 hover:text-red-700 transition-colors">
                    Report an Issue
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technology Section */}
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Built with Modern Technology</h2>
            <p className="text-lg text-gray-600">
              Leveraging the latest tools and frameworks for the best user experience
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-blue-600 font-bold text-lg">R</span>
              </div>
              <h4 className="font-semibold text-gray-900">React</h4>
              <p className="text-sm text-gray-600">Modern UI Framework</p>
            </div>
            
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-green-600 font-bold text-lg">S</span>
              </div>
              <h4 className="font-semibold text-gray-900">Supabase</h4>
              <p className="text-sm text-gray-600">Backend & Database</p>
            </div>
            
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-purple-600 font-bold text-lg">T</span>
              </div>
              <h4 className="font-semibold text-gray-900">TypeScript</h4>
              <p className="text-sm text-gray-600">Type Safety</p>
            </div>
            
            <div className="text-center p-4 rounded-lg hover:bg-gray-50 transition-colors">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <span className="text-indigo-600 font-bold text-lg">T</span>
              </div>
              <h4 className="font-semibold text-gray-900">Tailwind</h4>
              <p className="text-sm text-gray-600">Styling Framework</p>
            </div>
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

export default AboutPage;