import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Checkbox = ({ 
  checked = false,
  onChange,
  label,
  disabled = false,
  indeterminate = false,
  className = '',
  ...props 
}) => {
  return (
    <motion.label
      className={`flex items-center gap-3 cursor-pointer ${disabled ? 'cursor-not-allowed opacity-50' : ''} ${className}`}
      whileHover={disabled ? {} : { scale: 1.02 }}
      {...props}
    >
      <div className="relative">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          disabled={disabled}
          className="sr-only"
        />
        
        <motion.div
          className={`
            w-5 h-5 rounded border-2 flex items-center justify-center
            transition-all duration-200
            ${checked 
              ? 'bg-primary border-primary shadow-glow' 
              : 'bg-surface border-slate-500 hover:border-slate-400'
            }
          `}
          whileHover={disabled ? {} : { scale: 1.1 }}
          whileTap={disabled ? {} : { scale: 0.95 }}
        >
          {checked && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0 }}
              transition={{ duration: 0.1 }}
            >
              <ApperIcon 
                name={indeterminate ? "Minus" : "Check"} 
                size={12} 
                className="text-white" 
              />
            </motion.div>
          )}
        </motion.div>
      </div>
      
      {label && (
        <span className="text-slate-200 text-sm font-medium select-none">
          {label}
        </span>
      )}
    </motion.label>
  )
}

export default Checkbox