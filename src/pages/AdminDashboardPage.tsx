import React from 'react'
import DailyReportDashboard from '../components/DailyReportDashboard'
import { useLanguage } from '../contexts/LanguageContext'

const AdminDashboardPage: React.FC = () => {
  const { t } = useLanguage()

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 sm:p-6">
      <h1 className="text-2xl sm:text-3xl font-bold mb-4">{t('admin.title')}</h1>
      <p className="text-slate-300 mb-6">{t('admin.subtitle')}</p>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <section className="simple-tile p-4 lg:col-span-2">
          <h2 className="text-xl font-semibold mb-3">{t('admin.moderationOverview')}</h2>
          <DailyReportDashboard />
        </section>
        <section className="simple-tile p-4">
          <h2 className="text-xl font-semibold mb-3">{t('admin.tasks')}</h2>
          <ul className="space-y-2 text-slate-300">
            <li>{t('admin.tasks.autoDone')}</li>
            <li>{t('admin.tasks.pending')}</li>
            <li>{t('admin.tasks.problematic')}</li>
            <li>{t('admin.tasks.bugsFixed')}</li>
          </ul>
        </section>
      </div>
    </div>
  )
}

export default AdminDashboardPage