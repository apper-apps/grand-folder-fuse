import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Select = ({ 
  label, 
  options = [],
  value,
  onChange,
  placeholder = "Select an option",
  error,
  disabled = false,
  className = '',
  ...props 
}) => {
  return (
    <motion.div 
      className={`space-y-2 ${className}`}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      {label && (
        <label className="block text-sm font-medium text-slate-300 mb-2">
          {label}
        </label>
      )}
      
      <div className="relative">
        <select
          value={value}
          onChange={(e) => onChange(e.target.value)}
          disabled={disabled}
          className={`
            w-full px-4 py-3 bg-surface border border-slate-600 rounded-lg 
            text-slate-200 
            focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20
            transition-all duration-200
            appearance-none cursor-pointer
            ${error ? 'border-error focus:border-error focus:ring-error/20' : ''}
            ${disabled ? 'cursor-not-allowed opacity-50' : ''}
          `}
          {...props}
        >
          <option value="" disabled className="text-slate-400">
            {placeholder}
          </option>
          {options.map((option) => (
            <option key={option.value} value={option.value} className="bg-surface text-slate-200">
              {option.label}
            </option>
          ))}
        </select>
        
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 pointer-events-none">
          <ApperIcon name="ChevronDown" size={16} className="text-slate-400" />
        </div>
      </div>
      
      {error && (
        <motion.p
          className="text-sm text-error flex items-center gap-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="AlertCircle" size={14} />
          {error}
        </motion.p>
      )}
    </motion.div>
  )
}

export default Select