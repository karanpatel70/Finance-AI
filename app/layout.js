import { Inter } from "next/font/google"
import "./globals.css"
import Header from "@/components/header"
import { ClerkProvider } from "@clerk/nextjs"
import { Toaster } from "sonner"
import {
  LucideBarChart4,
  LucideTwitter,
  LucideLinkedin,
  LucideFacebook,
  LucideInstagram,
  LucideMail,
  LucidePhone,
  LucideMapPin,
} from "lucide-react"

const inter = Inter({ subsets: ["latin"] })

export const metadata = {
  title: "Finance AI",
  description: "One Stop Financial Intelligence Platform",
}

export default function RootLayout({ children }) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className={`${inter.className}`}>
          <Header></Header>
          <main className="min-h-screen">{children}</main>

          <Toaster richColors />

          <footer className="bg-blue-50 text-white pt-12 pb-8">
            <div className="container mx-auto px-4">
              {/* Footer top section with logo and navigation */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                {/* Logo and company description */}
                <div className="col-span-1 md:col-span-1">
                  <div className="flex items-center mb-4">
                    <LucideBarChart4 className="h-8 w-8 text-blue-400 mr-2" />
                    <span className="text-xl text-blue-400 font-bold">Finance AI</span>
                  </div>
                  <p className="text-gray-400 mb-4">
                    Empowering your financial decisions with cutting-edge AI technology.
                  </p>
                  <div className="flex space-x-4">
                    <a href="https://x.com/" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <LucideTwitter size={20} />
                    </a>
                    <a href="https://www.linkedin.com/" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <LucideLinkedin size={20} />
                    </a>
                    <a href="https://www.facebook.com/" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <LucideFacebook size={20} />
                    </a>
                    <a href="https://www.instagram.com/" className="text-gray-400 hover:text-blue-400 transition-colors">
                      <LucideInstagram size={20} />
                    </a>
                  </div>
                </div>

                {/* Quick links */}
                <div className="col-span-1">
                  <h3 className="text-lg text-gray-600 font-semibold mb-4">Services</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Financial Analysis
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Investment Strategies
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Wealth Management
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Risk Assessment
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Company links */}
                <div className="col-span-1">
                  <h3 className="text-lg text-gray-600 font-semibold mb-4">Company</h3>
                  <ul className="space-y-2">
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        About Us
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Careers
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Blog
                      </a>
                    </li>
                    <li>
                      <a href="#" className="text-gray-400 hover:text-blue-400 transition-colors">
                        Press
                      </a>
                    </li>
                  </ul>
                </div>

                {/* Contact information */}
                <div className="col-span-1">
                  <h3 className="text-lg text-gray-600 font-semibold mb-4">Contact</h3>
                  <ul className="space-y-2">
                    <li className="flex items-center">
                      <LucideMail size={16} className="mr-2 text-gray-400" />
                      <a
                        href="mailto:karanpatel6898@gmail.com"
                        className="text-gray-400 hover:text-blue-400 transition-colors"
                      >
                        karanpatel6898@gmail.com
                      </a>
                    </li>
                    <li className="flex items-center">
                      <LucidePhone size={16} className="mr-2 text-gray-400" />
                      <a href="tel:+91 6351023729" className="text-gray-400 hover:text-blue-400 transition-colors">
                        +91 6351023729
                      </a>
                    </li>
                    <li className="flex items-start">
                      <LucideMapPin size={16} className="mr-2 mt-1 text-gray-400" />
                      <span className="text-gray-400">123 Finance Street, Changa , Gujarat</span>
                    </li>
                  </ul>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-gray-800 my-8"></div>

              {/* Footer bottom with copyright and legal links */}
              <div className="flex flex-col md:flex-row justify-between items-center">
                <p className="text-gray-500 text-sm mb-4 md:mb-0">
                  © {new Date().getFullYear()} Finance AI. All rights reserved.
                </p>
                <div className="flex space-x-6">
                  <a href="#" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                    Privacy Policy
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                    Terms of Service
                  </a>
                  <a href="#" className="text-gray-500 hover:text-blue-400 text-sm transition-colors">
                    Cookie Policy
                  </a>
                </div>
              </div>
            </div>
          </footer>
        </body>
      </html>
    </ClerkProvider>
  )
}

