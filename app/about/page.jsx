"use client"

import { motion } from "framer-motion"
import { 
  LucideBarChart4, 
  LucideUsers, 
  LucideTarget, 
  LucideShield, 
  LucideTrendingUp,
  LucideLightbulb,
  LucideGlobe,
  LucideAward,
  LucideCheckCircle,
  LucideArrowRight
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const aboutData = {
  company: {
    name: "Finance AI",
    tagline: "Your AI-Powered Financial Companion",
    description: "Empowering your financial decisions with cutting-edge AI technology.",
    mission: "To democratize financial intelligence through AI-powered tools and insights, making sophisticated financial management accessible to everyone.",
    vision: "To become the world's most trusted AI-powered financial platform, helping millions achieve financial freedom and security.",
    founded: "2024",
    location: "Changa, Gujarat, India",
    industry: "Financial Technology (FinTech)"
  },

  story: {
    title: "Our Story",
    content: "Finance AI was born from a simple yet powerful vision: to make financial intelligence accessible to everyone. Founded in 2024, we recognized that traditional financial tools were either too complex for the average person or too basic to provide real value. We set out to bridge this gap by leveraging the power of artificial intelligence to create intuitive, intelligent, and personalized financial management solutions.",
    milestones: [
      {
        year: "2024",
        title: "Company Founded",
        description: "Finance AI was established with a mission to democratize financial intelligence"
      },
      {
        year: "2024",
        title: "First Product Launch",
        description: "Launched our AI-powered financial dashboard and expense tracking system"
      },
      {
        year: "2024",
        title: "10,000+ Users",
        description: "Reached our first major milestone with over 10,000 active users"
      },
      {
        year: "2024",
        title: "AI Receipt Scanning",
        description: "Introduced revolutionary AI-powered receipt scanning technology"
      }
    ]
  },

  values: [
    {
      icon: LucideShield,
      title: "Security First",
      description: "We prioritize the security and privacy of your financial data above everything else."
    },
    {
      icon: LucideLightbulb,
      title: "Innovation",
      description: "We continuously push the boundaries of what's possible with AI and financial technology."
    },
    {
      icon: LucideUsers,
      title: "User-Centric",
      description: "Every feature we build is designed with our users' needs and feedback in mind."
    },
    {
      icon: LucideGlobe,
      title: "Accessibility",
      description: "We believe financial intelligence should be accessible to everyone, regardless of background."
    },
    {
      icon: LucideTrendingUp,
      title: "Growth",
      description: "We're committed to helping our users grow their wealth and achieve financial goals."
    },
    {
      icon: LucideCheckCircle,
      title: "Transparency",
      description: "We believe in complete transparency in how we handle your data and our business practices."
    }
  ],

  team: {
    title: "Meet Our Team",
    subtitle: "Passionate experts dedicated to revolutionizing financial technology",
    members: [
      {
        name: "Karan Patel",
        role: "Founder & CEO",
        image: "/logo.png",
        bio: "Visionary entrepreneur with a passion for democratizing financial technology. Leading Finance AI's mission to make AI-powered financial tools accessible to everyone.",
        expertise: ["AI/ML", "FinTech", "Product Strategy", "Business Development"]
      },
      {
        name: "Sneh Patel",
        role: "Chief Technology Officer",
        image: "/logo.png",
        bio: "Experienced technologist specializing in AI, machine learning, and financial systems. Driving innovation in our AI-powered financial solutions.",
        expertise: ["Artificial Intelligence", "Machine Learning", "Software Architecture", "Financial Systems"]
      },
      {
        name: "Deep Patel",
        role: "Head of Product",
        image: "/logo.png",
        bio: "Product strategist focused on creating intuitive user experiences. Ensuring our platform meets the real needs of our users.",
        expertise: ["Product Management", "User Experience", "Market Research", "Feature Development"]
      },
      {
        name: "Anjali Parmar",
        role: "Head of Marketing",
        image: "/logo.png",
        bio: "Marketing expert passionate about financial education and empowerment. Building awareness and trust in our AI-powered financial platform.",
        expertise: ["Digital Marketing", "Brand Strategy", "Content Creation", "Growth Marketing"]
      }
    ]
  },

  technology: {
    title: "Our Technology",
    subtitle: "Cutting-edge AI and financial technology powering your success",
    features: [
      {
        icon: LucideBarChart4,
        title: "AI-Powered Analytics",
        description: "Advanced machine learning algorithms analyze your financial patterns and provide personalized insights."
      },
      {
        icon: LucideShield,
        title: "Bank-Level Security",
        description: "Enterprise-grade security with end-to-end encryption and multi-factor authentication."
      },
      {
        icon: LucideTrendingUp,
        title: "Real-time Processing",
        description: "Instant transaction processing and real-time balance updates across all your accounts."
      },
      {
        icon: LucideLightbulb,
        title: "Smart Categorization",
        description: "AI automatically categorizes your transactions and learns from your spending patterns."
      }
    ]
  },

  achievements: {
    title: "Our Achievements",
    subtitle: "Recognition and milestones that validate our mission",
    stats: [
      { number: "10,000+", label: "Active Users" },
      { number: "$2.5M", label: "Monthly Volume Managed" },
      { number: "98%", label: "Customer Satisfaction" },
      { number: "99.9%", label: "Platform Uptime" },
      { number: "25+", label: "Countries Served" },
      { number: "1M+", label: "Transactions Processed" }
    ],
    awards: [
      "Best AI Finance App 2024",
      "Top 10 Fintech Startups",
      "Security Excellence Award",
      "User Experience Champion",
      "Innovation in Financial Technology",
      "Best Mobile Finance App"
    ]
  }
}

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Hero Section */}
      <section className="pt-20 pb-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <LucideBarChart4 className="h-20 w-20 text-blue-200" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About {aboutData.company.name}
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto">
              {aboutData.company.tagline}
            </p>
            <p className="text-lg text-blue-200 max-w-2xl mx-auto">
              {aboutData.company.description}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <LucideTarget className="h-12 w-12 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Our Mission</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutData.company.mission}
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <div className="bg-white rounded-2xl p-8 shadow-lg">
                <div className="flex items-center mb-6">
                  <LucideTrendingUp className="h-12 w-12 text-indigo-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Our Vision</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed">
                  {aboutData.company.vision}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Company Story */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{aboutData.story.title}</h2>
            <p className="text-xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
              {aboutData.story.content}
            </p>
          </motion.div>

          {/* Milestones */}
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {aboutData.story.milestones.map((milestone, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">{milestone.year}</div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{milestone.title}</h3>
                    <p className="text-gray-600">{milestone.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Our Core Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide everything we do at Finance AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {aboutData.values.map((value, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <div className="flex justify-center mb-4">
                      <value.icon className="h-12 w-12 text-blue-600" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-800 mb-3">{value.title}</h3>
                    <p className="text-gray-600">{value.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{aboutData.team.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutData.team.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {aboutData.team.members.map((member, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="w-20 h-20 rounded-full overflow-hidden bg-gray-200 flex-shrink-0">
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-semibold text-gray-800 mb-1">{member.name}</h3>
                        <p className="text-blue-600 font-medium mb-3">{member.role}</p>
                        <p className="text-gray-600 mb-4">{member.bio}</p>
                        <div className="flex flex-wrap gap-2">
                          {member.expertise.map((skill, skillIndex) => (
                            <span
                              key={skillIndex}
                              className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full"
                            >
                              {skill}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Technology Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{aboutData.technology.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutData.technology.subtitle}
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {aboutData.technology.features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <feature.icon className="h-12 w-12 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{feature.title}</h3>
                        <p className="text-gray-600">{feature.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Achievements Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">{aboutData.achievements.title}</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {aboutData.achievements.subtitle}
            </p>
          </motion.div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-6 mb-16">
            {aboutData.achievements.stats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <div className="bg-gradient-to-br from-blue-600 to-indigo-700 rounded-xl p-6 text-white">
                  <div className="text-2xl md:text-3xl font-bold mb-2">{stat.number}</div>
                  <div className="text-sm text-blue-100">{stat.label}</div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Awards */}
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {aboutData.achievements.awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6 text-center">
                    <LucideAward className="h-12 w-12 text-yellow-500 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-800">{award}</h3>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Experience the Future of Finance?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join thousands of users who are already managing their finances smarter with AI
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/dashboard">
                  Get Started Free
                  <LucideArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
