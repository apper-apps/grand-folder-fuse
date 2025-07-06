import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'

const Empty = ({ 
  title = "No files selected", 
  description = "Upload a folder to get started", 
  icon = "FolderOpen",
  action,
  actionLabel = "Upload Folder"
}) => {
  return (
    <motion.div
      className="flex flex-col items-center justify-center p-12 text-center"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <motion.div
        className="w-20 h-20 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full flex items-center justify-center mb-6"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
      >
        <ApperIcon name={icon} size={32} className="text-primary" />
      </motion.div>
      
      <h3 className="text-xl font-semibold text-gradient mb-3">
        {title}
      </h3>
      
      <p className="text-slate-400 mb-8 max-w-md leading-relaxed">
        {description}
      </p>
      
      {action && (
        <motion.button
          onClick={action}
          className="px-8 py-4 bg-gradient-primary text-white rounded-lg font-medium hover:brightness-110 transition-all duration-200 btn-hover-scale focus-ring shadow-premium"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <div className="flex items-center gap-3">
            <ApperIcon name="Upload" size={18} />
            {actionLabel}
          </div>
        </motion.button>
      )}
    </motion.div>
  )
}

export default Empty