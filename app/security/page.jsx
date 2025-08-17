"use client"

import { motion } from "framer-motion"
import { 
  LucideShield, 
  LucideLock, 
  LucideEye, 
  LucideDatabase,
  LucideKey,
  LucideCheckCircle,
  LucideAlertTriangle,
  LucideUsers,
  LucideGlobe,
  LucideAward
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Link from "next/link"

const securityData = {
  features: [
    {
      icon: LucideLock,
      title: "End-to-End Encryption",
      description: "All data is encrypted in transit and at rest using AES-256 encryption"
    },
    {
      icon: LucideKey,
      title: "Multi-Factor Authentication",
      description: "Secure your account with SMS, email, or authenticator app verification"
    },
    {
      icon: LucideUsers,
      title: "Role-Based Access Control",
      description: "Granular permissions ensure users only access what they need"
    },
    {
      icon: LucideDatabase,
      title: "Secure Data Centers",
      description: "Enterprise-grade infrastructure with 99.9% uptime guarantee"
    }
  ],

  certifications: [
    {
      icon: LucideAward,
      title: "ISO 27001 Certified",
      description: "International standard for information security management"
    },
    {
      icon: LucideAward,
      title: "SOC 2 Type II Compliant",
      description: "Service Organization Control 2 compliance for data security"
    },
    {
      icon: LucideAward,
      title: "GDPR Compliant",
      description: "European Union data protection regulation compliance"
    },
    {
      icon: LucideAward,
      title: "PCI DSS Level 1",
      description: "Payment Card Industry Data Security Standard compliance"
    }
  ],

  practices: [
    "Regular security audits and penetration testing",
    "Employee security training and background checks",
    "Incident response and breach notification procedures",
    "Continuous monitoring and threat detection",
    "Regular software updates and security patches",
    "Secure development lifecycle (SDL) practices"
  ]
}

export default function SecurityPage() {
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
              Security & Privacy
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Bank-level security to protect your financial data and privacy
            </p>
          </motion.div>
        </div>
      </section>

      {/* Security Features */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Enterprise-Grade Security</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We implement industry-leading security measures to protect your financial information
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityData.features.map((feature, index) => (
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

      {/* Certifications */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Security Certifications</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our commitment to security is validated by leading industry certifications
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8">
            {securityData.certifications.map((cert, index) => (
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
                        <cert.icon className="h-12 w-12 text-green-600" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">{cert.title}</h3>
                        <p className="text-gray-600">{cert.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Security Practices */}
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
                <div className="flex items-center mb-6">
                  <LucideCheckCircle className="h-12 w-12 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Our Security Practices</h2>
                </div>
                <p className="text-lg text-gray-600 mb-6">
                  We maintain the highest standards of security through comprehensive practices and continuous improvement:
                </p>
                <div className="grid md:grid-cols-2 gap-4">
                  {securityData.practices.map((practice, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <LucideCheckCircle className="h-5 w-5 text-green-500 mt-0.5 flex-shrink-0" />
                      <span className="text-gray-700">{practice}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Data Protection */}
      <section className="py-16 bg-white">
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
                    <LucideEye className="h-8 w-8 text-blue-600 mr-4" />
                    <h3 className="text-2xl font-bold text-gray-800">Data Privacy</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    Your financial data belongs to you. We never sell, rent, or share your personal information with third parties without your explicit consent.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    We implement strict access controls and audit logging to ensure only authorized personnel can access your data, and only when necessary to provide our services.
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
                    <LucideGlobe className="h-8 w-8 text-blue-600 mr-4" />
                    <h3 className="text-2xl font-bold text-gray-800">Global Compliance</h3>
                  </div>
                  <p className="text-gray-600 leading-relaxed mb-4">
                    We comply with international data protection regulations including GDPR, CCPA, and other regional privacy laws.
                  </p>
                  <p className="text-gray-600 leading-relaxed">
                    Our platform is designed with privacy by design principles, ensuring data protection is built into every feature from the ground up.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Incident Response */}
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
                <div className="flex items-center mb-6">
                  <LucideAlertTriangle className="h-12 w-12 text-blue-600 mr-4" />
                  <h2 className="text-3xl font-bold text-gray-800">Incident Response</h2>
                </div>
                <p className="text-lg text-gray-600 leading-relaxed mb-6">
                  We have comprehensive incident response procedures in place to quickly identify, contain, and resolve any security issues:
                </p>
                <div className="grid md:grid-cols-3 gap-6">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">24/7</div>
                    <div className="text-gray-700">Security Monitoring</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">&lt; 1 hour</div>
                    <div className="text-gray-700">Initial Response</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-blue-600 mb-2">72 hours</div>
                    <div className="text-gray-700">Full Resolution</div>
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
              Trust Your Financial Data with Us
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Experience enterprise-grade security while managing your finances with AI-powered tools
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild className="bg-white text-blue-600 hover:bg-gray-100">
                <Link href="/signup">
                  Get Started Securely
                </Link>
              </Button>
              <Button asChild variant="outline" className="border-white text-white hover:bg-white hover:text-blue-600">
                <Link href="/contact">
                  Contact Security Team
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
