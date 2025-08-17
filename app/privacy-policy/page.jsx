"use client"

import { motion } from "framer-motion"
import { 
  LucideShield, 
  LucideLock, 
  LucideEye, 
  LucideDatabase,
  LucideGlobe,
  LucideUserCheck,
  LucideFileText,
  LucideMail
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const privacyData = {
  lastUpdated: "January 15, 2024",
  effectiveDate: "January 15, 2024",
  
  sections: [
    {
      icon: LucideShield,
      title: "Information We Collect",
      content: [
        "Personal Information: Name, email address, phone number, and profile information",
        "Financial Information: Account balances, transaction history, and financial goals",
        "Usage Data: How you interact with our platform and features",
        "Device Information: Device type, operating system, and browser information"
      ]
    },
    {
      icon: LucideLock,
      title: "How We Use Your Information",
      content: [
        "Provide and maintain our financial services",
        "Process transactions and manage your accounts",
        "Improve our AI-powered features and user experience",
        "Send important updates and security notifications",
        "Comply with legal obligations and regulations"
      ]
    },
    {
      icon: LucideEye,
      title: "Information Sharing",
      content: [
        "We do not sell, trade, or rent your personal information",
        "Information is shared only with your explicit consent",
        "Third-party service providers under strict confidentiality agreements",
        "Legal requirements and regulatory compliance",
        "Business transfers with appropriate privacy protections"
      ]
    },
    {
      icon: LucideDatabase,
      title: "Data Security",
      content: [
        "Bank-level encryption for all data transmission",
        "Multi-factor authentication and secure access controls",
        "Regular security audits and vulnerability assessments",
        "Employee training on data protection and privacy",
        "Incident response and breach notification procedures"
      ]
    },
    {
      icon: LucideGlobe,
      title: "International Data Transfers",
      content: [
        "Data may be processed in countries with different privacy laws",
        "We ensure adequate protection through standard contractual clauses",
        "Compliance with GDPR and other international privacy regulations",
        "Transparent information about data processing locations"
      ]
    },
    {
      icon: LucideUserCheck,
      title: "Your Rights",
      content: [
        "Access and review your personal information",
        "Correct inaccurate or incomplete data",
        "Request deletion of your personal information",
        "Opt-out of marketing communications",
        "Data portability and export capabilities"
      ]
    }
  ],

  contactInfo: {
    email: "privacy@financeai.com",
    address: "123 Finance Street, Changa, Gujarat, India",
    phone: "+91 6351023729"
  }
}

export default function PrivacyPolicyPage() {
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
              <LucideShield className="h-20 w-20 text-blue-200" />
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Privacy Policy
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-4">
              How we protect and handle your personal information
            </p>
            <div className="text-blue-200 space-y-2">
              <p>Last Updated: {privacyData.lastUpdated}</p>
              <p>Effective Date: {privacyData.effectiveDate}</p>
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
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Our Commitment to Privacy</h2>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  At Finance AI, we are committed to protecting your privacy and ensuring the security of your personal and financial information. This Privacy Policy explains how we collect, use, share, and protect your information when you use our platform.
                </p>
                <p className="text-lg text-gray-600 leading-relaxed">
                  We believe in transparency and want you to understand exactly how your data is handled. If you have any questions about this policy or our data practices, please don't hesitate to contact us.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Policy Sections */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8">
            {privacyData.sections.map((section, index) => (
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

      {/* Additional Details */}
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
                    <LucideFileText className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Data Retention</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We retain your personal information only for as long as necessary to provide our services, comply with legal obligations, resolve disputes, and enforce our agreements.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Financial transaction data is typically retained for 7 years to comply with tax and regulatory requirements. You can request deletion of your account and associated data at any time.
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
                    <LucideShield className="h-8 w-8 text-blue-600 mr-3" />
                    <h3 className="text-2xl font-bold text-gray-800">Children's Privacy</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Our services are not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    If you are a parent or guardian and believe your child has provided us with personal information, please contact us immediately so we can take appropriate action.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Updates and Changes */}
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
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Updates to This Policy</h3>
                <p className="text-gray-600 leading-relaxed mb-4">
                  We may update this Privacy Policy from time to time to reflect changes in our practices, technology, legal requirements, or other factors. When we make changes, we will:
                </p>
                <ul className="space-y-2 mb-6">
                  <li className="text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Update the "Last Updated" date at the top of this policy
                  </li>
                  <li className="text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Notify you through our platform or email for significant changes
                  </li>
                  <li className="text-gray-600 flex items-start">
                    <span className="text-blue-500 mr-2">•</span>
                    Provide you with the opportunity to review and accept changes
                  </li>
                </ul>
                <p className="text-gray-600 leading-relaxed">
                  We encourage you to review this policy periodically to stay informed about how we protect your information.
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Information */}
      <section className="py-16">
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
                <h3 className="text-2xl font-bold text-gray-800 mb-6">Contact Us</h3>
                <p className="text-gray-600 leading-relaxed mb-6">
                  If you have any questions, concerns, or requests regarding this Privacy Policy or our data practices, please contact our Privacy Team:
                </p>
                
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <LucideMail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Email</h4>
                    <a 
                      href={`mailto:${privacyData.contactInfo.email}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {privacyData.contactInfo.email}
                    </a>
                  </div>
                  
                  <div className="text-center">
                    <LucideShield className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Address</h4>
                    <p className="text-gray-600 text-sm">{privacyData.contactInfo.address}</p>
                  </div>
                  
                  <div className="text-center">
                    <LucideMail className="h-8 w-8 text-blue-600 mx-auto mb-3" />
                    <h4 className="font-semibold text-gray-800 mb-2">Phone</h4>
                    <a 
                      href={`tel:${privacyData.contactInfo.phone}`}
                      className="text-blue-600 hover:text-blue-700"
                    >
                      {privacyData.contactInfo.phone}
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
              Have Questions About Privacy?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              We're here to help you understand how we protect your data and respect your privacy
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/contact">
                  Contact Us
                </Link>
              </Button>
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/help">
                  Visit Help Center
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
