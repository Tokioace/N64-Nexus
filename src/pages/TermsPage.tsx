import React from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { Link } from 'react-router-dom'
import { ArrowLeft, Shield, AlertTriangle, Scale, Users, Copyright, Ban } from 'lucide-react'

const TermsPage: React.FC = () => {
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
              {t('terms.title')}
            </h1>
            <p className="text-slate-400">
              {t('terms.lastUpdated').replace('{date}', new Date().toLocaleDateString())}
            </p>
          </div>
        </div>

        {/* Content */}
        <div className="max-w-4xl mx-auto">
          <div className="simple-tile p-8 space-y-8">
            
            {/* Section 1: Acceptance of Terms */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Scale className="w-6 h-6 text-blue-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section1.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section1.content')}
              </p>
            </section>

            {/* Section 2: Age Requirement */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-amber-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section2.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section2.content')}
              </p>
              <div className="mt-4 p-4 bg-amber-600/20 border border-amber-600/30 rounded-lg">
                <p className="text-amber-200 text-sm font-medium">
                  ⚠️ Battle64 is exclusively for users 18 years and older. Age verification is mandatory.
                </p>
              </div>
            </section>

            {/* Section 3: User Responsibility */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Shield className="w-6 h-6 text-green-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section3.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section3.content')}
              </p>
              <div className="mt-4 space-y-2 text-slate-400 text-sm">
                <p>• You are responsible for maintaining the security of your account</p>
                <p>• You are responsible for all activities under your account</p>
                <p>• You must provide accurate information during registration</p>
                <p>• You must comply with all applicable laws and regulations</p>
              </div>
            </section>

            {/* Section 4: Real-World Meetings */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Users className="w-6 h-6 text-purple-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section4.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section4.content')}
              </p>
              <div className="mt-4 p-4 bg-red-600/20 border border-red-600/30 rounded-lg">
                <p className="text-red-200 text-sm font-medium">
                  🚨 IMPORTANT: Battle64 is not responsible for any real-world meetings, interactions, or events organized between users. Meet at your own risk and always prioritize your safety.
                </p>
              </div>
            </section>

            {/* Section 5: Content Liability */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Copyright className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section5.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section5.content')}
              </p>
              <div className="mt-4 space-y-2 text-slate-400 text-sm">
                <p>• You retain ownership of your original content</p>
                <p>• You grant Battle64 a license to display your content on the platform</p>
                <p>• You are liable for any copyright infringement claims</p>
                <p>• Battle64 may remove content without notice if it violates these terms</p>
              </div>
            </section>

            {/* Section 6: Prohibited Content */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Ban className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section6.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed mb-4">
                {t('terms.section6.content')}
              </p>
              <div className="grid md:grid-cols-2 gap-4 text-sm">
                <div className="p-4 bg-red-600/10 border border-red-600/20 rounded-lg">
                  <h4 className="font-semibold text-red-300 mb-2">Strictly Prohibited:</h4>
                  <ul className="space-y-1 text-red-200">
                    <li>• Violence or graphic content</li>
                    <li>• Nudity or sexual content</li>
                    <li>• Hate speech or discrimination</li>
                    <li>• Harassment or bullying</li>
                    <li>• Illegal activities</li>
                    <li>• Copyright violations</li>
                  </ul>
                </div>
                <div className="p-4 bg-amber-600/10 border border-amber-600/20 rounded-lg">
                  <h4 className="font-semibold text-amber-300 mb-2">Consequences:</h4>
                  <ul className="space-y-1 text-amber-200">
                    <li>• Content removal</li>
                    <li>• Account warnings</li>
                    <li>• Temporary suspension</li>
                    <li>• Permanent ban</li>
                    <li>• Legal action if necessary</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Section 7: Nintendo Copyright */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Copyright className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section7.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section7.content')}
              </p>
              <div className="mt-4 p-4 bg-slate-700/50 border border-slate-600 rounded-lg">
                <p className="text-slate-300 text-sm font-medium mb-2">
                  {t('terms.nintendoCopyrightNotice')}
                </p>
                <p className="text-slate-400 text-sm leading-relaxed">
                  {t('terms.nintendoFullDisclaimer')}
                </p>
              </div>
            </section>

            {/* Section 8: Account Termination */}
            <section>
              <div className="flex items-center space-x-3 mb-4">
                <Ban className="w-6 h-6 text-red-400" />
                <h2 className="text-2xl font-bold text-slate-100">
                  {t('terms.section8.title')}
                </h2>
              </div>
              <p className="text-slate-300 leading-relaxed">
                {t('terms.section8.content')}
              </p>
              <div className="mt-4 space-y-2 text-slate-400 text-sm">
                <p>• We may terminate accounts for violations of these terms</p>
                <p>• Termination may be immediate and without prior notice</p>
                <p>• Terminated users may not create new accounts</p>
                <p>• All user data will be deleted upon termination</p>
              </div>
            </section>

            {/* Additional Legal Information */}
            <section className="border-t border-slate-600 pt-8">
              <h2 className="text-2xl font-bold text-slate-100 mb-4">
                Additional Legal Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-6 text-sm">
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Liability Limitation</h4>
                  <p className="text-slate-400 leading-relaxed">
                    Battle64 provides the service "as is" without warranties. We are not liable for any damages arising from your use of the platform or interactions with other users.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Indemnification</h4>
                  <p className="text-slate-400 leading-relaxed">
                    You agree to indemnify and hold harmless Battle64 from any claims arising from your use of the service or violation of these terms.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Governing Law</h4>
                  <p className="text-slate-400 leading-relaxed">
                    These terms are governed by applicable laws. Any disputes will be resolved through appropriate legal channels.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold text-slate-200 mb-2">Changes to Terms</h4>
                  <p className="text-slate-400 leading-relaxed">
                    We may update these terms at any time. Continued use of the service constitutes acceptance of updated terms.
                  </p>
                </div>
              </div>
            </section>

            {/* Contact Information */}
            <section className="border-t border-slate-600 pt-8 text-center">
              <h3 className="text-xl font-bold text-slate-100 mb-4">
                Questions About These Terms?
              </h3>
              <p className="text-slate-400 mb-4">
                If you have any questions about these Terms of Service, please contact us.
              </p>
              <div className="flex justify-center space-x-4">
                <Link 
                  to="/auth" 
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                >
                  Back to Registration
                </Link>
                <a 
                  href="mailto:legal@battle64.com" 
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors"
                >
                  Contact Legal
                </a>
              </div>
            </section>

          </div>
        </div>
      </div>
    </div>
  )
}

export default TermsPage