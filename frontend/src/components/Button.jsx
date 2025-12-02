export default function Button({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className = '', 
  ...props 
}) {
  const baseClasses = 'font-semibold rounded-lg transition-all duration-200 active:scale-95'
  
  const variants = {
    primary: 'bg-blue-500 hover:bg-blue-600 text-white',
    secondary: 'bg-dark-700 hover:bg-dark-600 text-white border border-white/10',
    ghost: 'bg-transparent hover:bg-white/5 text-blue-400 border border-blue-400/30',
    danger: 'bg-red-500/10 hover:bg-red-500/20 text-red-400 border border-red-400/30',
  }
  
  const sizes = {
    sm: 'px-3 py-1.5 text-sm',
    md: 'px-4 py-2.5',
    lg: 'px-6 py-3 text-lg',
  }
  
  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${sizes[size]} ${className}`}
      {...props}
    >
      {children}
    </button>
  )
}
