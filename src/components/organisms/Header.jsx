import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const Header = ({ onReset, hasFiles = false }) => {
  return (
    <motion.header
      className="bg-surface border-b border-slate-600 px-6 py-4"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <motion.div
            className="w-10 h-10 bg-gradient-primary rounded-lg flex items-center justify-center"
            whileHover={{ scale: 1.05 }}
          >
            <ApperIcon name="FolderOpen" size={24} className="text-white" />
          </motion.div>
          
          <div>
            <h1 className="text-xl font-bold text-gradient">
              FolderFuse
            </h1>
            <p className="text-sm text-slate-400">
              Advanced File Merger & Converter
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="small"
            icon="Info"
            onClick={() => window.open('https://github.com', '_blank')}
          >
            About
          </Button>
          
          {hasFiles && (
            <Button
              variant="outline"
              size="small"
              icon="RotateCcw"
              onClick={onReset}
            >
              Reset
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  )
}

export default Header