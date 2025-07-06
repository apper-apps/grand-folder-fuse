import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Checkbox from '@/components/atoms/Checkbox'
import Badge from '@/components/atoms/Badge'

const FileTreeNode = ({ 
  node, 
  level = 0, 
  onToggle, 
  onSelect,
  isSelected,
  isExpanded,
  showCheckboxes = true 
}) => {
  const getFileIcon = (node) => {
    if (node.type === 'folder') {
      return isExpanded ? 'FolderOpen' : 'Folder'
    }
    
    const ext = node.extension?.toLowerCase()
    const iconMap = {
      js: 'FileText',
      jsx: 'FileText',
      ts: 'FileText',
      tsx: 'FileText',
      html: 'Globe',
      css: 'Palette',
      json: 'FileText',
      md: 'FileText',
      txt: 'FileText',
      py: 'FileText',
      java: 'FileText',
      cpp: 'FileText',
      c: 'FileText',
      php: 'FileText',
      rb: 'FileText',
      go: 'FileText',
      rs: 'FileText',
      xml: 'FileText',
      yaml: 'FileText',
      yml: 'FileText',
      pdf: 'FileText',
      doc: 'FileText',
      docx: 'FileText',
      xlsx: 'FileText',
      csv: 'FileText',
      png: 'Image',
      jpg: 'Image',
      jpeg: 'Image',
      gif: 'Image',
      svg: 'Image',
      mp4: 'Video',
      mp3: 'Music',
      zip: 'Archive',
      tar: 'Archive',
      gz: 'Archive'
    }
    
    return iconMap[ext] || 'File'
  }

  const getFileBadgeVariant = (node) => {
    if (node.type === 'folder') return 'default'
    
    const ext = node.extension?.toLowerCase()
    const categories = {
      text: ['txt', 'md', 'rtf'],
      code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'py', 'java', 'cpp', 'c', 'php', 'rb', 'go', 'rs'],
      data: ['json', 'xml', 'yaml', 'yml', 'csv', 'sql'],
      document: ['pdf', 'doc', 'docx', 'xlsx', 'ppt', 'pptx'],
      binary: ['png', 'jpg', 'jpeg', 'gif', 'svg', 'mp4', 'mp3', 'zip', 'tar', 'gz', 'exe', 'dll']
    }
    
    for (const [category, extensions] of Object.entries(categories)) {
      if (extensions.includes(ext)) return category
    }
    
    return 'default'
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  return (
    <motion.div
      className="select-none"
      initial={{ opacity: 0, x: -10 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div
        className={`
          flex items-center gap-2 py-2 px-2 rounded cursor-pointer
          hover:bg-slate-800/50 transition-colors duration-150
          ${isSelected ? 'bg-primary/20' : ''}
        `}
        style={{ paddingLeft: `${level * 20 + 8}px` }}
onClick={() => {
          if (node.type === 'folder') {
            onToggle(node.id)
          }
        }}
      >
        {showCheckboxes && (
          <Checkbox
            checked={isSelected}
            onChange={(e) => {
              e.stopPropagation()
              onSelect(node.id)
            }}
            className="min-w-fit"
          />
        )}
        
        <motion.div
          className={`
            w-6 h-6 flex items-center justify-center rounded
            ${node.type === 'folder' ? 'text-accent' : 'text-slate-400'}
          `}
          whileHover={{ scale: 1.1 }}
        >
          <ApperIcon name={getFileIcon(node)} size={16} />
        </motion.div>
        
        <span className="text-sm text-slate-200 flex-1 truncate">
          {node.name}
        </span>
        
        <div className="flex items-center gap-2">
          {node.type === 'file' && node.extension && (
            <Badge variant={getFileBadgeVariant(node)} size="small">
              {node.extension}
            </Badge>
          )}
          
          {node.type === 'file' && node.size && (
            <span className="text-xs text-slate-500">
              {formatFileSize(node.size)}
            </span>
          )}
        </div>
      </div>
      
      {node.type === 'folder' && isExpanded && node.children && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
        >
          {node.children.map((child) => (
<FileTreeNode
              key={child.id}
              node={child}
              level={level + 1}
              onToggle={onToggle}
              onSelect={onSelect}
              isSelected={Array.isArray(isSelected) ? isSelected.includes(child.id) : isSelected}
              isExpanded={isExpanded}
              showCheckboxes={showCheckboxes}
            />
          ))}
        </motion.div>
      )}
    </motion.div>
  )
}

export default FileTreeNode