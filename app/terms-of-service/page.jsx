"use client"

import { motion } from "framer-motion"
import { 
  LucideFileText, 
  LucideShield, 
  LucideUserCheck, 
  LucideAlertTriangle,
  LucideCheckCircle,
  LucideXCircle,
  LucideGavel,
  LucideMail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const termsData = {
  lastUpdated: "January 15, 2024",
  effectiveDate: "January 15, 2024",
  
  sections: [
    {
      icon: LucideUserCheck,
      title: "Acceptance of Terms",
      content: [
        "By accessing or using Finance AI, you agree to be bound by these Terms of Service",
        "If you do not agree to these terms, you must not use our services",
        "We may modify these terms at any time with notice to users",
        "Continued use after changes constitutes acceptance of new terms"
      ]
    },
    {
      icon: LucideShield,
      title: "User Accounts",
      content: [
        "You must be at least 18 years old to create an account",
        "You are responsible for maintaining account security",
        "You must provide accurate and complete information",
        "You are responsible for all activities under your account"
      ]
    },
    {
      icon: LucideCheckCircle,
      title: "Permitted Uses",
      content: [
        "Personal financial management and tracking",
        "Business financial management (with appropriate plan)",
        "Educational and research purposes",
        "Integration with authorized third-party services"
      ]
    },
    {
      icon: LucideXCircle,
      title: "Prohibited Uses",
      content: [
        "Violating any applicable laws or regulations",
        "Attempting to gain unauthorized access to our systems",
        "Using our services for illegal financial activities",
        "Interfering with other users' access to services"
      ]
    },
    {
      icon: LucideGavel,
      title: "Intellectual Property",
      content: [
        "All content and software remain our property",
        "You retain ownership of your financial data",
        "You may not copy, modify, or distribute our software",
        "Trademarks and logos are protected intellectual property"
      ]
    },
    {
      icon: LucideShield,
      title: "Privacy and Data",
      content: [
        "Your privacy is protected by our Privacy Policy",
        "We implement industry-standard security measures",
        "You control what data you share with us",
        "We do not sell your personal information"
      ]
    }
  ],

  contactInfo: {
    email: "legal@financeai.com",
    address: "123 Finance Street, Changa, Gujarat, India",
    phone: "+91 6351023729"
  }
}

export default function TermsOfServicePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 pt-20">
      {/* Hero Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700 text-white">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="flex justify-center mb-6">
              <LucideFileText className="h-20 w-20 text-blue-200" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Terms of Service
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
              The terms and conditions governing your use of Finance AI
            </p>
            <div className="text-blue-200 space-y-2">
              <p>Last Updated: {termsData.lastUpdated}</p>
              <p>Effective Date: {termsData.effectiveDate}</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Welcome to Finance AI</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  These Terms of Service ("Terms") govern your use of Finance AI's platform, services, and applications. By using our services, you agree to these terms and our Privacy Policy.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  Finance AI provides AI-powered financial management tools to help you track expenses, manage budgets, and achieve your financial goals. We're committed to providing a secure, reliable, and user-friendly experience.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Terms Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {termsData.sections.map((section, index) => (
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
                      <section.icon className="h-8 w-8 text-blue-600 mr-3" />
                      <h3 className="text-xl font-semibold text-gray-800">{section.title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {section.content.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-gray-600 flex items-start">
                          <span className="text-blue-500 mr-2">•</span>
                          {item}
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

      {/* Additional Terms */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <LucideAlertTriangle className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Limitation of Liability</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Finance AI provides financial management tools, but we are not financial advisors. Our services are for informational and organizational purposes only.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We are not liable for any financial decisions you make based on our platform's information. Always consult with qualified financial professionals for investment and financial planning advice.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full shadow-lg">
                <CardContent className="p-8">
                  <div className="flex items-center mb-6">
                    <LucideGavel className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Governing Law</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    These Terms are governed by the laws of India. Any disputes will be resolved through binding arbitration in accordance with Indian law.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We are committed to resolving disputes amicably and will work with users to find mutually acceptable solutions before pursuing legal action.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Service Availability */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Service Availability and Updates</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We strive to provide reliable, 24/7 access to our services. However, we may need to perform maintenance, updates, or address technical issues that could temporarily affect service availability.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We will provide reasonable notice for scheduled maintenance and work to minimize any disruption to your use of our platform.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  We continuously improve our services and may add new features or modify existing ones. We will notify you of significant changes that affect your use of our platform.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Termination */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-lg">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Account Termination</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  You may terminate your account at any time by contacting our support team or using the account deletion feature in your settings.
                </p>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may terminate or suspend your account if you violate these Terms, engage in fraudulent activity, or for other legitimate business reasons.
                </p>
                <p className="text-gray-600 leading-relaxed">
                  Upon termination, we will delete your personal data in accordance with our Privacy Policy, though some information may be retained for legal or regulatory compliance.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="max-w-4xl mx-auto"
          >
            <Card className="shadow-lg bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
              <CardContent className="p-8">
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Questions About These Terms?</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you have any questions about these Terms of Service or need clarification on any provision, please contact our legal team:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <LucideMail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                    <a 
                      href={`mailto:${termsData.contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {termsData.contactInfo.email}
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <LucideFileText className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                    <p className="text-gray-600 text-sm">{termsData.contactInfo.address}</p>
                  </div>
                  
                  <div className="text-center">
                    <LucideMail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Phone</h4>
                    <a 
                      href={`tel:${termsData.contactInfo.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {termsData.contactInfo.phone}
                    </a>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-700">
        <div className="container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl font-bold text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              By using Finance AI, you agree to these terms and can start managing your finances with AI-powered tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/signup">
                  Create Account
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/help">
                  Get Help
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
