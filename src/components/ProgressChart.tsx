import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'

const ProgressChart: React.FC = () => {
  // Mock data for progress over time
  const data = [
    { date: 'Jan 1', time: 120, improvement: 0 },
    { date: 'Jan 8', time: 118, improvement: -2 },
    { date: 'Jan 15', time: 115, improvement: -3 },
    { date: 'Jan 22', time: 113, improvement: -2 },
    { date: 'Jan 29', time: 110, improvement: -3 },
    { date: 'Feb 5', time: 108, improvement: -2 },
  ]

  const formatTime = (value: number) => {
    const minutes = Math.floor(value / 60)
    const seconds = value % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-retro-dark border border-retro-purple rounded-lg p-3 shadow-lg">
          <p className="text-white font-retro">{`Datum: ${label}`}</p>
          <p className="text-retro-blue font-retro">
            {`Zeit: ${formatTime(payload[0].value)}`}
          </p>
          <p className="text-retro-green font-retro">
            {`Verbesserung: ${payload[0].payload.improvement}s`}
          </p>
        </div>
      )
    }
    return null
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
        <XAxis 
          dataKey="date" 
          stroke="#9CA3AF"
          fontSize={12}
          fontFamily="Courier New"
        />
        <YAxis 
          stroke="#9CA3AF"
          fontSize={12}
          fontFamily="Courier New"
          tickFormatter={formatTime}
        />
        <Tooltip content={<CustomTooltip />} />
        <Line 
          type="monotone" 
          dataKey="time" 
          stroke="#8B5CF6" 
          strokeWidth={3}
          dot={{ fill: '#8B5CF6', strokeWidth: 2, r: 4 }}
          activeDot={{ r: 6, stroke: '#EC4899', strokeWidth: 2 }}
        />
      </LineChart>
    </ResponsiveContainer>
  )
}

export default ProgressChart