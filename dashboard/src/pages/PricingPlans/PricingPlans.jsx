import React, { useState, useEffect } from 'react';
import { Moon, Sun, Check, BarChart3, Shield, Zap, Globe, ChevronDown, ChevronUp, TrendingUp, Lock, Bell } from 'lucide-react';
import { useNavigate } from 'react-router';

export default function AnalyticsLanding() {
  const navigate=useNavigate()
  const [darkMode, setDarkMode] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [currency, setCurrency] = useState('INR');
  

  useEffect(() => {
    const isDark = localStorage.getItem('darkMode') === 'true';
    setDarkMode(isDark);
  }, []);

  const toggleDarkMode = () => {
    const newMode = !darkMode;
    setDarkMode(newMode);
    localStorage.setItem('darkMode', newMode.toString());
  };

  const pricing = {
    INR: {
      symbol: '₹',
      plans: [
        {
          name: "Free",
          price: "0",
          period: "forever",
          popular: false,
          features: [
            "1 Website",
            "Basic Analytics",
            "1,000 Page Views/month",
            "7 Days Data Retention",
            "Email Support"
          ],
          buttonText: "Start Free",
          buttonStyle: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
        },
        {
          name: "Starter",
          price: "499",
          period: "per month",
          popular: false,
          features: [
            "3 Websites",
            "Advanced Analytics",
            "25,000 Page Views/month",
            "30 Days Data Retention",
            "Priority Email Support",
            "Custom Notifications"
          ],
          buttonText: "Get Started",
          buttonStyle: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
        },
        {
          name: "Professional",
          price: "1,499",
          period: "per month",
          popular: true,
          features: [
            "10 Websites",
            "Real-time Analytics",
            "100,000 Page Views/month",
            "90 Days Data Retention",
            "24/7 Priority Support",
            "Payment Reminders",
            "API Access",
            "Custom Branding"
          ],
          buttonText: "Go Pro",
          buttonStyle: "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600"
        },
        {
          name: "Enterprise",
          price: "4,999",
          period: "per month",
          popular: false,
          features: [
            "Unlimited Websites",
            "Advanced Real-time Analytics",
            "Unlimited Page Views",
            "Unlimited Data Retention",
            "Dedicated Account Manager",
            "Payment Enforcement System",
            "White-label Solution",
            "Custom Integration",
            "SLA Agreement"
          ],
          buttonText: "Contact Sales",
          buttonStyle: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
        }
      ]
    },
    USD: {
      symbol: '$',
      plans: [
        {
          name: "Free",
          price: "0",
          period: "forever",
          popular: false,
          features: [
            "1 Website",
            "Basic Analytics",
            "1,000 Page Views/month",
            "7 Days Data Retention",
            "Email Support"
          ],
          buttonText: "Start Free",
          buttonStyle: "bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 hover:bg-slate-200 dark:hover:bg-slate-700"
        },
        {
          name: "Starter",
          price: "6",
          period: "per month",
          popular: false,
          features: [
            "3 Websites",
            "Advanced Analytics",
            "25,000 Page Views/month",
            "30 Days Data Retention",
            "Priority Email Support",
            "Custom Notifications"
          ],
          buttonText: "Get Started",
          buttonStyle: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
        },
        {
          name: "Professional",
          price: "18",
          period: "per month",
          popular: true,
          features: [
            "10 Websites",
            "Real-time Analytics",
            "100,000 Page Views/month",
            "90 Days Data Retention",
            "24/7 Priority Support",
            "Payment Reminders",
            "API Access",
            "Custom Branding"
          ],
          buttonText: "Go Pro",
          buttonStyle: "bg-emerald-600 dark:bg-emerald-500 text-white hover:bg-emerald-700 dark:hover:bg-emerald-600"
        },
        {
          name: "Enterprise",
          price: "60",
          period: "per month",
          popular: false,
          features: [
            "Unlimited Websites",
            "Advanced Real-time Analytics",
            "Unlimited Page Views",
            "Unlimited Data Retention",
            "Dedicated Account Manager",
            "Payment Enforcement System",
            "White-label Solution",
            "Custom Integration",
            "SLA Agreement"
          ],
          buttonText: "Contact Sales",
          buttonStyle: "bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 hover:bg-slate-800 dark:hover:bg-slate-200"
        }
      ]
    }
  };

  const faqs = [
    {
      question: "How does the payment enforcement system work?",
      answer: "When clients haven't paid for your services, our system displays customizable payment reminders directly on their websites through your embedded tracking script. You can choose between full-screen modals or dismissible banners, ensuring payment visibility without blocking their operations."
    },
    {
      question: "What analytics data do you track?",
      answer: "We track page views, unique visitors, traffic sources, geographic data, device information, and user behavior patterns. All data is presented in real-time dashboards with customizable reports and insights."
    },
    {
      question: "Can I white-label the solution?",
      answer: "Yes! Enterprise plans include white-label options, allowing you to rebrand the entire analytics platform with your company's logo, colors, and domain. Perfect for agencies serving multiple clients."
    },
    {
      question: "Is my data secure?",
      answer: "Absolutely. We use enterprise-grade encryption, secure data centers, and comply with GDPR and other data protection regulations. Your analytics data is never shared with third parties."
    },
    {
      question: "What happens if I exceed my page view limit?",
      answer: "We'll notify you when approaching your limit. You can upgrade your plan anytime, or contact us for custom pricing. We never cut off your service mid-month - you'll have time to adjust your plan."
    }
  ];

  const currentPlans = pricing[currency].plans;
  const currencySymbol = pricing[currency].symbol;

  return (
    <div className={`min-h-screen transition-colors duration-300 ${darkMode ? 'dark' : ''}`}>
      <div className="bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-50">
        {/* Navigation */}
        <nav className="sticky top-0 z-50 bg-white/90 dark:bg-slate-950/90 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              <div className="flex items-center">
                <BarChart3 className="w-7 h-7 text-emerald-600 dark:text-emerald-500 mr-2" />
                <span className="text-xl md:block hidden font-semibold text-slate-900 dark:text-slate-50">
                  PayTrack Analytics
                </span>
              </div>
              <div className="flex items-center space-x-4">
                <button
                  onClick={toggleDarkMode}
                  className="p-2 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                >
                  {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
                </button>
                <button onClick={()=>navigate("/signin")} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-slate-50 transition-colors">
                  Sign In
                </button>
                <button  onClick={()=>navigate("/signin")}  className="px-4 py-2 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg text-sm font-medium hover:bg-slate-800 dark:hover:bg-slate-200 transition-colors">
                  Get Started
                </button>
              </div>
            </div>
          </div>
        </nav>

        {/* Hero Section */}
        <section className="relative overflow-hidden bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24 md:py-32">
            <div className="text-center">
              <div className="mb-8">
                <div className="inline-flex items-center px-4 py-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400 text-sm font-medium">
                  ✓ Trusted by 10,000+ businesses
                </div>
              </div>
              
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold mb-6 text-slate-900 dark:text-slate-50 leading-tight tracking-tight">
                Analytics That Track.<br />
                <span className="text-emerald-600 dark:text-emerald-500">Payments That Matter.</span>
              </h1>
              
              <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-3xl mx-auto leading-relaxed">
                Monitor website performance and ensure timely payments with intelligent notification systems built for modern businesses.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button  onClick={()=>navigate("/signin")}  className="px-8 py-4 bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-900 rounded-lg font-semibold text-lg hover:bg-slate-800 dark:hover:bg-slate-200 transition-all duration-200 shadow-lg shadow-slate-900/10">
                  Start Free Trial
                </button>
                <button  onClick={()=>navigate("/signin")}  className="px-8 py-4 border-2 border-slate-300 dark:border-slate-700 text-slate-900 dark:text-slate-100 rounded-lg font-semibold text-lg hover:border-slate-400 dark:hover:border-slate-600 transition-colors">
                  View Demo
                </button>
              </div>

              <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
                <div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">10K+</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Active Users</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">99.9%</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Uptime</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">50M+</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Page Views</div>
                </div>
                <div>
                  <div className="text-4xl font-bold text-slate-900 dark:text-slate-50">24/7</div>
                  <div className="text-slate-600 dark:text-slate-400 mt-1 text-sm">Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">Enterprise-Grade Features</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to manage clients professionally</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8">
              <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <TrendingUp className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">Real-Time Analytics</h3>
                <p className="text-slate-600 dark:text-slate-400">Monitor traffic, behavior, and performance with live dashboards and instant insights.</p>
              </div>
              
              <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Bell className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">Smart Payment Reminders</h3>
                <p className="text-slate-600 dark:text-slate-400">Automated notifications on client websites when payments are overdue.</p>
              </div>
              
              <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Lock className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">Enterprise Security</h3>
                <p className="text-slate-600 dark:text-slate-400">Bank-grade encryption, GDPR compliance, and SOC 2 certified infrastructure.</p>
              </div>

              <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Globe className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">Multi-Site Management</h3>
                <p className="text-slate-600 dark:text-slate-400">Manage unlimited client websites from one unified dashboard.</p>
              </div>

              <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Shield className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">Payment Control</h3>
                <p className="text-slate-600 dark:text-slate-400">Customizable on-site notifications ensure clients stay current.</p>
              </div>

              <div className="group p-8 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-emerald-300 dark:hover:border-emerald-700 hover:shadow-lg transition-all">
                <div className="w-12 h-12 bg-emerald-100 dark:bg-emerald-950 rounded-lg flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Zap className="w-6 h-6 text-emerald-600 dark:text-emerald-500" />
                </div>
                <h3 className="text-xl font-semibold mb-3 text-slate-900 dark:text-slate-50">Developer API</h3>
                <p className="text-slate-600 dark:text-slate-400">RESTful API with comprehensive documentation for custom integrations.</p>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-24 bg-slate-50 dark:bg-slate-950 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">Transparent Pricing</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400 mb-8">Choose the plan that scales with your business</p>
              
              {/* Currency Toggle */}
              <div className="flex items-center justify-center gap-4">
                <span className={`font-medium transition-colors ${currency === 'INR' ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400 dark:text-slate-600'}`}>INR (₹)</span>
                <button
                  onClick={() => setCurrency(currency === 'INR' ? 'USD' : 'INR')}
                  className={`relative inline-flex h-8 w-14 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 dark:focus:ring-offset-slate-950 ${
                    currency === 'USD' ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
                  }`}
                >
                  <span
                    className={`inline-block h-6 w-6 transform rounded-full bg-white transition-transform shadow-sm ${
                      currency === 'USD' ? 'translate-x-7' : 'translate-x-1'
                    }`}
                  />
                </button>
                <span className={`font-medium transition-colors ${currency === 'USD' ? 'text-slate-900 dark:text-slate-50' : 'text-slate-400 dark:text-slate-600'}`}>USD ($)</span>
              </div>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
              {currentPlans.map((plan, index) => (
                <div key={index} className={`relative rounded-2xl p-8 ${
                  plan.popular 
                    ? 'bg-white dark:bg-slate-900 border-2 border-emerald-500 shadow-xl transform scale-105' 
                    : 'bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800'
                } hover:shadow-xl transition-all duration-300`}>
                  
                  {plan.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                      <div className="bg-emerald-600 text-white px-4 py-1 rounded-full text-sm font-semibold whitespace-nowrap">
                        Most Popular
                      </div>
                    </div>
                  )}
                  
                  <div className="mb-8">
                    <h3 className="text-lg font-semibold mb-2 text-slate-600 dark:text-slate-400">{plan.name}</h3>
                    <div className="mb-4">
                      <span className="text-5xl font-bold text-slate-900 dark:text-slate-50">{currencySymbol}{plan.price}</span>
                      <span className="text-slate-500 dark:text-slate-500 text-sm ml-1">/{plan.period}</span>
                    </div>
                  </div>
                  
                  <ul className="space-y-3 mb-8">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start">
                        <Check className="w-5 h-5 text-emerald-600 dark:text-emerald-500 mr-2 flex-shrink-0 mt-0.5" />
                        <span className="text-sm text-slate-600 dark:text-slate-400">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <button className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${plan.buttonStyle}`}>
                    {plan.buttonText}
                  </button>
                </div>
              ))}
            </div>

            <div className="mt-12 text-center">
              <p className="text-slate-500 dark:text-slate-500 text-sm">
                14-day free trial • No credit card required • Cancel anytime
              </p>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl md:text-5xl font-bold mb-4 text-slate-900 dark:text-slate-50">Frequently Asked Questions</h2>
              <p className="text-xl text-slate-600 dark:text-slate-400">Everything you need to know about PayTrack Analytics</p>
            </div>
            
            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="border border-slate-200 dark:border-slate-800 rounded-xl overflow-hidden bg-white dark:bg-slate-900">
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === index ? null : index)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <span className="font-semibold text-lg text-slate-900 dark:text-slate-50">{faq.question}</span>
                    {expandedFaq === index ? (
                      <ChevronUp className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  
                  {expandedFaq === index && (
                    <div className="px-6 py-4 bg-slate-50 dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
                      <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{faq.answer}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 bg-slate-900 dark:bg-slate-950 border-t border-slate-800">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-slate-300 mb-8">
              Join thousands of businesses managing analytics and payments effortlessly
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button  onClick={()=>navigate("/signin")}  className="px-8 py-4 bg-white text-slate-900 rounded-lg font-semibold text-lg hover:bg-slate-100 transition-all duration-200 shadow-lg">
                Start Free Trial
              </button>
              <button  onClick={()=>navigate("/signin")}  className="px-8 py-4 border-2 border-slate-600 text-white rounded-lg font-semibold text-lg hover:border-slate-500 hover:bg-slate-800 transition-all duration-200">
                Schedule Demo
              </button>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slate-950 text-slate-400 py-12 border-t border-slate-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center mb-4">
                  <BarChart3 className="w-7 h-7 text-emerald-500 mr-2" />
                  <span className="text-lg font-semibold text-white">PayTrack Analytics</span>
                </div>
                <p className="text-sm text-slate-500">
                  Professional analytics with integrated payment management for modern businesses.
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white text-sm">Product</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">API Docs</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Integrations</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white text-sm">Company</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">About</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Blog</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Careers</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Contact</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="font-semibold mb-4 text-white text-sm">Legal</h3>
                <ul className="space-y-2 text-sm">
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Security</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">GDPR</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-slate-900 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-sm mb-4 md:mb-0 text-slate-500">
                © 2025 PayTrack Analytics. All rights reserved.
              </div>
              <div className="flex space-x-6 text-sm">
                <a href="#" className="hover:text-white transition-colors">Twitter</a>
                <a href="#" className="hover:text-white transition-colors">LinkedIn</a>
                <a href="#" className="hover:text-white transition-colors">GitHub</a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </div>
  );
}