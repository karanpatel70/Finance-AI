"use client"

import { motion } from "framer-motion"
import { 
  LucideMail, 
  LucidePhone, 
  LucideMapPin, 
  LucideClock,
  LucideMessageSquare,
  LucideSend
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"

const contactData = {
  title: "Get in Touch",
  subtitle: "We'd love to hear from you. Send us a message and we'll respond as soon as possible.",
  
  contactInfo: [
    {
      icon: LucideMail,
      title: "Email",
      value: "karanpatel6898@gmail.com",
      link: "mailto:karanpatel6898@gmail.com"
    },
    {
      icon: LucidePhone,
      title: "Phone",
      value: "+91 6351023729",
      link: "tel:+91 6351023729"
    },
    {
      icon: LucideMapPin,
      title: "Address",
      value: "123 Finance Street, Changa, Gujarat, India",
      link: null
    },
    {
      icon: LucideClock,
      title: "Business Hours",
      value: "Monday - Friday: 9:00 AM - 6:00 PM IST",
      link: null
    }
  ],

  support: {
    title: "Support & Help",
    email: "support@financeai.com",
    responseTime: "< 2 hours",
    availableLanguages: ["English", "Hindi", "Gujarati"]
  }
}

export default function ContactPage() {
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
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              {contactData.title}
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              {contactData.subtitle}
            </p>
          </motion.div>
        </div>
      </section>

      {/* Contact Form & Info */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Contact Form */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="shadow-lg">
                <CardContent className="p-8">
                  <h2 className="text-3xl font-bold text-gray-800 mb-6">Send us a Message</h2>
                  
                  <form className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          First Name
                        </label>
                        <Input placeholder="Enter your first name" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Last Name
                        </label>
                        <Input placeholder="Enter your last name" />
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email
                      </label>
                      <Input type="email" placeholder="Enter your email address" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Subject
                      </label>
                      <Input placeholder="What is this about?" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Message
                      </label>
                      <Textarea 
                        placeholder="Tell us more about your inquiry..."
                        rows={5}
                      />
                    </div>
                    
                    <Button className="w-full bg-blue-600 hover:bg-blue-700">
                      <LucideSend className="mr-2 h-5 w-5" />
                      Send Message
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
              className="space-y-6"
            >
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  Get in touch with us through any of these channels. We're here to help and answer any questions you might have.
                </p>
              </div>

              {/* Contact Details */}
              <div className="space-y-6">
                {contactData.contactInfo.map((info, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: index * 0.1 }}
                    viewport={{ once: true }}
                  >
                    <Card className="hover:shadow-md transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="flex-shrink-0">
                            <info.icon className="h-8 w-8 text-blue-600" />
                          </div>
                          <div>
                            <h3 className="text-lg font-semibold text-gray-800 mb-2">{info.title}</h3>
                            {info.link ? (
                              <a 
                                href={info.link}
                                className="text-blue-600 hover:text-blue-700 transition-colors"
                              >
                                {info.value}
                              </a>
                            ) : (
                              <p className="text-gray-600">{info.value}</p>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              {/* Support Information */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4 }}
                viewport={{ once: true }}
              >
                <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="flex-shrink-0">
                        <LucideMessageSquare className="h-8 w-8 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-800 mb-2">
                          {contactData.support.title}
                        </h3>
                        <div className="space-y-2 text-sm text-gray-600">
                          <p>
                            <span className="font-medium">Support Email:</span>{" "}
                            <a 
                              href={`mailto:${contactData.support.email}`}
                              className="text-blue-600 hover:text-blue-700"
                            >
                              {contactData.support.email}
                            </a>
                          </p>
                          <p>
                            <span className="font-medium">Response Time:</span> {contactData.support.responseTime}
                          </p>
                          <p>
                            <span className="font-medium">Languages:</span> {contactData.support.availableLanguages.join(", ")}
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-800 mb-6">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about Finance AI
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {[
              {
                question: "How secure is my financial data?",
                answer: "We use bank-level security with end-to-end encryption, multi-factor authentication, and comply with international security standards including ISO 27001 and SOC 2."
              },
              {
                question: "What makes Finance AI different from other apps?",
                answer: "Our AI-powered features like intelligent receipt scanning, personalized financial insights, and predictive analytics set us apart from traditional financial apps."
              },
              {
                question: "Is Finance AI available internationally?",
                answer: "Yes! We currently serve users in 25+ countries and are continuously expanding our global presence."
              },
              {
                question: "How accurate is the AI receipt scanning?",
                answer: "Our AI achieves 98%+ accuracy in extracting information from receipts, and it continuously learns to improve over time."
              },
              {
                question: "Can I export my financial data?",
                answer: "Absolutely! You can export your data in multiple formats including CSV, PDF, and Excel for your records or to share with financial advisors."
              },
              {
                question: "What kind of support do you offer?",
                answer: "We provide 24/7 customer support through multiple channels including email, live chat, and comprehensive help documentation."
              }
            ].map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardContent className="p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-3">{faq.question}</h3>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
