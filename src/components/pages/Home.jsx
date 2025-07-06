import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import Header from '@/components/organisms/Header'
import FileUpload from '@/components/molecules/FileUpload'
import FileExplorer from '@/components/organisms/FileExplorer'
import FilePreview from '@/components/organisms/FilePreview'
import MergeProcessor from '@/components/organisms/MergeProcessor'
import Empty from '@/components/ui/Empty'

const Home = () => {
  const [files, setFiles] = useState([])
  const [selectedFiles, setSelectedFiles] = useState([])
  const [loading, setLoading] = useState(false)
  const [mergeConfig, setMergeConfig] = useState({
    separator: '\n\n',
    includeFilenames: true,
    includeHeaders: false,
    preserveStructure: false,
    outputFormat: 'txt',
    encoding: 'utf-8',
    filename: 'merged-files'
  })

  const generateFileTree = (fileList) => {
    const tree = []
    const pathMap = new Map()
    
    // Convert FileList to array and create file objects
    const fileArray = Array.from(fileList).map((file, index) => {
      const path = file.webkitRelativePath || file.name
      const parts = path.split('/')
      const name = parts[parts.length - 1]
      const extension = name.includes('.') ? name.split('.').pop() : ''
      
      return {
        id: index + 1,
        name: name,
        path: path,
        type: 'file',
        extension: extension,
        size: file.size,
        content: null, // Will be populated with mock content
        selected: false,
        file: file // Keep reference to original file
      }
    })
    
    // Create folder structure
    fileArray.forEach(file => {
      const pathParts = file.path.split('/')
      let currentPath = ''
      let currentLevel = tree
      
      for (let i = 0; i < pathParts.length - 1; i++) {
        const folderName = pathParts[i]
        currentPath += (currentPath ? '/' : '') + folderName
        
        let folder = currentLevel.find(item => item.name === folderName && item.type === 'folder')
        
        if (!folder) {
          folder = {
            id: `folder_${currentPath}`,
            name: folderName,
            path: currentPath,
            type: 'folder',
            children: [],
            selected: false
          }
          currentLevel.push(folder)
        }
        
        currentLevel = folder.children
      }
      
      currentLevel.push(file)
    })
    
    return tree
  }

  const handleFilesSelected = async (fileList) => {
    setLoading(true)
    
    try {
      const tree = generateFileTree(fileList)
      setFiles(tree)
      setSelectedFiles([])
      toast.success(`Loaded ${fileList.length} files successfully`)
    } catch (error) {
      console.error('Error processing files:', error)
      toast.error('Failed to process files. Please try again.')
    } finally {
      setLoading(false)
    }
  }

const getNodeAndChildrenIds = (node) => {
    const ids = [node.id]
    if (node.children) {
      node.children.forEach(child => {
        ids.push(...getNodeAndChildrenIds(child))
      })
    }
    return ids
  }

  const findNodeById = (nodes, targetId) => {
    for (const node of nodes) {
      if (node.id === targetId) return node
      if (node.children) {
        const found = findNodeById(node.children, targetId)
        if (found) return found
      }
    }
    return null
  }

  const handleFileSelect = (itemId) => {
    const node = findNodeById(files, itemId)
    if (!node) return

    setSelectedFiles(prev => {
      if (node.type === 'folder') {
        const childIds = getNodeAndChildrenIds(node)
        const allSelected = childIds.every(id => prev.includes(id))
        
        if (allSelected) {
          // Deselect folder and all children
          return prev.filter(id => !childIds.includes(id))
        } else {
          // Select folder and all children
          const newIds = [...prev]
          childIds.forEach(id => {
            if (!newIds.includes(id)) {
              newIds.push(id)
            }
          })
          return newIds
        }
      } else {
        // Handle file selection
        if (prev.includes(itemId)) {
          return prev.filter(id => id !== itemId)
        } else {
          return [...prev, itemId]
        }
      }
    })
  }

  const getAllFileAndFolderIds = (nodes) => {
    const ids = []
    nodes.forEach(node => {
      ids.push(node.id)
      if (node.children) {
        ids.push(...getAllFileAndFolderIds(node.children))
      }
    })
    return ids
  }

  const handleSelectAll = (allIds = null) => {
    const idsToSelect = allIds || getAllFileAndFolderIds(files)
    setSelectedFiles(idsToSelect)
  }

  const handleDeselectAll = () => {
    setSelectedFiles([])
  }

  const handleReset = () => {
    setFiles([])
    setSelectedFiles([])
    setMergeConfig({
      separator: '\n\n',
      includeFilenames: true,
      includeHeaders: false,
      preserveStructure: false,
      outputFormat: 'txt',
      encoding: 'utf-8',
      filename: 'merged-files'
    })
    toast.info('Application reset successfully')
  }

  const handleCopyToClipboard = (message, type = 'success') => {
    toast[type](message)
  }

  return (
    <div className="min-h-screen bg-background">
      <Header onReset={handleReset} hasFiles={files.length > 0} />
      
      <main className="container mx-auto px-4 py-8">
        {files.length === 0 ? (
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gradient mb-4">
                Advanced File Merger
              </h2>
              <p className="text-lg text-slate-400 max-w-xl mx-auto">
                Upload a folder and merge all its files into a single document. 
                Supports 50+ file formats with intelligent content handling.
              </p>
            </div>
            
<FileUpload
              onFilesSelected={handleFilesSelected}
              accept="folder"
              multiple={true}
              disabled={loading}
            />
            
            <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6">
              <motion.div
                className="bg-surface rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="w-12 h-12 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-primary font-bold text-lg">50+</span>
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">File Formats</h3>
                <p className="text-sm text-slate-400">
                  Supports text, code, data, and document files
                </p>
              </motion.div>
              
              <motion.div
                className="bg-surface rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <div className="w-12 h-12 bg-secondary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-secondary font-bold text-lg">⚡</span>
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">Smart Merging</h3>
                <p className="text-sm text-slate-400">
                  Intelligent content handling and formatting
                </p>
              </motion.div>
              
              <motion.div
                className="bg-surface rounded-lg p-6 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
              >
                <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-accent font-bold text-lg">🎯</span>
                </div>
                <h3 className="font-semibold text-slate-200 mb-2">Customizable</h3>
                <p className="text-sm text-slate-400">
                  Configure separators, headers, and output format
                </p>
              </motion.div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <div className="lg:col-span-1">
              <FileExplorer
                files={files}
                selectedFiles={selectedFiles}
                onFileSelect={handleFileSelect}
                onSelectAll={handleSelectAll}
                onDeselectAll={handleDeselectAll}
                loading={loading}
              />
            </div>
            
            <div className="lg:col-span-1">
              <FilePreview
                selectedFiles={selectedFiles}
                allFiles={files}
                mergeConfig={mergeConfig}
                onCopyToClipboard={handleCopyToClipboard}
              />
            </div>
            
            <div className="lg:col-span-2 xl:col-span-1">
              <MergeProcessor
                selectedFiles={selectedFiles}
                allFiles={files}
                mergeConfig={mergeConfig}
                onConfigChange={setMergeConfig}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  )
}

export default Home