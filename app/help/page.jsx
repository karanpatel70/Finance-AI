"use client"

import { motion } from "framer-motion"
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
  LucideSmartphone
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
      description: "Learn how to use our AI-powered receipt scanning feature",
      url: "/help/ai-receipt-scanning"
    },
    {
      title: "Setting up your first budget",
      description: "Step-by-step guide to creating your first budget",
      url: "/help/first-budget"
    },
    {
      title: "Connecting bank accounts",
      description: "Secure connection of your financial accounts",
      url: "/help/connect-accounts"
    },
    {
      title: "Understanding spending reports",
      description: "How to read and use your financial reports",
      url: "/help/spending-reports"
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
      title: "Live Chat",
      description: "Chat with our team",
      action: "Start Chat",
      link: "/chat"
    }
  ]
}

export default function HelpPage() {
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
                />
                <Button className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-blue-600 hover:bg-blue-700 rounded-full px-6">
                  Search
                </Button>
              </div>
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
                    <Button asChild variant="outline" className="w-full">
                      <a href={method.link}>
                        {method.action}
                      </a>
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
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-2">{article.title}</h3>
                    <p className="text-gray-600 mb-4">{article.description}</p>
                    <Button asChild variant="ghost" className="p-0 h-auto text-blue-600 hover:text-blue-700">
                      <Link href={article.url}>
                        Read Article
                        <LucideChevronRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-16">
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
                <Card className="h-full hover:shadow-lg transition-shadow cursor-pointer">
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

      {/* Additional Resources */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Additional Resources</h2>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore more ways to get help and learn about Finance AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <LucideBookOpen className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Documentation</h3>
                  <p className="text-gray-600 mb-4">
                    Comprehensive guides and technical documentation
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/docs">View Documentation</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <LucideVideo className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Video Tutorials</h3>
                  <p className="text-gray-600 mb-4">
                    Step-by-step video guides and tutorials
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/tutorials">Watch Tutorials</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-lg transition-shadow">
                <CardContent className="p-6 text-center">
                  <div className="flex justify-center mb-4">
                    <LucideMessageCircle className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">Community</h3>
                  <p className="text-gray-600 mb-4">
                    Connect with other users and share tips
                  </p>
                  <Button asChild variant="outline">
                    <Link href="/community">Join Community</Link>
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>
    </div>
  )
}
