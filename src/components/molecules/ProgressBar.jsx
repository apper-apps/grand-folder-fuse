import { motion } from 'framer-motion'

const ProgressBar = ({ 
  progress = 0, 
  label = "", 
  size = "medium",
  showPercentage = true,
  className = "" 
}) => {
  const sizeClasses = {
    small: "h-2",
    medium: "h-3",
    large: "h-4"
  }

  return (
    <motion.div
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {(label || showPercentage) && (
        <div className="flex items-center justify-between">
          {label && (
            <span className="text-sm font-medium text-slate-300">
              {label}
            </span>
          )}
          {showPercentage && (
            <span className="text-sm text-slate-400">
              {Math.round(progress)}%
            </span>
          )}
        </div>
      )}
      
      <div className={`bg-slate-700 rounded-full overflow-hidden ${sizeClasses[size]}`}>
        <motion.div
          className="h-full bg-gradient-to-r from-primary to-secondary rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.5, ease: "easeOut" }}
        />
      </div>
    </motion.div>
  )
}

export default ProgressBar