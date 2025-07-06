import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import FileTreeNode from '@/components/molecules/FileTreeNode'
import SearchBar from '@/components/molecules/SearchBar'
import Button from '@/components/atoms/Button'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'

const FileExplorer = ({ 
  files, 
  selectedFiles, 
  onFileSelect, 
  onSelectAll, 
  onDeselectAll,
  loading = false 
}) => {
  const [searchTerm, setSearchTerm] = useState('')
  const [expandedFolders, setExpandedFolders] = useState(new Set())
  const [filteredFiles, setFilteredFiles] = useState([])

  useEffect(() => {
    if (!files || files.length === 0) {
      setFilteredFiles([])
      return
    }

    const filterFiles = (nodes, term) => {
      if (!term) return nodes

      return nodes.filter(node => {
        if (node.name.toLowerCase().includes(term.toLowerCase())) {
          return true
        }
        if (node.children) {
          const filteredChildren = filterFiles(node.children, term)
          return filteredChildren.length > 0
        }
        return false
      }).map(node => ({
        ...node,
        children: node.children ? filterFiles(node.children, term) : undefined
      }))
    }

    setFilteredFiles(filterFiles(files, searchTerm))
  }, [files, searchTerm])

  const handleToggleFolder = (folderId) => {
    const newExpanded = new Set(expandedFolders)
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId)
    } else {
      newExpanded.add(folderId)
    }
    setExpandedFolders(newExpanded)
  }

  const getTotalFileCount = (nodes) => {
    return nodes.reduce((count, node) => {
      if (node.type === 'file') {
        return count + 1
      }
      if (node.children) {
        return count + getTotalFileCount(node.children)
      }
      return count
    }, 0)
  }

  const getSelectedFileCount = () => {
    return selectedFiles.length
  }

  const totalFiles = files ? getTotalFileCount(files) : 0
  const selectedCount = getSelectedFileCount()

  if (loading) {
    return (
      <div className="bg-surface rounded-lg p-4">
        <Loading type="fileTree" />
      </div>
    )
  }

  if (!files || files.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-4">
        <Empty 
          title="No files loaded"
          description="Upload a folder to see its contents here"
          icon="FolderOpen"
        />
      </div>
    )
  }

  return (
    <motion.div
      className="bg-surface rounded-lg p-4 space-y-4"
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-slate-600 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <ApperIcon name="FolderOpen" size={20} />
            File Explorer
          </h3>
          <div className="text-sm text-slate-400">
            {selectedCount} of {totalFiles} files selected
          </div>
        </div>

        <SearchBar
          value={searchTerm}
          onChange={setSearchTerm}
          onClear={() => setSearchTerm('')}
          placeholder="Search files and folders..."
        />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Button
          variant="outline"
          size="small"
          icon="CheckSquare"
          onClick={onSelectAll}
          disabled={selectedCount === totalFiles}
        >
          Select All
        </Button>
        <Button
          variant="ghost"
          size="small"
          icon="Square"
          onClick={onDeselectAll}
          disabled={selectedCount === 0}
        >
          Deselect All
        </Button>
      </div>

      <div className="max-h-96 overflow-y-auto space-y-1">
        <AnimatePresence>
          {filteredFiles.map((file) => (
            <FileTreeNode
              key={file.id}
              node={file}
              level={0}
              onToggle={handleToggleFolder}
              onSelect={onFileSelect}
              isSelected={selectedFiles.includes(file.id)}
              isExpanded={expandedFolders.has(file.id)}
              showCheckboxes={true}
            />
          ))}
        </AnimatePresence>
      </div>

      {filteredFiles.length === 0 && searchTerm && (
        <Empty 
          title="No files found"
          description={`No files match "${searchTerm}"`}
          icon="Search"
        />
      )}
    </motion.div>
  )
}

export default FileExplorer