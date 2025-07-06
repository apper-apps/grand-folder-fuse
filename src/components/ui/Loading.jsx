import { motion } from 'framer-motion'

const Loading = ({ type = 'default' }) => {
  if (type === 'fileTree') {
    return (
      <div className="space-y-2 p-4">
        {[...Array(8)].map((_, i) => (
          <motion.div
            key={i}
            className="flex items-center gap-3 animate-pulse"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="w-4 h-4 bg-surface rounded"></div>
            <div className="h-4 bg-surface rounded flex-1 max-w-48"></div>
            <div className="h-3 w-12 bg-surface rounded"></div>
          </motion.div>
        ))}
      </div>
    )
  }

  if (type === 'preview') {
    return (
      <div className="p-6 space-y-4">
        <div className="flex items-center gap-3 animate-pulse">
          <div className="w-8 h-8 bg-surface rounded"></div>
          <div className="h-5 bg-surface rounded w-40"></div>
        </div>
        <div className="space-y-2">
          {[...Array(12)].map((_, i) => (
            <div 
              key={i}
              className="h-4 bg-surface rounded animate-pulse"
              style={{ width: `${Math.random() * 40 + 60}%` }}
            />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="flex items-center gap-3"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <span className="text-slate-400 font-medium">Processing files...</span>
      </motion.div>
    </div>
  )
}

export default Loading