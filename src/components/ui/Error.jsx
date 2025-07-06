import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Error = ({ message = "Something went wrong", onRetry }) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-8 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-16 h-16 bg-gradient-to-br from-error/20 to-error/10 rounded-full flex items-center justify-center mb-4"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.1, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name="AlertCircle" size={24} className="text-error" />
      </motion.div>
      
      <h3 className="text-lg font-semibold text-slate-200 mb-2">
        Processing Error
      </h3>
      
      <p className="text-slate-400 mb-6 max-w-md">
        {message}
      </p>
      
      {onRetry && (
        <motion.button
          onClick={onRetry}
          className="px-6 py-3 bg-gradient-primary text-white rounded-lg font-medium hover:brightness-110 transition-all duration-200 btn-hover-scale focus-ring"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-2">
            <ApperIcon name="RotateCcw" size={16} />
            Try Again
          </div>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Error