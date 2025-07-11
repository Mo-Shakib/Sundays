import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowLeft, 
  BarChart3, 
  Mail, 
  MessageSquare, 
  Phone, 
  MapPin, 
  Send, 
  Clock, 
  CheckCircle,
  Sparkles,
  ArrowRight,
  Heart,
  Users,
  Zap,
  Shield,
  Menu,
  X
} from 'lucide-react';

const ContactPage = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Scroll to top when component mounts
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: '',
    type: 'general'
  });
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In a real app, you would send this data to your backend
    console.log('Contact form submitted:', formData);
    setIsSubmitted(true);
    
    // Reset form after 3 seconds
    setTimeout(() => {
      setIsSubmitted(false);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: '',
        type: 'general'
      });
    }, 3000);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const contactMethods = [
    {
      icon: Mail,
      title: 'Email',
      description: 'Get in touch via email',
      contact: 'shakib@innovas.ai',
      href: 'mailto:shakib@innovas.ai',
      color: 'from-blue-500 to-blue-600',
      bg: 'bg-blue-50 border-blue-200'
    },
    {
      icon: MessageSquare,
      title: 'Support',
      description: 'Need help or found a bug?',
      contact: 'Get Support',
      href: 'mailto:shakib@innovas.ai?subject=Support Request - Sundays App',
      color: 'from-green-500 to-green-600',
      bg: 'bg-green-50 border-green-200'
    },
    {
      icon: Clock,
      title: 'Response Time',
      description: 'We typically respond within 24 hours',
      contact: 'Fast & Reliable',
      href: '#',
      color: 'from-purple-500 to-purple-600',
      bg: 'bg-purple-50 border-purple-200'
    }
  ];

  const faqs = [
    {
      question: 'How do I get started?',
      answer: 'Simply sign up for a free account and start creating your first project. Our intuitive interface will guide you through the process.'
    },
    {
      question: 'Is my data secure?',
      answer: 'Yes! We use industry-standard security measures and your data is stored securely with Supabase, ensuring your information is protected.'
    },
    {
      question: 'Can I collaborate with my team?',
      answer: 'Absolutely! Sundays is designed for team collaboration. You can assign tasks, track progress, and work together seamlessly.'
    },
    {
      question: 'How do I report a bug?',
      answer: 'You can report bugs by emailing shakib@innovas.ai with the subject "Bug Report" or using the contact form above with the bug report type selected.'
    },
    {
      question: 'What payment methods do you accept?',
      answer: 'We accept all major credit cards and PayPal. All payments are processed securely through Stripe.'
    },
    {
      question: 'Can I cancel my subscription anytime?',
      answer: 'Yes, you can cancel your subscription at any time. No hidden fees or long-term commitments required.'
    }
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
                  <Link to="/about" className="text-gray-600 hover:text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">About</Link>
                  <Link to="/contact" className="text-blue-600 px-3 py-2 text-sm font-medium transition-colors duration-200">Contact</Link>
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
                Try Free Today
              </Link>
            </div>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <button
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                className="text-gray-600 hover:text-gray-900 focus:outline-none"
                aria-label="Toggle mobile menu"
              >
                {isMobileMenuOpen ? (
                  <X className="w-6 h-6" />
                ) : (
                  <Menu className="w-6 h-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200 shadow-lg">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
            <div className="flex flex-col space-y-4">
              <Link to="/" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Home
              </Link>
              <Link to="/features" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                Features
              </Link>
              <Link to="/about" className="text-gray-600 hover:text-blue-600 transition-colors duration-200">
                About
              </Link>
              <Link to="/contact" className="text-blue-600 font-semibold transition-colors duration-200">
                Contact
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
              <span>We'd love to hear from you</span>
            </div>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4 leading-tight">
              Get in
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Touch
              </span>
            </h1>
            <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
              Have questions, feedback, or need support? We're here to help and would love to start a conversation with you.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Methods Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Ways to <span className="text-blue-600">reach us</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Choose the method that works best for you
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            {contactMethods.map((method, index) => (
              <div key={index} className={`group ${method.bg} border-2 rounded-3xl p-8 transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl text-center`}>
                <div className={`w-16 h-16 bg-gradient-to-r ${method.color} rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                  <method.icon className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">{method.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{method.description}</p>
                {method.href !== '#' ? (
                  <a 
                    href={method.href} 
                    className="text-blue-600 hover:text-blue-700 transition-colors font-semibold"
                  >
                    {method.contact}
                  </a>
                ) : (
                  <span className="text-gray-700 font-semibold">{method.contact}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact Form & Info Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Developer Info */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8 h-fit">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Meet the Developer</h2>
                
                <div className="text-center mb-8">
                  <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">
                    S
                  </div>
                  <h3 className="text-xl font-bold text-gray-900">Shakib</h3>
                  <p className="text-gray-600">Full Stack Developer</p>
                </div>

                <p className="text-gray-600 mb-6 leading-relaxed">
                  Hi! I'm Shakib, the developer behind Sundays. I'm passionate about creating tools that help teams work better together. 
                  Feel free to reach out with any questions, feedback, or just to say hello!
                </p>

                <div className="space-y-4">
                  <div className="flex items-center p-4 bg-blue-50 rounded-2xl border border-blue-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                      <Mail className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Direct Email</p>
                      <a href="mailto:shakib@innovas.ai" className="text-blue-600 hover:text-blue-700 transition-colors">
                        shakib@innovas.ai
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center p-4 bg-green-50 rounded-2xl border border-green-100 hover:shadow-lg transition-shadow duration-200">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                      <MessageSquare className="w-6 h-6 text-green-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900">Response Time</p>
                      <p className="text-green-600">Usually within 24 hours</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-3xl shadow-xl border border-gray-200 p-8">
                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                      <CheckCircle className="w-10 h-10 text-green-600" />
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900 mb-4">Message Sent!</h3>
                    <p className="text-xl text-gray-600 mb-8">Thank you for reaching out. I'll get back to you soon.</p>
                    <div className="flex items-center justify-center space-x-2 text-green-600">
                      <Heart className="w-5 h-5" />
                      <span className="font-medium">We appreciate your feedback</span>
                    </div>
                  </div>
                ) : (
                  <>
                    <div className="mb-8">
                      <h2 className="text-3xl font-bold text-gray-900 mb-4">Send us a Message</h2>
                      <p className="text-gray-600 text-lg">
                        Got a question, suggestion, or just want to say hi? We'd love to hear from you.
                      </p>
                    </div>
                    
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="name" className="block text-sm font-semibold text-gray-700 mb-3">
                            Full Name *
                          </label>
                          <input
                            type="text"
                            id="name"
                            name="name"
                            required
                            value={formData.name}
                            onChange={handleChange}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                            placeholder="Your full name"
                          />
                        </div>
                        
                        <div>
                          <label htmlFor="email" className="block text-sm font-semibold text-gray-700 mb-3">
                            Email Address *
                          </label>
                          <input
                            type="email"
                            id="email"
                            name="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                            placeholder="your@email.com"
                          />
                        </div>
                      </div>

                      <div>
                        <label htmlFor="type" className="block text-sm font-semibold text-gray-700 mb-3">
                          Message Type
                        </label>
                        <select
                          id="type"
                          name="type"
                          value={formData.type}
                          onChange={handleChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg bg-white"
                        >
                          <option value="general">General Inquiry</option>
                          <option value="support">Technical Support</option>
                          <option value="bug">Bug Report</option>
                          <option value="feature">Feature Request</option>
                          <option value="feedback">Feedback</option>
                        </select>
                      </div>

                      <div>
                        <label htmlFor="subject" className="block text-sm font-semibold text-gray-700 mb-3">
                          Subject *
                        </label>
                        <input
                          type="text"
                          id="subject"
                          name="subject"
                          required
                          value={formData.subject}
                          onChange={handleChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 text-lg"
                          placeholder="Brief description of your message"
                        />
                      </div>

                      <div>
                        <label htmlFor="message" className="block text-sm font-semibold text-gray-700 mb-3">
                          Message *
                        </label>
                        <textarea
                          id="message"
                          name="message"
                          required
                          rows={6}
                          value={formData.message}
                          onChange={handleChange}
                          className="w-full px-4 py-4 border-2 border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200 resize-none text-lg"
                          placeholder="Tell us more about your inquiry..."
                        />
                      </div>

                      <button
                        type="submit"
                        className="group w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-8 rounded-2xl font-semibold text-lg hover:from-blue-700 hover:to-purple-700 transition-all duration-200 flex items-center justify-center shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      >
                        <Send className="w-5 h-5 mr-3 group-hover:animate-pulse" />
                        Send Message
                        <ArrowRight className="w-5 h-5 ml-3 group-hover:translate-x-1 transition-transform" />
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
              Frequently Asked <span className="text-blue-600">Questions</span>
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find answers to common questions about Sundays
            </p>
          </div>
          
          <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 rounded-3xl p-8 md:p-12 border border-blue-100 shadow-xl">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow duration-300">
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
            Ready to get <span className="text-blue-200">started</span>?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of teams who are already using Sundays to streamline their workflow.
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
              to="/features"
              className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-2xl text-lg font-semibold transition-all duration-200 flex items-center justify-center"
            >
              Explore Features
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

export default ContactPage;