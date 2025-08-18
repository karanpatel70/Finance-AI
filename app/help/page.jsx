"use client"

import { motion } from "framer-motion"
import { useState, useEffect } from "react"
import { 
  LucideSearch, 
  LucideBookOpen, 
  LucideVideo, 
  LucideMessageCircle,
  LucidePhone,
  LucideMail,
  LucideChevronRight,
  LucideHelpCircle,
  LucideShield,
  LucideSettings,
  LucideCreditCard,
  LucideBarChart3,
  LucideCalculator,
  LucideSmartphone,
  LucideSend,
  LucideX,
  LucideYoutube,
  LucideExternalLink
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import Link from "next/link"

const helpData = {
  categories: [
    {
      icon: LucideSettings,
      title: "Getting Started",
      description: "Learn the basics of Finance AI",
      articles: [
        "How to create your first account",
        "Setting up your profile",
        "Connecting your bank accounts",
        "Understanding the dashboard"
      ]
    },
    {
      icon: LucideCreditCard,
      title: "Transactions & Accounts",
      description: "Manage your financial data",
      articles: [
        "Adding and editing transactions",
        "Creating and managing accounts",
        "Transaction categories and tags",
        "Importing transaction data"
      ]
    },
    {
      icon: LucideBarChart3,
      title: "Budgeting & Reports",
      description: "Track your spending and goals",
      articles: [
        "Creating and managing budgets",
        "Setting financial goals",
        "Understanding spending reports",
        "Exporting your data"
      ]
    },
    {
      icon: LucideSmartphone,
      title: "Mobile App",
      description: "Use Finance AI on the go",
      articles: [
        "Downloading the mobile app",
        "Mobile app features",
        "Syncing between devices",
        "Mobile app troubleshooting"
      ]
    },
    {
      icon: LucideShield,
      title: "Security & Privacy",
      description: "Keep your data safe",
      articles: [
        "Two-factor authentication",
        "Password security",
        "Data encryption",
        "Privacy settings"
      ]
    },
    {
      icon: LucideCalculator,
      title: "AI Features",
      description: "Leverage artificial intelligence",
      articles: [
        "AI receipt scanning",
        "Smart categorization",
        "Financial insights",
        "Predictive analytics"
      ]
    }
  ],

  popularArticles: [
    {
      title: "How to scan receipts with AI",
      description: "Learn how to use our AI-powered receipt scanning feature to automatically categorize expenses",
      content: "Our AI receipt scanner uses advanced machine learning to extract information from photos of receipts. Simply take a photo of your receipt and our AI will automatically categorize the transaction, extract the amount, and add it to your records.",
      url: "/help/ai-receipt-scanning",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Setting up your first budget",
      description: "Step-by-step guide to creating your first budget and tracking your spending",
      content: "Creating a budget is the foundation of good financial management. Start by setting spending limits for different categories, then track your progress throughout the month. Our AI will help you stay on track with smart alerts and insights.",
      url: "/help/first-budget",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Connecting bank accounts",
      description: "Secure connection of your financial accounts using bank-level encryption",
      content: "We use industry-standard encryption and secure APIs to connect your bank accounts. Your credentials are never stored on our servers, and all data transmission is encrypted using SSL/TLS protocols.",
      url: "/help/connect-accounts",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    },
    {
      title: "Understanding spending reports",
      description: "How to read and use your financial reports to make better decisions",
      content: "Our spending reports provide detailed insights into your financial habits. View spending by category, track trends over time, and identify areas where you can save money. Use these insights to make informed financial decisions.",
      url: "/help/spending-reports",
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ"
    }
  ],

  contactMethods: [
    {
      icon: LucideMail,
      title: "Email Support",
      description: "Get help via email",
      action: "support@financeai.com",
      link: "mailto:support@financeai.com"
    },
    {
      icon: LucidePhone,
      title: "Phone Support",
      description: "Call us directly",
      action: "+91 6351023729",
      link: "tel:+91 6351023729"
    },
    {
      icon: LucideMessageCircle,
      title: "AI Chat Support",
      description: "Chat with our AI assistant",
      action: "Start Chat",
      link: "#chat"
    }
  ],

  youtubeTutorials: [
    {
      title: "Getting Started with Finance AI",
      description: "Complete beginner's guide to setting up your account",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "5:32"
    },
    {
      title: "AI Receipt Scanning Tutorial",
      description: "Learn how to use our AI-powered receipt scanner",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "3:45"
    },
    {
      title: "Budget Planning Made Easy",
      description: "Create and manage budgets effectively",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "7:18"
    },
    {
      title: "Understanding Financial Reports",
      description: "How to read and use your financial insights",
      url: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      duration: "4:56"
    }
  ]
}

const aiChatResponses = {
  "account": "To create an account, click the 'Sign Up' button on our homepage. You'll need to provide your email address and create a password. We'll send you a verification email to complete the setup.",
  "budget": "To create a budget, go to the Budget section and click 'Create Budget'. Set your monthly spending limit and we'll track your progress automatically. You can also set category-specific budgets.",
  "transactions": "To add transactions, go to the Expenses section and click 'Add Transaction'. You can also use our AI receipt scanner to automatically add transactions from photos of receipts.",
  "security": "We use bank-level encryption (AES-256) to protect your data. Your credentials are never stored on our servers, and all data transmission is encrypted. We're also SOC 2 Type II compliant.",
  "ai": "Our AI features include automatic receipt scanning, smart categorization, spending insights, and predictive analytics. The AI learns from your patterns to provide personalized recommendations.",
  "mobile": "Our mobile app is available for both iOS and Android. Download it from the App Store or Google Play Store. All features from the web version are available on mobile with additional touch-optimized interfaces.",
  "default": "I'm here to help! You can ask me about account setup, budgeting, transactions, security, AI features, mobile app, or any other Finance AI related questions. What would you like to know?"
}

export default function HelpPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [showChat, setShowChat] = useState(false)
  const [chatMessages, setChatMessages] = useState([
    { type: "ai", message: "Hello! I'm your Finance AI assistant. How can I help you today?" }
  ])
  const [chatInput, setChatInput] = useState("")

  // Search functionality
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([])
      return
    }

    const results = []
    const searchLower = searchTerm.toLowerCase()

    // Search in categories and articles
    helpData.categories.forEach(category => {
      category.articles.forEach(article => {
        if (article.toLowerCase().includes(searchLower)) {
          results.push({
            title: article,
            category: category.title
          })
        }
      })
    })

    // Search in popular articles
    helpData.popularArticles.forEach(article => {
      if (article.title.toLowerCase().includes(searchLower) || 
          article.description.toLowerCase().includes(searchLower) ||
          article.content.toLowerCase().includes(searchLower)) {
        results.push({
          title: article.title,
          category: "Popular"
        })
      }
    })

    setSearchResults(results.slice(0, 10)) // Limit to 10 results
  }, [searchTerm])

  // AI Chat functionality
  const handleChatSubmit = (e) => {
    e.preventDefault()
    if (!chatInput.trim()) return

    const userMessage = chatInput.trim()
    setChatMessages(prev => [...prev, { type: "user", message: userMessage }])
    setChatInput("")

    // Simulate AI response
    setTimeout(() => {
      let response = aiChatResponses.default
      const userLower = userMessage.toLowerCase()
      
      if (userLower.includes("account") || userLower.includes("sign up") || userLower.includes("create")) {
        response = aiChatResponses.account
      } else if (userLower.includes("budget")) {
        response = aiChatResponses.budget
      } else if (userLower.includes("transaction") || userLower.includes("expense")) {
        response = aiChatResponses.transactions
      } else if (userLower.includes("security") || userLower.includes("safe") || userLower.includes("protect")) {
        response = aiChatResponses.security
      } else if (userLower.includes("ai") || userLower.includes("artificial intelligence")) {
        response = aiChatResponses.ai
      } else if (userLower.includes("mobile") || userLower.includes("app")) {
        response = aiChatResponses.mobile
      }

      setChatMessages(prev => [...prev, { type: "ai", message: response }])
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20" suppressHydrationWarning>
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Help Center
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Find answers to your questions and learn how to make the most of Finance AI
            </p>
            
            {/* Search Bar */}
            <div className="max-w-2xl mx-auto">
              <div className="relative">
                <LucideSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
                <Input
                  placeholder="Search for help articles, features, or topics..."
                  className="pl-12 pr-4 py-4 text-lg bg-white text-gray-900 border-0 rounded-full"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                  Search
                </Button>
              </div>
              
              {/* Search Results */}
              {searchResults.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
                  {searchResults.map((result, index) => (
                    <div key={index} className="p-4 border-b hover:bg-gray-50 cursor-pointer">
                      <div className="flex items-start justify-between">
                        <div>
                          <h4 className="font-semibold text-gray-900">{result.title}</h4>
                          <span className="text-xs text-blue-600 bg-blue-50 px-2 py-1 rounded mt-2 inline-block">
                            {result.category}
                          </span>
                        </div>
                        <LucideChevronRight className="h-4 w-4 text-gray-400 mt-1" />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-3 gap-6">
            {helpData.contactMethods.map((method, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <method.icon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">{method.title}</h3>
                    <p className="text-gray-600 mb-4">{method.description}</p>
                    <Button 
                      asChild={method.link !== "#chat"} 
                      variant="outline" 
                      className="w-full"
                      onClick={method.link === "#chat" ? () => setShowChat(true) : undefined}
                    >
                      {method.link === "#chat" ? (
                        <span>{method.action}</span>
                      ) : (
                        <a href={method.link}>
                          {method.action}
                        </a>
                      )}
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Popular Articles</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Start with these frequently asked questions and popular topics
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6">
            {helpData.popularArticles.map((article, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <div className="space-y-3">
                      <p className="text-sm text-gray-700">{article.content}</p>
                      <div className="flex items-center gap-2">
                        <Button asChild variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                          <Link href={article.url}>
                            Read Full Article
                            <LucideChevronRight className="ml-2 h-4 w-4" />
                          </Link>
                        </Button>
                        {article.videoUrl && (
                          <Button asChild variant="ghost" className="p-0 h-auto text-red-600 hover:text-red-700">
                            <a href={article.videoUrl} target="_blank" rel="noopener noreferrer">
                              <LucideYoutube className="h-4 w-4 mr-2" />
                              Watch Video
                            </a>
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Tutorials */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Video Tutorials</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Watch step-by-step tutorials on our YouTube channel
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {helpData.youtubeTutorials.map((tutorial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-4">
                    <div className="flex items-center mb-3">
                      <LucideYoutube className="h-6 w-6 text-red-600 mr-2" />
                      <span className="text-xs text-gray-500">{tutorial.duration}</span>
                    </div>
                    <h3 className="text-sm font-semibold text-gray-800 mb-2">{tutorial.title}</h3>
                    <p className="text-xs text-gray-600 mb-3">{tutorial.description}</p>
                    <Button asChild variant="outline" size="sm" className="w-full">
                      <a href={tutorial.url} target="_blank" rel="noopener noreferrer">
                        <LucideExternalLink className="h-3 w-3 mr-1" />
                        Watch
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8">
            <Button asChild variant="outline">
              <a href="https://www.youtube.com/@financeai" target="_blank" rel="noopener noreferrer">
                <LucideYoutube className="h-4 w-4 mr-2" />
                Visit Our YouTube Channel
              </a>
            </Button>
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Browse by Category</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Find help organized by topic and feature
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {helpData.categories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center mb-4">
                      <category.icon className="h-8 w-8 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">{category.title}</h3>
                    </div>
                    <p className="text-gray-600 mb-4">{category.description}</p>
                    <ul className="space-y-2">
                      {category.articles.map((article, articleIndex) => (
                        <li key={articleIndex} className="text-sm text-gray-600 flex items-center">
                          <LucideHelpCircle className="h-4 w-4 text-blue-400 mr-2 flex-shrink-0" />
                          {article}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* AI Chat Modal */}
      {showChat && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-end justify-end p-4 z-50">
          <motion.div
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-xl w-full max-w-md h-96 flex flex-col"
          >
            {/* Chat Header */}
            <div className="flex items-center justify-between p-4 border-b">
              <div className="flex items-center">
                <LucideMessageCircle className="h-6 w-6 text-blue-600 mr-2" />
                <h3 className="font-semibold">AI Assistant</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowChat(false)}
              >
                <LucideX className="h-4 w-4" />
              </Button>
            </div>

            {/* Chat Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {chatMessages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div
                    className={`max-w-xs px-4 py-2 rounded-lg ${
                      msg.type === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {msg.message}
                  </div>
                </div>
              ))}
            </div>

            {/* Chat Input */}
            <form onSubmit={handleChatSubmit} className="p-4 border-t">
              <div className="flex gap-2">
                <Input
                  placeholder="Type your message..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1"
                />
                <Button type="submit" size="sm">
                  <LucideSend className="h-4 w-4" />
                </Button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </div>
  )
}
