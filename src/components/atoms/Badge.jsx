import { motion } from 'framer-motion'

const Badge = ({ 
  children, 
  variant = 'default', 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const baseClasses = "inline-flex items-center font-medium rounded-sm uppercase tracking-wide"
  
  const variantClasses = {
    default: "bg-slate-700 text-slate-200",
    text: "bg-success/20 text-success",
    code: "bg-info/20 text-info",
    data: "bg-secondary/20 text-secondary",
    document: "bg-accent/20 text-accent",
    binary: "bg-error/20 text-error",
    primary: "bg-primary/20 text-primary",
    success: "bg-success/20 text-success",
    warning: "bg-warning/20 text-warning",
    error: "bg-error/20 text-error"
  }
  
  const sizeClasses = {
    small: "px-2 py-1 text-xs",
    medium: "px-2.5 py-1.5 text-xs",
    large: "px-3 py-2 text-sm"
  }
  
  const classes = `${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`
  
  return (
    <motion.span
      className={classes}
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      {...props}
    >
      {children}
    </motion.span>
  )
}

export default Badge