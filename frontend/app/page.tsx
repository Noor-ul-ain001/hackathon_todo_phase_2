"use client"

import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Users, Shield, Zap, ChevronRight, Star, ArrowRight, Calendar, Bell, Target, TrendingUp, Sparkles, Play, Rocket, Award, Menu, X, Clock, BarChart3, Lightbulb, Newspaper } from 'lucide-react';
import { isAuthenticated } from '@/lib/auth';

export default function Home() {
  const [mounted, setMounted] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [scrollY, setScrollY] = useState(0);
  const [visibleSections, setVisibleSections] = useState<Set<string>>(new Set());
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const [email, setEmail] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userStats, setUserStats] = useState<{totalTasks: number, completedTasks: number} | null>(null);

  // Stats animation state
  const [stats, setStats] = useState([
    { value: 0, target: 100000, label: 'Active Users', icon: Users, color: 'from-blue-500 to-cyan-500', suffix: 'K+' },
    { value: 0, target: 5000000, label: 'Tasks Completed', icon: CheckCircle, color: 'from-emerald-500 to-teal-500', suffix: 'M+' },
    { value: 0, target: 99.9, label: 'Uptime SLA', icon: Shield, color: 'from-purple-500 to-pink-500', suffix: '%' },
    { value: 0, target: 4.9, label: 'User Rating', icon: Star, color: 'from-amber-500 to-orange-500', suffix: '' }
  ]);
  const [animateStats, setAnimateStats] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Check if user is authenticated
    const authStatus = isAuthenticated();
    setIsLoggedIn(authStatus);

    // Fetch user stats if logged in
    const fetchUserStats = () => {
      if (authStatus) {
        const userId = localStorage.getItem('user_id');
        const token = localStorage.getItem('auth_token');

        if (userId && token) {
          fetch(`${process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000/api"}/${userId}/tasks`, {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          })
          .then(res => res.json())
          .then(tasks => {
            const total = tasks.length;
            const completed = tasks.filter((t: any) => t.completed).length;
            setUserStats({ totalTasks: total, completedTasks: completed });
          })
          .catch(err => console.error('Failed to fetch user stats:', err));
        }
      }
    };

    // Initial fetch
    fetchUserStats();

    // Listen for task updates from other pages/tabs
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'taskUpdated' || e.key === 'taskCreated' || e.key === 'taskDeleted') {
        fetchUserStats(); // Refresh stats when tasks are updated elsewhere
      }
    };

    window.addEventListener('storage', handleStorageChange);

    // Also set up periodic refresh (every 30 seconds) as a fallback
    const intervalId = setInterval(fetchUserStats, 30000);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      clearInterval(intervalId);
    };

    const handleMouseMove = (e: MouseEvent) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    // Close mobile menu when clicking outside
    const handleClickOutside = (event: MouseEvent) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target as Node)) {
        setIsMenuOpen(false);
      }
    };

    // Smooth scrolling for anchor links
    const handleAnchorClick = (e: Event) => {
      const target = e.currentTarget as HTMLAnchorElement;
      e.preventDefault();
      const targetElement = document.querySelector(target.getAttribute('href') || '');
      if (targetElement) {
        targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Close mobile menu after navigation
        setIsMenuOpen(false);
      }
    };

    // Add event listeners
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('scroll', handleScroll);
    document.addEventListener('mousedown', handleClickOutside);

    // Add anchor click listeners
    const anchorElements = document.querySelectorAll('a[href^="#"]');
    anchorElements.forEach(anchor => {
      anchor.addEventListener('click', handleAnchorClick);
    });

    // Intersection Observer for scroll animations with better threshold
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setVisibleSections((prev) => new Set(prev).add(entry.target.id));
          }
        });
      },
      { threshold: 0.1, rootMargin: '0px 0px -100px 0px' }
    );

    document.querySelectorAll('[id]').forEach((el) => observer.observe(el));

    return () => {
      // Remove event listeners
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('scroll', handleScroll);
      document.removeEventListener('mousedown', handleClickOutside);

      // Remove anchor click listeners
      anchorElements.forEach(anchor => {
        anchor.removeEventListener('click', handleAnchorClick);
      });

      observer.disconnect();
    };
  }, []);

  // Animated counter effect for stats
  useEffect(() => {
    if (!animateStats) return;

    const duration = 2000; // 2 seconds
    const steps = 60;
    const interval = duration / steps;
    const timers: NodeJS.Timeout[] = [];

    stats.forEach((stat, index) => {
      let currentStep = 0;
      const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        const easeOut = 1 - Math.pow(1 - progress, 3); // Cubic ease-out

        setStats(prev => {
          const newStats = [...prev];
          newStats[index] = {
            ...newStats[index],
            value: easeOut * stat.target
          };
          return newStats;
        });

        if (currentStep >= steps) {
          clearInterval(timer);
        }
      }, interval);
      timers.push(timer);
    });

    return () => {
      timers.forEach(timer => clearInterval(timer));
    };
  }, [animateStats]); // eslint-disable-line react-hooks/exhaustive-deps

  // Trigger stats animation when stats section comes into view
  useEffect(() => {
    const statsSection = document.getElementById('stats');
    if (!statsSection) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !animateStats) {
          setAnimateStats(true);
        }
      },
      { threshold: 0.3 }
    );

    observer.observe(statsSection);

    return () => observer.disconnect();
  }, [animateStats]);

  const steps = [
    {
      icon: Rocket,
      title: 'Set Your Plan',
      description: 'Sign up and create your first task in seconds. No complex setup required.',
      color: 'bg-gradient-to-br from-cyan-400 to-teal-500',
      borderColor: 'border-cyan-400/30'
    },
    {
      icon: Target,
      title: 'Find Your Tasks',
      description: 'Organize tasks with smart categories, priorities, and intelligent filtering.',
      color: 'bg-gradient-to-br from-amber-400 to-orange-500',
      borderColor: 'border-amber-400/30'
    },
    {
      icon: Award,
      title: 'Book Your Seat',
      description: 'Schedule tasks and get AI-powered time allocation suggestions.',
      color: 'bg-gradient-to-br from-purple-400 to-pink-500',
      borderColor: 'border-purple-400/30'
    },
    {
      icon: TrendingUp,
      title: 'Get Certificate',
      description: 'Track progress and celebrate achievements with detailed analytics.',
      color: 'bg-gradient-to-br from-rose-400 to-pink-500',
      borderColor: 'border-rose-400/30'
    }
  ];

  const features = [
    {
      icon: Calendar,
      title: 'Smart Scheduling',
      description: 'AI-powered scheduling adapts to your workflow and suggests optimal task timing.',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      icon: Bell,
      title: 'Smart Notifications',
      description: 'Get context-aware reminders that learn from your behavior patterns.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      icon: Shield,
      title: 'Enterprise Security',
      description: 'Bank-level encryption with SOC 2 compliance and GDPR protection.',
      color: 'from-emerald-500 to-teal-500'
    },
    {
      icon: Users,
      title: 'Team Collaboration',
      description: 'Real-time collaboration with comments, mentions, and file sharing.',
      color: 'from-orange-500 to-amber-500'
    },
    {
      icon: TrendingUp,
      title: 'Advanced Analytics',
      description: 'Detailed insights into productivity trends and performance metrics.',
      color: 'from-indigo-500 to-purple-500'
    },
    {
      icon: Zap,
      title: 'Lightning Fast',
      description: 'Optimized infrastructure delivers sub-100ms response times globally.',
      color: 'from-pink-500 to-rose-500'
    }
  ];

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Product Manager',
      company: 'Google',
      image: 'SJ',
      rating: 5,
      text: 'Agentic Todo transformed our team\'s productivity. The AI features are game-changing!',
      color: 'from-blue-500 to-cyan-500'
    },
    {
      name: 'Michael Chen',
      role: 'Tech Lead',
      company: 'Microsoft',
      image: 'MC',
      rating: 5,
      text: 'Best investment we made this year. ROI was immediate and our team loves it.',
      color: 'from-purple-500 to-pink-500'
    },
    {
      name: 'Emma Davis',
      role: 'Design Director',
      company: 'Apple',
      image: 'ED',
      rating: 5,
      text: 'Beautiful UI, powerful features. Finally, a tool that doesn\'t get in the way.',
      color: 'from-emerald-500 to-teal-500'
    }
  ];

  const integrations = [
    { name: 'Slack', logo: '💬' },
    { name: 'GitHub', logo: '🐙' },
    { name: 'Google', logo: '🔍' },
    { name: 'Notion', logo: '📝' },
    { name: 'Figma', logo: '🎨' },
    { name: 'Zoom', logo: '📹' }
  ];

  const courses = [
    {
      title: 'Task Management Basics',
      description: 'Learn fundamentals of effective task organization',
      image: '📋',
      rating: 4.9,
      students: '2.5k',
      category: 'Productivity'
    },
    {
      title: 'Advanced Time Blocking',
      description: 'Master time management with advanced techniques',
      image: '⏰',
      rating: 4.8,
      students: '1.8k',
      category: 'Time Management'
    },
    {
      title: 'Goal Setting Framework',
      description: 'Set and achieve your goals systematically',
      image: '🎯',
      rating: 5.0,
      students: '3.2k',
      category: 'Goal Setting'
    }
  ];

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Newsletter signup:', email);
    setEmail('');
  };

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0a0f1e] via-[#0f1419] to-[#0a0f1e] relative overflow-hidden">
      {/* Advanced Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        {/* Gradient Orbs */}
        <div className="absolute inset-0">
          <div
            className="absolute w-[500px] h-[500px] md:w-[700px] md:h-[700px] bg-teal-500/40 rounded-full blur-3xl animate-float animate-glow-pulse"
            style={{
              top: `${20 + mousePosition.y * 0.008}%`,
              left: `${10 + mousePosition.x * 0.008}%`,
            }}
            aria-hidden="true"
          ></div>
          <div
            className="absolute w-[400px] h-[400px] md:w-[600px] md:h-[600px] bg-purple-500/30 rounded-full blur-3xl animate-float-delayed animate-glow-pulse"
            style={{
              bottom: `${10 + mousePosition.y * 0.006}%`,
              right: `${15 + mousePosition.x * 0.006}%`,
              animationDelay: '2s'
            }}
            aria-hidden="true"
          ></div>
          <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] md:w-[800px] md:h-[800px] bg-emerald-500/20 rounded-full blur-3xl animate-glow-pulse animate-rotate-slow" aria-hidden="true"></div>

          {/* Additional rotating gradient rings */}
          <div
            className="absolute top-1/4 right-1/4 w-[300px] h-[300px] md:w-[500px] md:h-[500px] border-2 border-accent/20 rounded-full animate-rotate-slow"
            style={{ animationDuration: '40s' }}
            aria-hidden="true"
          ></div>
          <div
            className="absolute bottom-1/4 left-1/4 w-[250px] h-[250px] md:w-[400px] md:h-[400px] border-2 border-purple-500/20 rounded-full animate-rotate-slow"
            style={{ animationDuration: '35s', animationDirection: 'reverse' }}
            aria-hidden="true"
          ></div>
        </div>

        {/* Grid Pattern */}
        <div
          className="absolute inset-0 opacity-15 md:opacity-25"
          style={{
            backgroundImage: `
              linear-gradient(rgba(6, 182, 212, 0.2) 1px, transparent 1px),
              linear-gradient(90deg, rgba(6, 182, 212, 0.2) 1px, transparent 1px)
            `,
            backgroundSize: '40px 40px',
            transform: `translate(${mousePosition.x * 0.015}px, ${mousePosition.y * 0.015}px)`
          }}
          aria-hidden="true"
        ></div>

        {/* Floating Particles */}
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-teal-400 rounded-full animate-float hidden md:block"
            style={{
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${10 + Math.random() * 20}s`,
              opacity: Math.random() * 0.6 + 0.2
            }}
            aria-hidden="true"
          ></div>
        ))}
      </div>

      {/* Navigation Bar */}
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrollY > 50 ? 'bg-slate-900/90 backdrop-blur-2xl shadow-2xl' : 'bg-slate-900/50 backdrop-blur-xl'}`}
        aria-label="Main navigation"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16 md:h-20 items-center">
            <Link href="/" className="flex items-center space-x-2 md:space-x-3 group" aria-label="Agentic Todo homepage">
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-lg md:rounded-xl blur-md md:blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-lg md:rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center transition-all duration-300 group-hover:rotate-12 group-hover:scale-110 shadow-2xl">
                  <Zap className="h-5 w-5 md:h-7 md:w-7 text-white" aria-hidden="true" />
                </div>
              </div>
              <div>
                <span className="text-lg md:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Agentic Todo
                </span>
                <div className="text-[10px] md:text-xs text-accent/60 font-medium hidden sm:block">AI-Powered Productivity</div>
              </div>
            </Link>

            {/* Desktop Menu */}
            <div className="hidden lg:flex items-center space-x-8">
              <Link
                href="#features"
                className="text-gray-300 hover:text-accent font-medium transition-colors relative group"
                aria-label="Features"
              >
                Features
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#how-it-works"
                className="text-gray-300 hover:text-accent font-medium transition-colors relative group"
                aria-label="How it Works"
              >
                How it Works
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
              <Link
                href="#testimonials"
                className="text-gray-300 hover:text-accent font-medium transition-colors relative group"
                aria-label="Testimonials"
              >
                Testimonials
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-gradient-to-r from-teal-500 to-emerald-500 group-hover:w-full transition-all duration-300"></span>
              </Link>
            </div>

            <div className="flex items-center space-x-3 md:space-x-4">
              {!isLoggedIn ? (
                <Link
                  href="/auth/signin"
                  className="hidden sm:block px-3 md:px-5 py-2 md:py-2.5 text-sm md:text-base font-medium text-gray-300 hover:text-white transition-colors"
                  aria-label="Sign in to your account"
                >
                  Sign In
                </Link>
              ) : (
                <Link
                  href="/auth/logout"
                  className="hidden sm:block px-3 md:px-5 py-2 md:py-2.5 text-sm md:text-base font-medium text-gray-300 hover:text-white transition-colors"
                  aria-label="Sign out of your account"
                >
                  Sign Out
                </Link>
              )}

              <Link
                href={isLoggedIn ? "/tasks" : "/auth/register"}
                className="group relative px-4 md:px-6 py-2 md:py-3 bg-gradient-to-r from-teal-500 to-emerald-500 text-white text-sm md:text-base font-semibold rounded-full overflow-hidden transition-all duration-300 hover:scale-105 active:scale-95 shadow-lg shadow-teal-500/50 hover:shadow-teal-500/70 touch-manipulation"
                aria-label={isLoggedIn ? "Go to Dashboard" : "Get started with Agentic Todo"}
              >
                <span className="relative z-10">{isLoggedIn ? "Dashboard" : "Get Started"}</span>
                <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
              </Link>

              {/* Mobile Menu Button */}
              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 text-gray-300 hover:text-white transition-colors"
                aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                aria-expanded={isMenuOpen}
              >
                {isMenuOpen ? <X className="h-6 w-6" aria-hidden="true" /> : <Menu className="h-6 w-6" aria-hidden="true" />}
              </button>
            </div>
          </div>

          {/* Mobile Menu */}
          {isMenuOpen && (
            <div
              className="lg:hidden py-4 border-t border-slate-800 animate-slide-down"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile menu"
            >
              <div className="flex flex-col space-y-4">
                <Link
                  href="#features"
                  className="text-gray-300 hover:text-accent font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Features"
                >
                  Features
                </Link>
                <Link
                  href="#how-it-works"
                  className="text-gray-300 hover:text-accent font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="How it Works"
                >
                  How it Works
                </Link>
                <Link
                  href="#testimonials"
                  className="text-gray-300 hover:text-accent font-medium transition-colors"
                  onClick={() => setIsMenuOpen(false)}
                  aria-label="Testimonials"
                >
                  Testimonials
                </Link>
                {!isLoggedIn ? (
                  <Link
                    href="/auth/signin"
                    className="text-gray-300 hover:text-accent font-medium transition-colors sm:hidden"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Sign in to your account"
                  >
                    Sign In
                  </Link>
                ) : (
                  <Link
                    href="/auth/logout"
                    className="text-gray-300 hover:text-accent font-medium transition-colors sm:hidden"
                    onClick={() => setIsMenuOpen(false)}
                    aria-label="Sign out of your account"
                  >
                    Sign Out
                  </Link>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-24 md:pt-32 lg:pt-40 pb-12 md:pb-20 lg:pb-28">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
              className="space-y-6 md:space-y-8 relative z-10"
            >
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <span className="inline-block text-amber-500 text-sm md:text-base font-bold mb-4">
                  ✨ Agentic Todo
                </span>
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3, duration: 0.6 }}
                className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black leading-tight text-white"
              >
                A New Way of{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Task Management
                </span>
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
                className="text-base md:text-lg lg:text-xl text-gray-300 leading-relaxed max-w-xl"
              >
                Experience intelligent task management with AI-powered insights.
                Organize your work, track progress, and achieve your goals effortlessly.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
                className="flex flex-col sm:flex-row gap-4"
              >
                <Link
                  href={isLoggedIn ? "/tasks" : "/auth/register"}
                  className="group relative inline-flex items-center justify-center px-8 py-4 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-base rounded-full overflow-hidden transition-all duration-300 hover:scale-105 shadow-lg shadow-teal-500/30"
                >
                  <span className="relative z-10">{isLoggedIn ? "Go to Dashboard" : "Get Started"}</span>
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </Link>

                <Link
                  href="#how-it-works"
                  className="inline-flex items-center justify-center px-8 py-4 border-2 border-slate-700 text-white font-semibold text-base rounded-full hover:border-accent/50 hover:bg-slate-800/50 transition-all duration-300"
                >
                  Learn More
                </Link>
              </motion.div>

              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.6 }}
                className="grid grid-cols-3 gap-4 pt-4"
              >
                {[
                  { icon: CheckCircle, text: '1 minute setup' },
                  { icon: Users, text: 'Quality results' },
                  { icon: Shield, text: 'Affordable price' }
                ].map((item, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.7 + idx * 0.1, duration: 0.4 }}
                    className="flex flex-col items-center text-center group"
                  >
                    <item.icon className="h-6 w-6 md:h-8 md:w-8 text-accent mb-2 group-hover:scale-110 transition-transform" />
                    <span className="text-xs md:text-sm text-gray-400">{item.text}</span>
                  </motion.div>
                ))}
              </motion.div>
            </motion.div>

            {/* Right Illustration */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
              className="relative h-[400px] md:h-[500px] lg:h-[600px] mt-8 lg:mt-0"
            >
              <div className="relative z-10 h-full flex items-center justify-center">
                {/* Stylized Task Stacks Illustration */}
                <div className="relative w-full max-w-md">
                  {/* Person silhouette placeholder */}
                  <motion.div
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ delay: 0.5, duration: 0.6 }}
                    className="relative z-20 mb-8"
                  >
                    <div className="w-48 h-48 md:w-64 md:h-64 mx-auto bg-gradient-to-br from-slate-700 to-slate-800 rounded-full flex items-center justify-center border-4 border-accent/30 shadow-2xl">
                      <Users className="h-24 w-24 md:h-32 md:w-32 text-accent" />
                    </div>
                  </motion.div>

                  {/* Floating Task Cards */}
                  <div className="absolute top-0 right-0 space-y-3">
                    {[
                      { delay: 0.6, color: 'from-teal-500 to-emerald-500', rotate: 5 },
                      { delay: 0.7, color: 'from-purple-500 to-pink-500', rotate: -3 },
                      { delay: 0.8, color: 'from-amber-500 to-orange-500', rotate: 8 }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: 100, opacity: 0, rotate: 0 }}
                        animate={{ x: 0, opacity: 1, rotate: item.rotate }}
                        transition={{ delay: item.delay, duration: 0.5 }}
                        whileHover={{ scale: 1.05, rotate: 0 }}
                        className={`w-32 md:w-40 h-20 md:h-24 rounded-xl bg-gradient-to-br ${item.color} shadow-xl flex items-center justify-center cursor-pointer`}
                      >
                        <CheckCircle className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      </motion.div>
                    ))}
                  </div>

                  {/* Floating Task Cards - Left Side */}
                  <div className="absolute top-12 left-0 space-y-3">
                    {[
                      { delay: 0.9, color: 'from-blue-500 to-cyan-500', rotate: -5 },
                      { delay: 1.0, color: 'from-rose-500 to-pink-500', rotate: 3 }
                    ].map((item, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ x: -100, opacity: 0, rotate: 0 }}
                        animate={{ x: 0, opacity: 1, rotate: item.rotate }}
                        transition={{ delay: item.delay, duration: 0.5 }}
                        whileHover={{ scale: 1.05, rotate: 0 }}
                        className={`w-32 md:w-40 h-20 md:h-24 rounded-xl bg-gradient-to-br ${item.color} shadow-xl flex items-center justify-center cursor-pointer`}
                      >
                        <Target className="h-8 w-8 md:h-10 md:w-10 text-white" />
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Floating Elements */}
                <div className="absolute -top-10 -right-10 w-40 h-40 md:w-60 md:h-60 bg-accent-light rounded-full blur-3xl animate-pulse"></div>
                <div className="absolute -bottom-10 -left-10 w-40 h-40 md:w-60 md:h-60 bg-purple-500/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '1s' }}></div>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Personalized Stats Banner for Logged-in Users */}
        {isLoggedIn && userStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.0, duration: 0.6 }}
            className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12"
          >
            <div className="bg-gradient-to-r from-teal-600/20 to-emerald-600/20 backdrop-blur-xl border border-accent/30 rounded-2xl p-6 md:p-8">
              <div className="flex flex-col md:flex-row items-center justify-between gap-6">
                <div className="text-center md:text-left">
                  <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
                    Welcome back! 👋
                  </h3>
                  <p className="text-slate-300">
                    You're making great progress on your tasks
                  </p>
                </div>
                <div className="flex gap-4 md:gap-6">
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6 text-center min-w-[120px]">
                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400 mb-1">
                      {userStats.totalTasks}
                    </div>
                    <div className="text-xs md:text-sm text-slate-400">Total Tasks</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6 text-center min-w-[120px]">
                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-orange-400 mb-1">
                      {userStats.completedTasks}
                    </div>
                    <div className="text-xs md:text-sm text-slate-400">Completed</div>
                  </div>
                  <div className="bg-slate-800/50 border border-slate-700 rounded-xl p-4 md:p-6 text-center min-w-[120px]">
                    <div className="text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-green-400 to-teal-400 mb-1">
                      {userStats.totalTasks > 0 ? Math.round((userStats.completedTasks / userStats.totalTasks) * 100) : 0}%
                    </div>
                    <div className="text-xs md:text-sm text-slate-400">Progress</div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {/* Trust Badges */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 md:mt-20"
        >
          <div className="text-center mb-8">
            <p className="text-sm md:text-base text-gray-400 font-medium">
              Trusted by teams from leading companies
            </p>
          </div>
          <div className="flex flex-wrap items-center justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-opacity duration-300">
            {['Udemy', 'Coursera', 'Facebook', 'Google', 'Slack', 'Microsoft'].map((company, idx) => (
              <motion.div
                key={company}
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 1.2 + idx * 0.1, duration: 0.4 }}
                className="text-gray-500 font-bold text-lg md:text-2xl hover:text-accent transition-colors cursor-pointer"
              >
                {company}
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Stats Section */}
        <div id="stats" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16 md:mt-24 lg:mt-32">
          {mounted ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {stats.map((stat, index) => {
                const Icon = stat.icon;
                const isVisible = visibleSections.has('stats');

                // Format the display value
                const displayValue = (() => {
                  if (stat.suffix === 'K+') {
                    return Math.floor(stat.value / 1000) + 'K+';
                  } else if (stat.suffix === 'M+') {
                    return (stat.value / 1000000).toFixed(1) + 'M+';
                  } else if (stat.suffix === '%') {
                    return stat.value.toFixed(1) + '%';
                  } else {
                    return stat.value.toFixed(1);
                  }
                })();

                return (
                  <div
                    key={index}
                    className={`group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 hover:border-accent/50 transition-all duration-500 hover:scale-105 overflow-hidden ${isVisible ? 'animate-slide-up' : 'opacity-0'}`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-opacity`}></div>
                    <div className="relative">
                      <Icon className={`h-6 w-6 md:h-10 md:w-10 mb-2 md:mb-4 group-hover:scale-125 transition-transform text-accent`} />
                      <div className={`text-3xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r ${stat.color} mb-1 md:mb-2 tabular-nums`}>
                        {displayValue}
                      </div>
                      <div className="text-xs md:text-sm text-gray-400 font-medium">{stat.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6">
              {[...Array(4)].map((_, index) => (
                <div
                  key={index}
                  className="bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl md:rounded-3xl p-4 md:p-8 animate-pulse"
                >
                  <div className="h-10 w-10 bg-slate-700 rounded-xl mb-4"></div>
                  <div className="h-8 bg-slate-700 rounded mb-2"></div>
                  <div className="h-4 bg-slate-700 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Integration Section */}
      <section id="integrations" className="py-12 md:py-20 relative" aria-labelledby="integrations-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 md:mb-12">
            <h3 id="integrations-heading" className="text-xs md:text-sm font-semibold text-accent mb-2 tracking-wider uppercase">Integrations</h3>
            <p className="text-lg md:text-2xl text-gray-400">Works with your favorite tools</p>
          </div>
          <div className="flex flex-wrap justify-center items-center gap-4 md:gap-8">
            {integrations.map((integration, idx) => {
              const isVisible = visibleSections.has('integrations');
              return (
                <div
                  key={idx}
                  className={`group relative bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-xl md:rounded-2xl p-4 md:p-6 hover:border-accent/50 hover:bg-slate-800/60 transition-all duration-300 hover:scale-110 hover:-translate-y-2 cursor-pointer ${isVisible ? 'animate-slide-up' : 'opacity-0'} overflow-hidden touch-manipulation`}
                  style={{ animationDelay: `${idx * 0.1}s` }}
                  tabIndex={0}
                  role="button"
                  aria-label={`${integration.name} integration`}
                >
                  <div className="text-2xl md:text-4xl mb-1 md:mb-2 group-hover:scale-125 transition-transform duration-300" aria-hidden="true">{integration.logo}</div>
                  <div className="text-xs md:text-sm text-gray-400 font-medium group-hover:text-accent transition-colors duration-300">{integration.name}</div>
                  <div className="absolute inset-0 bg-gradient-to-br from-teal-500/10 to-transparent rounded-xl md:rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16 md:py-24 lg:py-32 relative bg-slate-900/50" aria-labelledby="how-it-works-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="how-it-works-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            >
              How it works
            </motion.h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 md:gap-10">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isVisible = visibleSections.has('how-it-works');
              return (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1, duration: 0.5 }}
                  className="text-center group"
                  role="region"
                  aria-labelledby={`step-${index}-title`}
                >
                  <div className="relative inline-block mb-6">
                    {/* Circular Icon Container */}
                    <div className={`relative w-24 h-24 md:w-32 md:h-32 rounded-full ${step.color} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-all duration-300 border-4 ${step.borderColor}`}>
                      <Icon className="h-12 w-12 md:h-16 md:w-16 text-white" aria-hidden="true" />
                    </div>
                  </div>
                  <h3
                    id={`step-${index}-title`}
                    className="text-lg md:text-xl font-bold text-white mb-3 group-hover:text-accent transition-colors"
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm md:text-base text-gray-400 leading-relaxed px-2">
                    {step.description}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Our Latest Courses/Features Section */}
      <section id="courses" className="py-16 md:py-24 lg:py-32 relative" aria-labelledby="courses-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center mb-12">
            <motion.h2
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="courses-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white"
            >
              Our Latest Courses
            </motion.h2>
            <Link
              href="/tasks"
              className="hidden md:flex items-center text-accent hover:text-accent font-semibold transition-colors group"
            >
              View All
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {courses.map((course, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group bg-slate-800/40 backdrop-blur-xl border border-slate-700/50 rounded-2xl overflow-hidden hover:border-accent/50 transition-all duration-300 hover:-translate-y-2"
              >
                {/* Course Image */}
                <div className="h-48 bg-gradient-to-br from-teal-500/20 to-purple-500/20 flex items-center justify-center text-6xl group-hover:scale-110 transition-transform duration-300">
                  {course.image}
                </div>

                {/* Course Content */}
                <div className="p-6">
                  <div className="flex items-center gap-2 mb-3">
                    <span className="px-3 py-1 bg-accent-light text-accent rounded-full text-xs font-semibold">
                      {course.category}
                    </span>
                  </div>

                  <h3 className="text-xl font-bold text-white mb-2 group-hover:text-accent transition-colors">
                    {course.title}
                  </h3>
                  <p className="text-sm text-gray-400 mb-4">
                    {course.description}
                  </p>

                  <div className="flex items-center justify-between pt-4 border-t border-slate-700/50">
                    <div className="flex items-center gap-1">
                      <Star className="h-4 w-4 text-amber-400 fill-current" />
                      <span className="text-sm font-semibold text-white">{course.rating}</span>
                    </div>
                    <div className="flex items-center gap-1 text-gray-400 text-sm">
                      <Users className="h-4 w-4" />
                      <span>{course.students} students</span>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>

          <Link
            href="/tasks"
            className="md:hidden flex items-center justify-center text-accent hover:text-accent font-semibold transition-colors group mt-8"
          >
            View All Courses
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 md:py-24 lg:py-32 bg-slate-900/50 relative" aria-labelledby="testimonials-heading">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              id="testimonials-heading"
              className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4"
            >
              What our client are saying
            </motion.h2>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                className="group relative bg-gradient-to-br from-slate-800/60 to-slate-900/60 backdrop-blur-xl border border-slate-700/50 rounded-2xl p-6 hover:border-accent/50 transition-all duration-300 hover:-translate-y-2"
                role="article"
                aria-labelledby={`testimonial-${index}-name`}
              >
                {/* Quote Icon */}
                <div className="text-accent/30 text-6xl font-serif mb-4">"</div>

                <p className="text-sm md:text-base text-gray-300 leading-relaxed mb-6">
                  {testimonial.text}
                </p>

                <div className="flex items-center gap-4">
                  <div className={`h-12 w-12 rounded-full bg-gradient-to-br ${testimonial.color} flex items-center justify-center text-white font-bold text-lg shadow-lg flex-shrink-0`}>
                    {testimonial.image}
                  </div>
                  <div>
                    <h4 id={`testimonial-${index}-name`} className="font-bold text-white text-base">
                      {testimonial.name}
                    </h4>
                    <p className="text-sm text-gray-400">{testimonial.role}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-16 md:py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-600/20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-r from-teal-500 to-emerald-500 rounded-3xl p-8 md:p-12 text-center shadow-2xl"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white mb-4">
              Subscribe Us to Newsletter
            </h2>
            <p className="text-lg md:text-xl text-white/90 mb-8">
              Get the latest updates and tips delivered to your inbox
            </p>

            <form onSubmit={handleNewsletterSubmit} className="max-w-xl mx-auto">
              <div className="flex flex-col sm:flex-row gap-4">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  required
                  className="flex-1 px-6 py-4 rounded-full bg-white text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-white/50 font-medium"
                />
                <button
                  type="submit"
                  className="px-8 py-4 bg-slate-900 text-white font-bold rounded-full hover:bg-slate-800 transition-colors shadow-lg hover:scale-105 active:scale-95"
                >
                  Subscribe
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 md:py-32 relative overflow-hidden" aria-labelledby="cta-heading">
        <div className="absolute inset-0 bg-gradient-to-r from-teal-600/20 to-emerald-600/20"></div>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          <h2 id="cta-heading" className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white mb-4 md:mb-6">
            Ready to <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">10x</span> your productivity?
          </h2>
          <p className="text-lg md:text-2xl text-gray-300 mb-8 md:mb-12 font-light">Join 100,000+ users achieving more every single day</p>

          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center mb-6 md:mb-8">
            <Link
              href={isLoggedIn ? "/tasks" : "/auth/register"}
              className="group relative inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 bg-gradient-to-r from-teal-500 to-emerald-500 text-white font-bold text-lg md:text-xl rounded-full overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 shadow-2xl shadow-teal-500/50 hover:shadow-teal-500/80 hover:shadow-3xl touch-manipulation"
              aria-label={isLoggedIn ? "Go to Dashboard" : "Start free trial with Agentic Todo"}
            >
              <span className="relative z-10 flex items-center">
                {isLoggedIn ? "Go to Dashboard" : "Start Free Trial"}
                <ArrowRight className="ml-2 md:ml-3 h-6 w-6 md:h-7 md:w-7 group-hover:translate-x-2 transition-transform duration-300" aria-hidden="true" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              <div className="absolute inset-0 bg-white/20 opacity-0 group-active:opacity-100 transition-opacity duration-150"></div>
            </Link>

            <Link
              href="/auth/signin"
              className="inline-flex items-center justify-center px-8 md:px-12 py-4 md:py-6 border-2 border-accent text-accent font-bold text-lg md:text-xl rounded-full hover:bg-accent-light active:bg-accent-light backdrop-blur-xl transition-all duration-300 hover:scale-105 active:scale-95 shadow-xl touch-manipulation"
              aria-label="Sign in to your Agentic Todo account"
            >
              Sign In
            </Link>
          </div>

          <p className="text-gray-500 text-xs md:text-sm flex flex-wrap items-center justify-center gap-2">
            <span className="flex items-center">
              <CheckCircle className="inline h-3 w-3 md:h-4 md:w-4 text-teal-500 mr-1" aria-hidden="true" />
              No credit card required
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <CheckCircle className="inline h-3 w-3 md:h-4 md:w-4 text-teal-500 mr-1" aria-hidden="true" />
              Free 14-day trial
            </span>
            <span className="hidden sm:inline">•</span>
            <span className="flex items-center">
              <CheckCircle className="inline h-3 w-3 md:h-4 md:w-4 text-teal-500 mr-1" aria-hidden="true" />
              Cancel anytime
            </span>
          </p>
        </div>

        {/* Structured Data for SEO */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "WebApplication",
              "name": "Agentic Todo",
              "description": "AI-powered task management application to supercharge your productivity",
              "url": "https://agentic-todo.com",
              "applicationCategory": "Productivity",
              "operatingSystem": "Web Browser",
              "offers": {
                "@type": "Offer",
                "price": "0",
                "priceCurrency": "USD"
              },
              "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.9",
                "reviewCount": "2000"
              },
              "creator": {
                "@type": "Organization",
                "name": "Agentic Todo"
              }
            })
          }}
        />
      </section>

      {/* Footer */}
      <footer className="bg-slate-950/80 backdrop-blur-xl border-t border-slate-800 py-8 md:py-16" role="contentinfo">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-12 mb-8 md:mb-16">
            {[
              { title: 'Program', links: ['Corporate', 'One to One', 'Consulting'] },
              { title: 'Service', links: ['Training', 'Coaching', 'Consulting'] },
              { title: 'About', links: ['Our Story', 'Benefits', 'Team', 'Careers'] },
              { title: 'Resource', links: ['Blog', 'Contact', 'FAQ', 'Support'] }
            ].map((column, idx) => (
              <div key={idx} role="list">
                <h3 className="text-white font-bold mb-3 md:mb-6 text-sm md:text-lg">{column.title}</h3>
                <ul className="space-y-2 md:space-y-3" role="list">
                  {column.links.map((link, linkIdx) => (
                    <li key={linkIdx} role="listitem">
                      <Link href="#" className="text-gray-400 hover:text-accent transition-colors text-xs md:text-base">
                        {link}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-slate-800 pt-6 md:pt-10">
            <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
              <Link href="/" className="flex items-center space-x-2 md:space-x-3 group" aria-label="Agentic Todo homepage">
                <div className="relative">
                  <div className="absolute inset-0 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity"></div>
                  <div className="relative h-10 w-10 md:h-12 md:w-12 rounded-xl bg-gradient-to-br from-teal-500 to-emerald-400 flex items-center justify-center shadow-2xl group-hover:rotate-12 transition-transform duration-300">
                    <Zap className="h-5 w-5 md:h-7 md:w-7 text-white" aria-hidden="true" />
                  </div>
                </div>
                <span className="text-lg md:text-2xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-emerald-400">
                  Agentic Todo
                </span>
              </Link>

              <p className="text-xs md:text-sm text-gray-500 text-center md:text-left">
                © {new Date().getFullYear()} Agentic Todo. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </footer>

      {/* Floating Action Button - appears on scroll */}
      {mounted && scrollY > 300 && (
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0, opacity: 0 }}
          className="fixed bottom-8 right-8 z-50"
        >
          <Link
            href={isLoggedIn ? "/tasks" : "/auth/register"}
            className="group relative flex items-center justify-center w-14 h-14 md:w-16 md:h-16 bg-gradient-to-r from-teal-500 to-emerald-500 rounded-full shadow-2xl shadow-teal-500/50 hover:shadow-teal-500/80 transition-all duration-300 hover:scale-110 active:scale-95"
            aria-label={isLoggedIn ? "Go to Tasks" : "Get Started"}
          >
            {isLoggedIn ? (
              <Target className="h-6 w-6 md:h-8 md:w-8 text-white" />
            ) : (
              <Rocket className="h-6 w-6 md:h-8 md:w-8 text-white" />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

            {/* Pulse animation */}
            <span className="absolute inset-0 rounded-full bg-teal-400 animate-ping opacity-20"></span>
          </Link>
        </motion.div>
      )}

      {/* Custom Animations */}
      <style jsx>{`
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-20px) rotate(5deg); }
        }
        @keyframes float-delayed {
          0%, 100% { transform: translateY(0px) rotate(0deg); }
          50% { transform: translateY(-30px) rotate(-5deg); }
        }
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-10px); }
        }
        @keyframes slide-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes slide-down {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 68%; }
        }
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(100%); }
        }
        @keyframes glow-pulse {
          0%, 100% { opacity: 0.3; filter: blur(40px); }
          50% { opacity: 0.6; filter: blur(60px); }
        }
        @keyframes rotate-slow {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          * {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
          .animate-gradient,
          .animate-float,
          .animate-float-delayed,
          .animate-bounce-slow,
          .animate-slide-up,
          .animate-slide-down,
          .animate-progress,
          .animate-shimmer,
          .animate-glow-pulse,
          .animate-rotate-slow {
            animation: none;
          }
        }

        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 4s ease infinite;
        }
        .animate-float {
          animation: float 15s ease-in-out infinite;
        }
        .animate-float-delayed {
          animation: float-delayed 20s ease-in-out infinite;
        }
        .animate-bounce-slow {
          animation: bounce-slow 3s ease-in-out infinite;
        }
        .animate-slide-up {
          animation: slide-up 0.6s ease-out forwards;
          opacity: 0;
        }
        .animate-slide-down {
          animation: slide-down 0.3s ease-out forwards;
        }
        .animate-progress {
          animation: progress 2s ease-out forwards;
        }
        .animate-shimmer {
          animation: shimmer 2s ease-in-out infinite;
        }
        .animate-glow-pulse {
          animation: glow-pulse 4s ease-in-out infinite;
        }
        .animate-rotate-slow {
          animation: rotate-slow 30s linear infinite;
        }
        .perspective-1000 {
          perspective: 1000px;
        }
        .touch-manipulation {
          -webkit-tap-highlight-color: transparent;
          -webkit-touch-callout: none;
          -webkit-user-select: none;
          user-select: none;
        }
      `}</style>
    </div>
  );
}
