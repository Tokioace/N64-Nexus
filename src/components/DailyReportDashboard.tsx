import React, { useEffect, useState } from 'react'
import { useLanguage } from '../contexts/LanguageContext'
import { dailyReportService, DailyReportSummary } from '../services/dailyReportService'

const DailyReportDashboard: React.FC = () => {
  const { t } = useLanguage()
  const [report, setReport] = useState<DailyReportSummary | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let mounted = true
    dailyReportService.getTodayReport().then(r => {
      if (!mounted) return
      setReport(r)
      setLoading(false)
    })
    return () => { mounted = false }
  }, [])

  if (loading) {
    return <div className="text-slate-300">{t('common.loading')}</div>
  }

  if (!report) {
    return <div className="text-slate-300">{t('admin.noReport')}</div>
  }

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm">{t('admin.totalViolations')}</div>
          <div className="text-2xl font-bold">{report.totalViolations}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm">{t('admin.usersWarned')}</div>
          <div className="text-2xl font-bold">{report.usersWarned}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm">{t('admin.usersBanned')}</div>
          <div className="text-2xl font-bold">{report.usersBanned}</div>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <div className="text-slate-400 text-sm">{t('admin.newBugs')}</div>
          <div className="text-2xl font-bold">{report.newBugs}</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-slate-900/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">{t('admin.illegalContent')}</h3>
          <ul className="text-slate-300 text-sm space-y-1">
            {report.illegalContent.slice(0, 5).map((item, idx) => (
              <li key={idx}>{item}</li>
            ))}
            {report.illegalContent.length === 0 && (
              <li>{t('admin.none')}</li>
            )}
          </ul>
        </div>
        <div className="bg-slate-900/50 rounded-lg p-4">
          <h3 className="font-semibold mb-2">{t('admin.appHealth')}</h3>
          <ul className="text-slate-300 text-sm space-y-1">
            <li>{t('admin.health.errors')}: {report.appHealth.errors}</li>
            <li>{t('admin.health.cache')}: {report.appHealth.cacheItems}</li>
            <li>{t('admin.health.sessions')}: {report.appHealth.sessions}</li>
            <li>{t('admin.health.uptime')}: {report.appHealth.uptime}%</li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default DailyReportDashboard