
"use client"

import { useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"

import HeroSection from "@/components/hero"
import Link from "next/link"
import { motion, useInView, useAnimation, Variants } from "framer-motion"


// Icons for features
export const featuresData = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        <path d="M20.42 4.58a5.4 5.4 0 0 0-7.65 0l-.77.78-.77-.78a5.4 5.4 0 0 0-7.65 0C1.46 6.7 1.33 10.28 4 13l8 8 8-8c2.67-2.72 2.54-6.3.42-8.42z"></path>
      </svg>
    ),
    title: "Budget Planning",
    description: "Create and manage your budgets with ease. Set spending limits and track your progress in real-time.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
      </svg>
    ),
    title: "Expense Tracking",
    description: "Automatically categorize and track your expenses. Get insights into your spending habits.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
        <polyline points="22 4 12 14.01 9 11.01"></polyline>
      </svg>
    ),
    title: "Financial Goals",
    description:
      "Set and track your financial goals. Whether it's saving for a vacation or paying off debt, we've got you covered.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
      </svg>
    ),
    title: "Investment Tracking",
    description: "Monitor your investments in one place. Track performance and make informed decisions.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        <path d="M21.21 15.89A10 10 0 1 1 8 2.83"></path>
        <path d="M22 12A10 10 0 0 0 12 2v10z"></path>
      </svg>
    ),
    title: "Financial Reports",
    description: "Get detailed reports and visualizations of your financial health. Understand your money better.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-10 h-10"
      >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
      </svg>
    ),
    title: "Secure & Private",
    description: "Your financial data is encrypted and secure. We prioritize your privacy and security.",
  },
]

// Stats data
export const statsData = [
  {
    value: "10K+",
    label: "Active Users",
  },
  {
    value: "$2.5M",
    label: "Managed Monthly",
  },
  {
    value: "98%",
    label: "Customer Satisfaction",
  },
  {
    value: "24/7",
    label: "Customer Support",
  },
]

// How it works data
export const howItWorksData = [
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
        <circle cx="9" cy="7" r="4"></circle>
        <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
        <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
      </svg>
    ),
    title: "Create an Account",
    description: "Sign up for free and set up your profile with your financial goals and preferences.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M20 11.08V8l-6-6H6a2 2 0 0 0-2 2v16c0 1.1.9 2 2 2h6"></path>
        <path d="M14 3v5h5M18 16v6M15 19h6"></path>
      </svg>
    ),
    title: "Connect Your Accounts",
    description:
      "Securely link your bank accounts, credit cards, and investment accounts to get a complete financial picture.",
  },
  {
    icon: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        width="24"
        height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="w-6 h-6"
      >
        <path d="M12 20h9"></path>
        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"></path>
      </svg>
    ),
    title: "Start Managing",
    description: "Use our intuitive dashboard to track expenses, set budgets, and achieve your financial goals.",
  },
]


export const testimonialsData = [
  {
    name: "Sneh patel",
    role: "Small Business Owner",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "This platform has completely transformed how I manage my business finances. The insights and tracking tools are invaluable.",
  },
  {
    name: "Deep patel",
    role: "Software Engineer",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "I've tried many financial apps, but this one stands out. The interface is intuitive and the features are exactly what I needed.",
  },
  {
    name: "Riddhi Ramanuj",
    role: "Marketing Director",
    image: "/placeholder.svg?height=100&width=100",
    quote:
      "The budgeting tools have helped me save for my dream vacation. I'm now more aware of my spending habits than ever before.",
  },
]

// Finance-themed animated SVGs
const FinanceAnimations = {
  growingChart: (
    <svg className="w-full h-full" viewBox="0 0 400 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="chartGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="rgba(59, 130, 246, 0.8)" />
          <stop offset="100%" stopColor="rgba(99, 102, 241, 0.1)" />
        </linearGradient>
      </defs>
      <path 
        className="animate-drawPath"
        d="M 0,250 Q 50,200 100,220 Q 150,240 200,150 Q 250,60 300,100 Q 350,140 400,50" 
        fill="none" 
        stroke="#3b82f6" 
        strokeWidth="4"
      />
      <path 
        d="M 0,250 Q 50,200 100,220 Q 150,240 200,150 Q 250,60 300,100 Q 350,140 400,50 L 400,250 L 0,250 Z" 
        fill="url(#chartGradient)"
        className="animate-fillPath"
      />
      <circle cx="100" cy="220" r="6" fill="#3b82f6" className="animate-popDot" style={{ animationDelay: "0.5s" }} />
      <circle cx="200" cy="150" r="6" fill="#3b82f6" className="animate-popDot" style={{ animationDelay: "1s" }} />
      <circle cx="300" cy="100" r="6" fill="#3b82f6" className="animate-popDot" style={{ animationDelay: "1.5s" }} />
      <circle cx="400" cy="50" r="6" fill="#3b82f6" className="animate-popDot" style={{ animationDelay: "2s" }} />
    </svg>
  ),
  coins: (
    <svg className="w-full h-full" viewBox="0 0 300 200" xmlns="http://www.w3.org/2000/svg">
      <circle cx="90" cy="100" r="40" fill="#fcd34d" className="animate-coinFlip" style={{ animationDelay: "0.2s" }} />
      <circle cx="90" cy="100" r="35" fill="#fbbf24" className="animate-coinFlip" style={{ animationDelay: "0.2s" }} />
      <text x="90" y="105" textAnchor="middle" fill="#92400e" fontSize="20" fontWeight="bold" className="animate-coinFlip" style={{ animationDelay: "0.2s" }}>$</text>
      
      <circle cx="150" cy="100" r="40" fill="#fcd34d" className="animate-coinFlip" style={{ animationDelay: "0.4s" }} />
      <circle cx="150" cy="100" r="35" fill="#fbbf24" className="animate-coinFlip" style={{ animationDelay: "0.4s" }} />
      <text x="150" y="105" textAnchor="middle" fill="#92400e" fontSize="20" fontWeight="bold" className="animate-coinFlip" style={{ animationDelay: "0.4s" }}>$</text>
      
      <circle cx="210" cy="100" r="40" fill="#fcd34d" className="animate-coinFlip" style={{ animationDelay: "0.6s" }} />
      <circle cx="210" cy="100" r="35" fill="#fbbf24" className="animate-coinFlip" style={{ animationDelay: "0.6s" }} />
      <text x="210" y="105" textAnchor="middle" fill="#92400e" fontSize="20" fontWeight="bold" className="animate-coinFlip" style={{ animationDelay: "0.6s" }}>$</text>
    </svg>
  ),
  aiRobot: (
    <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <rect x="100" y="100" width="100" height="130" rx="10" fill="#818cf8" className="animate-pulse" />
      <rect x="90" y="70" width="120" height="50" rx="25" fill="#6366f1" className="animate-pulse" />
      <circle cx="130" cy="95" r="10" fill="#eff6ff" className="animate-blink" />
      <circle cx="170" cy="95" r="10" fill="#eff6ff" className="animate-blink" style={{ animationDelay: "0.5s" }} />
      <rect x="125" y="160" width="50" height="10" rx="5" fill="#eff6ff" className="animate-pulse" />
      <rect x="125" y="180" width="50" height="10" rx="5" fill="#eff6ff" className="animate-pulse" />
      <rect x="125" y="200" width="50" height="10" rx="5" fill="#eff6ff" className="animate-pulse" />
      <circle cx="150" cy="240" r="10" fill="#3b82f6" className="animate-pingNormal" />
      <path d="M 70,180 L 100,150 M 230,180 L 200,150" stroke="#6366f1" strokeWidth="4" className="animate-wave" />
      <circle cx="70" cy="180" r="10" fill="#818cf8" className="animate-pingNormal" />
      <circle cx="230" cy="180" r="10" fill="#818cf8" className="animate-pingNormal" />
    </svg>
  ),
  securityShield: (
    <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <path d="M150,50 L50,100 L50,200 Q50,250 150,280 Q250,250 250,200 L250,100 Z" fill="#a5b4fc" className="animate-pulse" />
      <path d="M150,80 L80,115 L80,200 Q80,230 150,255 Q220,230 220,200 L220,115 Z" fill="#6366f1" className="animate-securityPulse" />
      <path d="M130,170 L110,150 L120,140 L130,150 L180,100 L190,110 Z" fill="#ffffff" className="animate-checkmark" />
      <circle cx="150" cy="150" r="80" fill="none" stroke="#c7d2fe" strokeWidth="5" strokeDasharray="502" strokeDashoffset="502" className="animate-circleLoader" />
    </svg>
  ),
  smartInvesting: (
    <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="barGradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#3b82f6" />
          <stop offset="100%" stopColor="#6366f1" />
        </linearGradient>
      </defs>
      <line x1="50" y1="250" x2="250" y2="250" stroke="#94a3b8" strokeWidth="2" />
      <line x1="50" y1="50" x2="50" y2="250" stroke="#94a3b8" strokeWidth="2" />
      
      <rect x="70" y="250" width="30" height="0" fill="url(#barGradient)" className="animate-barGrow" style={{ animationDelay: "0.1s", transformOrigin: "bottom" }} />
      <rect x="110" y="250" width="30" height="0" fill="url(#barGradient)" className="animate-barGrow" style={{ animationDelay: "0.3s", transformOrigin: "bottom" }} />
      <rect x="150" y="250" width="30" height="0" fill="url(#barGradient)" className="animate-barGrow" style={{ animationDelay: "0.5s", transformOrigin: "bottom" }} />
      <rect x="190" y="250" width="30" height="0" fill="url(#barGradient)" className="animate-barGrow" style={{ animationDelay: "0.7s", transformOrigin: "bottom" }} />
      
      <circle cx="100" cy="100" r="20" fill="#fcd34d" className="animate-float" style={{ animationDelay: "0.2s" }} />
      <path d="M 100,92 L 100,108 M 92,100 L 108,100" stroke="#92400e" strokeWidth="2" />
      
      <circle cx="200" cy="120" r="30" fill="#fcd34d" className="animate-float" style={{ animationDelay: "0.5s" }} />
      <path d="M 200,107 L 200,133 M 187,120 L 213,120" stroke="#92400e" strokeWidth="3" />
    </svg>
  ),
  budgetPlanning: (
    <svg className="w-full h-full" viewBox="0 0 300 300" xmlns="http://www.w3.org/2000/svg">
      <circle cx="150" cy="150" r="100" fill="#dbeafe" />
      <path 
        d="M 150,150 L 150,70 A 80 80 0 0 1 220,180 Z" 
        fill="#3b82f6" 
        className="animate-budgetSlice"
      />
      <path 
        d="M 150,150 L 220,180 A 80 80 0 0 1 130,230 Z" 
        fill="#60a5fa" 
        className="animate-budgetSlice"
        style={{ animationDelay: "0.5s" }}
      />
      <path 
        d="M 150,150 L 130,230 A 80 80 0 0 1 80,130 Z" 
        fill="#93c5fd" 
        className="animate-budgetSlice"
        style={{ animationDelay: "1s" }}
      />
      <path 
        d="M 150,150 L 80,130 A 80 80 0 0 1 150,70 Z" 
        fill="#bfdbfe" 
        className="animate-budgetSlice"
        style={{ animationDelay: "1.5s" }}
      />
      <circle cx="150" cy="150" r="50" fill="white" className="animate-pulse" />
      <text x="150" y="145" textAnchor="middle" fill="#3b82f6" fontSize="28" fontWeight="bold">$</text>
      <text x="150" y="165" textAnchor="middle" fill="#1e40af" fontSize="14">Budget</text>
    </svg>
  )
}

export default function Home() {
  // Animation variants
  const fadeIn = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  }

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
      },
    },
  }

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  }

  const statsVariants = {
    hidden: { opacity: 0 },
    visible: (i) => ({
      opacity: 1,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
      },
    }),
  }

  const countRef = useRef(null)
  const countInView = useInView(countRef, { once: true, amount: 0.3 })
  const countControls = useAnimation()

  useEffect(() => {
    if (countInView) {
      countControls.start("visible")
    }
  }, [countInView, countControls])

  return (
    <div className="min-h-screen bg-white overflow-hidden" suppressHydrationWarning>
      <HeroSection />

      {/* Stats Section with AI Finance Animation */}
      {/* <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
        
        
        <div className="absolute top-0 right-0 w-64 h-64 opacity-70 lg:opacity-100 transform -translate-y-1/4 translate-x-1/4">
          {FinanceAnimations.aiRobot}
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            ref={countRef}
            initial="hidden"
            animate={countControls}
            variants={staggerContainer}
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
          >
            {statsData.map((stat, index) => (
              <motion.div
                key={index}
                custom={index}
                variants={statsVariants}
                className="text-center bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg transform hover:scale-105 transition-transform duration-300"
              >
                <motion.div
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={countInView ? { opacity: 1, scale: 1 } : {}}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-3"
                >
                  {stat.value}
                </motion.div>
                <div className="text-gray-700 font-medium">{stat.label}</div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Features Section with Growing Chart Animation */}
      <section id="features" className="py-24 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent"></div>
        
        {/* Added Growing Chart Animation */}
        <div className="absolute top-10 left-1/2 transform -translate-x-1/2 w-full max-w-xl h-64 opacity-30">
          {FinanceAnimations.growingChart}
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Everything you need to manage your finances
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {featuresData.map((feature, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <CardContent className="space-y-5 p-8">
                    <div className="text-blue-600 transform group-hover:scale-110 transition-transform duration-300">
                      {feature.icon}
                    </div>
                    <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* How It Works Section with Coins Animation */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
        
        {/* Added Coins Animation */}
        <div className="absolute bottom-10 right-10 w-64 h-64 opacity-80">
          {FinanceAnimations.coins}
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              How It Works
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {/* Connection lines between steps (visible on md screens and up) */}
            <div className="hidden md:block absolute top-1/4 left-1/4 right-1/4 h-0.5 bg-blue-200"></div>

            {howItWorksData.map((step, index) => (
              <motion.div
                key={index}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, amount: 0.3 }}
                variants={{
                  hidden: { opacity: 0, y: 50 },
                  visible: {
                    opacity: 1,
                    y: 0,
                    transition: {
                      delay: index * 0.2,
                      duration: 0.6,
                      ease: "easeOut",
                    },
                  },
                }}
                className="text-center relative"
              >
                <motion.div
                  whileHover={{ scale: 1.1, boxShadow: "0 10px 25px -5px rgba(59, 130, 246, 0.5)" }}
                  className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md border border-blue-100 z-10 relative"
                >
                  <div className="text-blue-600 transform scale-125">{step.icon}</div>
                </motion.div>
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 -z-10 text-7xl font-bold text-blue-100/50">
                  {index + 1}
                </div>
                <h3 className="text-xl font-semibold mb-4 text-blue-800">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section with Security Shield Animation */}
      {/* <section id="testimonials" className="py-24 relative">
        <div className="absolute top-0 left-0 w-full h-64 bg-gradient-to-b from-blue-50 to-transparent"></div>
        
      
        <div className="absolute top-10 left-10 w-64 h-64 opacity-50 lg:opacity-80">
          {FinanceAnimations.securityShield}
        </div>

        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              What Our Users Say
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.1 }}
            variants={staggerContainer}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          >
            {testimonialsData.map((testimonial, index) => (
              <motion.div key={index} variants={cardVariants}>
                <Card className="h-full border-none shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white overflow-hidden group">
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-indigo-500 transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300"></div>
                  <CardContent className="space-y-5 p-8">
                    <div className="flex items-center space-x-4">
                      <div className="w-16 h-16 rounded-full overflow-hidden">
                        <Image
                          src={testimonial.image}
                          alt={testimonial.name}
                          width={64}
                          height={64}
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold group-hover:text-blue-600 transition-colors duration-300">
                          {testimonial.name}
                        </h3>
                        <p className="text-gray-600">{testimonial.role}</p>
                      </div>
                    </div>
                    <p className="text-gray-600 italic">
                      "{testimonial.quote}"
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section> */}

      {/* Call to Action Section with Smart Investing Animation */}
      <section className="py-24 bg-gradient-to-r from-blue-50 to-indigo-50 relative">
        <div className="absolute inset-0 bg-[url('/placeholder.svg?height=200&width=200')] bg-repeat opacity-5"></div>
        
        {/* Added Smart Investing Animation */}
        <div className="absolute bottom-10 left-10 w-64 h-64 opacity-80">
          {FinanceAnimations.smartInvesting}
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold mb-4 bg-gradient-to-r from-blue-700 to-indigo-700 bg-clip-text text-transparent">
              Ready to Take Control of Your Finances?
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-indigo-500 mx-auto rounded-full"></div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.2 }}
            variants={fadeIn}
            className="text-center"
          >
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                asChild
                className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-full font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/signup">
                  Get Started for Free
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                className="border-2 border-white text-white px-8 py-4 rounded-full font-semibold hover:bg-white hover:text-blue-600 transition-all duration-300 transform hover:scale-105"
              >
                <Link href="/about">
                  Learn More About Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}

