export default function Input({ 
  label, 
  icon: Icon, 
  error, 
  className = '', 
  ...props 
}) {
  return (
    <div className="w-full">
      {label && <label className="block text-sm font-medium text-dark-300 mb-2">{label}</label>}
      <div className="relative">
        {Icon && <Icon className="absolute left-3 top-3 w-5 h-5 text-dark-400 pointer-events-none" />}
        <input
          className={`input-field ${Icon ? 'pl-10' : 'pl-4'} ${error ? 'border-red-500/50 focus:border-red-500/50 focus:ring-red-500/30' : ''} ${className}`}
          {...props}
        />
      </div>
      {error && <p className="mt-1 text-xs text-red-400">{error}</p>}
    </div>
  )
}
