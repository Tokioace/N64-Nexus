import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, Database, Globe, Eye, Trash2, Download, Cookie } from 'lucide-react'

const PrivacyPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-purple-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link 
            to="/auth" 
            className="inline-flex items-center text-blue-400 hover:text-blue-300 transition-colors mb-4"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Registration
          </Link>
          
          <div className="text-center">
            <h1 className="text-4xl font-bold text-slate-100 mb-2">
              {t('privacy.title')}
            </h1>
            <p className="text-slate-400">
              {t('privacy.lastUpdated').replace('{date}', new Date().toLocaleDateString())}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="simple-tile p-8 space-y-8">
            
            {/* GDPR Compliance Notice */}
            <div className="bg-blue-600/20 border border-blue-600/30 rounded-lg p-6">
              <div className="flex items-center space-x-3 mb-3">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-xl font-bold text-blue-200">GDPR Compliance</h2>
              </div>
              <p className="text-blue-100 text-sm leading-relaxed">
                Battle64 is fully compliant with the General Data Protection Regulation (GDPR) and respects your privacy rights. 
                You have the right to access, modify, and delete your personal data at any time.
              </p>
            </div>

            {/* Section 1: Data We Collect */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Database className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section1.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section1.content')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                  <h4 className="font-semibold text-slate-200 mb-3">Personal Information</h4>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Email address (for account access)</li>
                    <li>• Username (public display name)</li>
                    <li>• Birth date (age verification only)</li>
                    <li>• Region and platform preferences</li>
                    <li>• Profile information (bio, location)</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                  <h4 className="font-semibold text-slate-200 mb-3">Usage Data</h4>
                  <ul className="space-y-1 text-slate-400 text-sm">
                    <li>• Speedrun times and records</li>
                    <li>• Event participation</li>
                    <li>• Forum posts and comments</li>
                    <li>• Media uploads (screenshots, videos)</li>
                    <li>• Collection and wishlist data</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 2: Data Storage */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section2.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section2.content')}
              </p>
              
              <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                <h4 className="font-semibold text-slate-200 mb-3">Technical Details</h4>
                <div className="grid md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-300 font-medium mb-1">Database Provider:</p>
                    <p className="text-slate-400">Supabase (PostgreSQL)</p>
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium mb-1">Server Locations:</p>
                    <p className="text-slate-400">USA and European Union</p>
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium mb-1">Encryption:</p>
                    <p className="text-slate-400">TLS 1.3 in transit, AES-256 at rest</p>
                  </div>
                  <div>
                    <p className="text-slate-300 font-medium mb-1">Backups:</p>
                    <p className="text-slate-400">Daily encrypted backups</p>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 3: Data Sharing */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Eye className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section3.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section3.content')}
              </p>
              
              <div className="p-4 bg-green-600/20 border border-green-600/30 rounded-lg">
                <p className="text-green-200 text-sm font-medium">
                  ✅ We do NOT sell, rent, or share your personal data with third parties for marketing purposes.
                </p>
              </div>
              
              <div className="mt-4 space-y-2 text-slate-400 text-sm">
                <p><strong>Data may be shared only in these cases:</strong></p>
                <p>• Legal compliance (court orders, law enforcement)</p>
                <p>• Protection of rights and safety</p>
                <p>• Business transfers (with user notification)</p>
                <p>• Service providers (hosting, analytics) under strict agreements</p>
              </div>
            </section>

            {/* Section 4: Cookies */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Cookie className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section4.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section4.content')}
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <h4 className="font-semibold text-green-300 mb-2">Necessary Cookies</h4>
                  <p className="text-green-200 text-sm mb-2">Always active - Required for basic functionality</p>
                  <ul className="space-y-1 text-green-100 text-xs">
                    <li>• Authentication tokens</li>
                    <li>• Session management</li>
                    <li>• Security features</li>
                    <li>• Language preferences</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <h4 className="font-semibold text-blue-300 mb-2">Optional Cookies</h4>
                  <p className="text-blue-200 text-sm mb-2">Require your consent</p>
                  <ul className="space-y-1 text-blue-100 text-xs">
                    <li>• Analytics and usage statistics</li>
                    <li>• Performance monitoring</li>
                    <li>• User experience improvements</li>
                    <li>• Feature usage tracking</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 5: Your Rights (GDPR) */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section5.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section5.content')}
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 text-sm">
                <div className="p-4 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <h4 className="font-semibold text-blue-300 mb-2">Access Rights</h4>
                  <ul className="space-y-1 text-blue-200">
                    <li>• View all your data</li>
                    <li>• Export your data</li>
                    <li>• Data usage reports</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-green-600/10 border border-green-600/20 rounded-lg">
                  <h4 className="font-semibold text-green-300 mb-2">Control Rights</h4>
                  <ul className="space-y-1 text-green-200">
                    <li>• Modify your data</li>
                    <li>• Restrict processing</li>
                    <li>• Data portability</li>
                  </ul>
                </div>
                
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <h4 className="font-semibold text-red-300 mb-2">Deletion Rights</h4>
                  <ul className="space-y-1 text-red-200">
                    <li>• Delete your account</li>
                    <li>• Remove specific data</li>
                    <li>• Right to be forgotten</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 6: Data Retention */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Trash2 className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section6.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section6.content')}
              </p>
              
              <div className="p-4 bg-slate-700/30 border border-slate-600 rounded-lg">
                <h4 className="font-semibold text-slate-200 mb-3">Retention Periods</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-300">Active accounts:</span>
                    <span className="text-slate-400">Indefinitely (while active)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Inactive accounts:</span>
                    <span className="text-slate-400">3 years without login</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Deleted accounts:</span>
                    <span className="text-slate-400">30 days (recovery period)</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-300">Legal holds:</span>
                    <span className="text-slate-400">As required by law</span>
                  </div>
                </div>
              </div>
            </section>

            {/* Section 7: Contact */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Globe className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('privacy.section7.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('privacy.section7.content')}
              </p>
            </section>

            {/* Data Subject Rights Actions */}
            <section className="border-t border-slate-600 pt-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                Exercise Your Rights
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6">
                <div className="p-6 bg-blue-600/10 border border-blue-600/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Download className="w-5 h-5 text-blue-400" />
                    <h4 className="font-semibold text-blue-300">Export Your Data</h4>
                  </div>
                  <p className="text-blue-200 text-sm mb-4">
                    Download all your personal data in a portable JSON format.
                  </p>
                  <button className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-sm">
                    Request Data Export
                  </button>
                </div>
                
                <div className="p-6 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <div className="flex items-center space-x-3 mb-3">
                    <Trash2 className="w-5 h-5 text-red-400" />
                    <h4 className="font-semibold text-red-300">Delete Your Account</h4>
                  </div>
                  <p className="text-red-200 text-sm mb-4">
                    Permanently delete your account and all associated data.
                  </p>
                  <Link 
                    to="/profile/delete"
                    className="block w-full py-2 px-4 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm text-center"
                  >
                    Delete Account
                  </Link>
                </div>
              </div>
            </section>

            {/* Age Verification Notice */}
            <section className="border-t border-slate-600 pt-8">
              <div className="bg-amber-600/20 border border-amber-600/30 rounded-lg p-6">
                <h3 className="text-xl font-bold text-amber-200 mb-3">
                  Age Verification & Privacy
                </h3>
                <div className="space-y-2 text-amber-100 text-sm">
                  <p>• Birth dates are used solely for age verification (18+ requirement)</p>
                  <p>• Birth dates are not displayed publicly or shared with other users</p>
                  <p>• You can request deletion of your birth date after account verification</p>
                  <p>• Battle64 is designed exclusively for adult users (18+)</p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t border-slate-600 pt-8 text-center">
              <h3 className="text-xl font-bold text-slate-100 mb-4">
                Privacy Questions or Concerns?
              </h3>
              <p className="text-slate-400 mb-6">
                We're committed to protecting your privacy and are here to help with any questions.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  to="/auth" 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Back to Registration
                </Link>
                <a 
                  href="mailto:privacy@battle64.com" 
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  Contact Privacy Team
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPage