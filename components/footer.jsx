import {
  LucideBarChart4,
  LucideTwitter,
  LucideLinkedin,
  LucideFacebook,
  LucideInstagram,
  LucideYoutube,
  LucideMail,
  LucidePhone,
  LucideMapPin,
  LucideShield,
  LucideAward,
  LucideCheckCircle,
  LucideGlobe,
  LucideClock,
  LucideHeadphones,
} from "lucide-react"
import { footerData } from "@/data/footer"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 pt-16 pb-8" suppressHydrationWarning>
      <div className="container mx-auto px-4">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-8 mb-12">
          {/* Company Info & Social Media */}
          <div className="lg:col-span-2">
            <div className="flex items-center mb-4">
              <LucideBarChart4 className="h-10 w-10 text-blue-600 mr-3" />
              <div>
                <span className="text-2xl text-blue-600 font-bold">{footerData.company.name}</span>
                <p className="text-sm text-blue-500 font-medium">{footerData.company.tagline}</p>
              </div>
            </div>
            <p className="text-gray-600 mb-6 leading-relaxed">
              {footerData.company.description}
            </p>
            
            {/* Social Media Links */}
            <div className="flex space-x-4 mb-6">
              {footerData.socialMedia.map((social, index) => {
                const IconComponent = {
                  twitter: LucideTwitter,
                  linkedin: LucideLinkedin,
                  facebook: LucideFacebook,
                  instagram: LucideInstagram,
                  youtube: LucideYoutube
                }[social.icon];
                
                return (
                  <a 
                    key={index}
                    href={social.url} 
                    className={`p-2 rounded-full bg-white shadow-md hover:shadow-lg transition-all duration-300 ${social.color}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <IconComponent size={20} />
                  </a>
                );
              })}
            </div>

                              {/* Stats */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-blue-600">{footerData.stats.users}</div>
                      <div className="text-xs text-gray-500">Active Users</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-blue-600">{footerData.stats.satisfaction}</div>
                      <div className="text-xs text-gray-500">Satisfaction</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-blue-600">{footerData.stats.transactions}</div>
                      <div className="text-xs text-gray-500">Transactions</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg shadow-sm">
                      <div className="text-xl font-bold text-blue-600">{footerData.stats.savings}</div>
                      <div className="text-xs text-gray-500">Total Savings</div>
                    </div>
                  </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <LucideGlobe className="h-5 w-5 mr-2 text-blue-600" />
              Quick Links
            </h3>
            <ul className="space-y-3">
              {footerData.quickLinks.map((link, index) => (
                <li key={index}>
                  <a 
                    href={link.url} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm hover:underline"
                    title={link.description}
                  >
                    {link.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <LucideBarChart4 className="h-5 w-5 mr-2 text-blue-600" />
              Services
            </h3>
            <ul className="space-y-3">
              {footerData.services.slice(0, 5).map((service, index) => (
                <li key={index}>
                  <a 
                    href={service.url} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm hover:underline"
                    title={service.description}
                  >
                    {service.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <LucideBarChart4 className="h-5 w-5 mr-2 text-blue-600" />
              Company
            </h3>
            <ul className="space-y-3">
              {footerData.companyLinks.slice(0, 5).map((item, index) => (
                <li key={index}>
                  <a 
                    href={item.url} 
                    className="text-gray-600 hover:text-blue-600 transition-colors duration-200 text-sm hover:underline"
                    title={item.description}
                  >
                    {item.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact & Support */}
          <div>
            <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
              <LucideHeadphones className="h-5 w-5 mr-2 text-blue-600" />
              Contact & Support
            </h3>
            <ul className="space-y-3">
              <li className="flex items-center">
                <LucideMail size={16} className="mr-2 text-blue-600" />
                <a
                  href={`mailto:${footerData.contact.email}`}
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  {footerData.contact.email}
                </a>
              </li>
              <li className="flex items-center">
                <LucidePhone size={16} className="mr-2 text-blue-600" />
                <a 
                  href={`tel:${footerData.contact.phone}`} 
                  className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                >
                  {footerData.contact.phone}
                </a>
              </li>
              <li className="flex items-start">
                <LucideMapPin size={16} className="mr-2 mt-1 text-blue-600" />
                <span className="text-gray-600 text-sm">{footerData.contact.address}</span>
              </li>
                                  <li className="flex items-center">
                      <LucideClock size={16} className="mr-2 text-blue-600" />
                      <span className="text-gray-600 text-sm">{footerData.contact.businessHours}</span>
                    </li>
                    <li className="flex items-center">
                      <LucideMail size={16} className="mr-2 text-blue-600" />
                      <a
                        href={`mailto:${footerData.contact.supportEmail}`}
                        className="text-gray-600 hover:text-blue-600 transition-colors text-sm"
                      >
                        {footerData.contact.supportEmail}
                      </a>
                    </li>
            </ul>
          </div>
        </div>

        {/* Trust Indicators */}
        <div className="bg-white/60 backdrop-blur-sm rounded-xl p-6 mb-8">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {/* Certifications */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <LucideShield className="h-5 w-5 mr-2 text-green-600" />
                Security & Compliance
              </h4>
              <div className="space-y-2">
                {footerData.certifications.map((cert, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <LucideCheckCircle className="h-4 w-4 mr-2 text-green-500" />
                    {cert}
                  </div>
                ))}
              </div>
            </div>

            {/* Awards */}
            <div>
              <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                <LucideAward className="h-5 w-5 mr-2 text-yellow-600" />
                Awards & Recognition
              </h4>
              <div className="space-y-2">
                {footerData.awards.map((award, index) => (
                  <div key={index} className="flex items-center text-sm text-gray-600">
                    <LucideAward className="h-4 w-4 mr-2 text-yellow-500" />
                    {award}
                  </div>
                ))}
              </div>
            </div>

                              {/* Additional Stats */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <LucideBarChart4 className="h-5 w-5 mr-2 text-blue-600" />
                      Platform Stats
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{footerData.stats.uptime}</div>
                        <div className="text-xs text-gray-500">Uptime</div>
                      </div>
                      <div className="text-center p-2 bg-blue-50 rounded-lg">
                        <div className="text-lg font-bold text-blue-600">{footerData.stats.countries}</div>
                        <div className="text-xs text-gray-500">Countries</div>
                      </div>
                    </div>
                  </div>

                  {/* Support Info */}
                  <div>
                    <h4 className="text-lg font-semibold text-gray-800 mb-3 flex items-center">
                      <LucideHeadphones className="h-5 w-5 mr-2 text-blue-600" />
                      Support
                    </h4>
                    <div className="space-y-2">
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Response Time:</span> {footerData.support.responseTime}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Languages:</span> {footerData.support.availableLanguages.join(", ")}
                      </div>
                      <div className="text-sm text-gray-600">
                        <span className="font-medium">Live Chat:</span> Available
                      </div>
                    </div>
                  </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-300 my-8"></div>

        {/* Footer Bottom */}
        <div className="flex flex-col md:flex-row justify-between items-center">
          <div className="flex flex-col md:flex-row items-center space-y-2 md:space-y-0 md:space-x-6 mb-4 md:mb-0">
            <p className="text-gray-600 text-sm">
              © {new Date().getFullYear()} {footerData.company.name}. All rights reserved.
            </p>
            <div className="flex items-center space-x-2">
              <LucideShield className="h-4 w-4 text-green-500" />
              <span className="text-sm text-gray-500">Bank-level security</span>
            </div>
          </div>
          
          <div className="flex flex-wrap justify-center gap-4">
            {footerData.legal.map((item, index) => (
              <a 
                key={index}
                href={item.url} 
                className="text-gray-500 hover:text-blue-600 text-sm transition-colors duration-200 hover:underline"
                title={item.description}
              >
                {item.name}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  )
}
