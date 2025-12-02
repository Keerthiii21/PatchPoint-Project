import Card from './Card'

export default function StatsCard({ icon: Icon, title, value, change, trend = 'up' }) {
  return (
    <Card className="flex items-start justify-between">
      <div className="flex-1">
        <p className="text-dark-400 text-sm font-medium">{title}</p>
        <h3 className="text-3xl font-bold mt-2">{value}</h3>
        {change && (
          <p className={`text-xs mt-2 ${trend === 'up' ? 'text-green-400' : 'text-red-400'}`}>
            {trend === 'up' ? '↑' : '↓'} {change} from last week
          </p>
        )}
      </div>
      <div className="p-3 bg-blue-500/20 rounded-lg">
        <Icon className="w-6 h-6 text-blue-400" />
      </div>
    </Card>
  )
}
