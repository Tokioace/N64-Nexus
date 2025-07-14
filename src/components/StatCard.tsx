import { LucideIcon } from 'lucide-react'

interface StatCardProps {
  title: string
  value: string
  icon: LucideIcon
  color: string
  change?: string
}

const StatCard: React.FC<StatCardProps> = ({ title, value, icon: Icon, color, change }) => {
  const colorClasses = {
    'retro-green': 'text-retro-green',
    'retro-blue': 'text-retro-blue',
    'retro-yellow': 'text-retro-yellow',
    'retro-purple': 'text-retro-purple',
    'retro-red': 'text-retro-red',
    'retro-orange': 'text-retro-orange',
    'retro-cyan': 'text-retro-cyan',
  }

  return (
    <div className="stat-card group hover:scale-105 transition-all duration-300">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-retro text-retro-gray mb-1">{title}</p>
          <p className="text-2xl font-arcade text-white">{value}</p>
          {change && (
            <p className="text-xs text-retro-green mt-1 font-retro">
              {change}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg bg-${color}/10 ${colorClasses[color as keyof typeof colorClasses]}`}>
          <Icon className="w-6 h-6" />
        </div>
      </div>
    </div>
  )
}

export default StatCard