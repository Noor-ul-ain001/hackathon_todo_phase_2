"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from 'framer-motion';

export default function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const router = useRouter();

  useEffect(() => {
    // Check if user is authenticated by looking for token in localStorage
    const token = localStorage.getItem("auth_token");
    const email = localStorage.getItem("user_email");

    if (token) {
      setIsAuthenticated(true);
      if (email) {
        setUserEmail(email);
      }
    } else {
      setIsAuthenticated(false);
      setUserEmail("");
    }
  }, []);

  const handleSignOut = () => {
    localStorage.removeItem("auth_token");
    localStorage.removeItem("user_id");
    localStorage.removeItem("user_email");
    setIsAuthenticated(false);
    router.push("/");
  };

  // Animation variants
  const buttonVariants = {
    rest: { scale: 1 },
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  return (
    <motion.nav
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="sticky top-0 z-50 bg-primary-dark/90 backdrop-blur-lg border-b border-primary-accent/20 shadow-sm"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0 flex items-center space-x-3 group">
              <motion.div
                whileHover={{ rotate: 12, scale: 1.1 }}
                transition={{ duration: 0.3 }}
                className="h-9 w-9 bg-gradient-to-br from-teal-500 to-emerald-400 rounded-xl flex items-center justify-center shadow-lg"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </motion.div>
              <motion.span
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-2xl font-bold bg-gradient-to-r from-teal-400 to-emerald-400 bg-clip-text text-transparent"
              >
                Agentic Todo
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center space-x-4">
            {isAuthenticated ? (
              <>
                <span className="text-sm text-primary-accent hidden md:block">
                  Signed in as: {userEmail}
                </span>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/tasks"
                    className="px-4 py-2 text-base font-medium text-white bg-primary-accent rounded-md hover:bg-primary-accent/90"
                  >
                    My Tasks
                  </Link>
                </motion.div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <button
                    onClick={handleSignOut}
                    className="px-4 py-2 text-base font-medium text-primary-accent bg-primary-dark/50 rounded-md hover:bg-primary-dark/70 border border-primary-accent/50"
                  >
                    Sign Out
                  </button>
                </motion.div>
              </>
            ) : (
              <>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/auth/signin"
                    className="px-4 py-2 text-base font-medium text-primary-accent hover:text-primary-accent/90 rounded-lg hover:bg-primary-dark/50 transition-colors duration-200 border border-primary-accent/50"
                  >
                    Sign In
                  </Link>
                </motion.div>
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Link
                    href="/auth/register"
                    className="px-5 py-2.5 bg-gradient-to-r from-primary-accent to-primary-dark text-primary-dark font-medium rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 relative overflow-hidden group"
                  >
                    <span className="relative z-10">Make Account</span>
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-primary-dark to-primary-accent"
                      initial={{ x: "-100%" }}
                      whileHover={{ x: "0%" }}
                      transition={{ duration: 0.3 }}
                    />
                  </Link>
                </motion.div>
              </>
            )}
          </div>
        </div>
      </div>
    </motion.nav>
  );
}