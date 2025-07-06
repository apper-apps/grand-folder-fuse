import { useRef, useState } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'

const FileUpload = ({ onFilesSelected, accept = "", multiple = false, disabled = false }) => {
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef(null)

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFiles(e.dataTransfer.files)
    }
  }

  const handleChange = (e) => {
    e.preventDefault()
    if (e.target.files && e.target.files[0]) {
      handleFiles(e.target.files)
    }
  }

  const handleFiles = (files) => {
    const fileList = Array.from(files)
    onFilesSelected(fileList)
  }

  const onButtonClick = () => {
    inputRef.current?.click()
  }

  return (
    <motion.div
      className={`
        relative border-2 border-dashed rounded-lg p-8 text-center
        transition-all duration-300 cursor-pointer
        ${dragActive 
          ? 'border-primary bg-primary/5 drag-active' 
          : 'border-slate-600 hover:border-slate-500 hover:bg-slate-800/50'
        }
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={disabled ? undefined : onButtonClick}
      whileHover={disabled ? {} : { scale: 1.01 }}
      whileTap={disabled ? {} : { scale: 0.99 }}
    >
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleChange}
        disabled={disabled}
        webkitdirectory={accept === "folder"}
        directory={accept === "folder"}
      />

      <motion.div
        className="flex flex-col items-center gap-4"
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <motion.div
          className={`
            w-16 h-16 rounded-full flex items-center justify-center
            ${dragActive 
              ? 'bg-primary/20 text-primary' 
              : 'bg-slate-700 text-slate-400'
            }
          `}
          animate={{ scale: dragActive ? 1.1 : 1 }}
          transition={{ duration: 0.2 }}
        >
          <ApperIcon name="FolderOpen" size={24} />
        </motion.div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold text-slate-200">
            {dragActive ? "Drop folder here" : "Upload Folder"}
          </h3>
          <p className="text-slate-400">
            Drag and drop a folder here, or click to select
          </p>
        </div>

        <Button
          variant="primary"
          size="medium"
          icon="Upload"
          disabled={disabled}
          onClick={(e) => {
            e.stopPropagation()
            onButtonClick()
          }}
        >
          Select Folder
        </Button>
      </motion.div>
    </motion.div>
  )
}

export default FileUpload