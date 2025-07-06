import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import Badge from '@/components/atoms/Badge'
import Loading from '@/components/ui/Loading'
import Empty from '@/components/ui/Empty'

const FilePreview = ({ 
  selectedFiles, 
  allFiles, 
  mergeConfig, 
  onCopyToClipboard 
}) => {
  const [previewContent, setPreviewContent] = useState('')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    generatePreview()
  }, [selectedFiles, mergeConfig])

  const findFileById = (files, id) => {
    for (const file of files) {
      if (file.id === id) return file
      if (file.children) {
        const found = findFileById(file.children, id)
        if (found) return found
      }
    }
    return null
  }

  const generatePreview = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      setPreviewContent('')
      return
    }

    setLoading(true)
    
    try {
      const fileContents = []
      
      for (const fileId of selectedFiles) {
        const file = findFileById(allFiles, fileId)
        if (file && file.type === 'file') {
          let content = ''
          
          if (mergeConfig.includeFilenames) {
            const header = `=== ${file.name} ===`
            content += header + '\n'
          }
          
          if (mergeConfig.includeHeaders) {
            const metadata = [
              `Path: ${file.path}`,
              `Size: ${formatFileSize(file.size)}`,
              `Type: ${file.extension || 'unknown'}`
            ].join('\n')
            content += metadata + '\n\n'
          }
          
          // Simulate file content (in real app, this would read actual file content)
          content += file.content || generateMockContent(file)
          
          fileContents.push(content)
        }
      }
      
      const merged = fileContents.join(mergeConfig.separator || '\n\n')
      setPreviewContent(merged)
    } catch (error) {
      console.error('Error generating preview:', error)
      setPreviewContent('Error generating preview')
    } finally {
      setLoading(false)
    }
  }

  const generateMockContent = (file) => {
    const extension = file.extension?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return `// ${file.name}\nfunction example() {\n  console.log('Hello from ${file.name}');\n}\n\nexport default example;`
      case 'css':
        return `/* ${file.name} */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n}`
      case 'html':
        return `<!DOCTYPE html>\n<html>\n<head>\n  <title>${file.name}</title>\n</head>\n<body>\n  <h1>Welcome to ${file.name}</h1>\n</body>\n</html>`
      case 'json':
        return `{\n  "name": "${file.name}",\n  "version": "1.0.0",\n  "description": "Sample JSON file"\n}`
      case 'md':
        return `# ${file.name}\n\nThis is a markdown file.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3`
      case 'txt':
        return `This is the content of ${file.name}.\n\nIt contains some sample text for demonstration purposes.`
      case 'py':
        return `# ${file.name}\n\ndef main():\n    print("Hello from ${file.name}")\n\nif __name__ == "__main__":\n    main()`
      default:
        return `Content of ${file.name}\n\nThis file contains sample content for preview purposes.`
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getPreviewStats = () => {
    const lines = previewContent.split('\n').length
    const words = previewContent.split(/\s+/).filter(w => w.length > 0).length
    const characters = previewContent.length
    
    return { lines, words, characters }
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent)
      onCopyToClipboard?.('Content copied to clipboard!')
    } catch (error) {
      console.error('Failed to copy:', error)
      onCopyToClipboard?.('Failed to copy content', 'error')
    }
  }

  if (loading) {
    return (
      <div className="bg-surface rounded-lg p-4">
        <Loading type="preview" />
      </div>
    )
  }

  if (!selectedFiles || selectedFiles.length === 0) {
    return (
      <div className="bg-surface rounded-lg p-4">
        <Empty 
          title="No files selected"
          description="Select files from the explorer to preview the merged content"
          icon="Eye"
        />
      </div>
    )
  }

  const stats = getPreviewStats()

  return (
    <motion.div
      className="bg-surface rounded-lg p-4 space-y-4"
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-slate-600 pb-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
            <ApperIcon name="Eye" size={20} />
            Merge Preview
          </h3>
          <Button
            variant="outline"
            size="small"
            icon="Copy"
            onClick={handleCopy}
            disabled={!previewContent}
          >
            Copy
          </Button>
        </div>

        <div className="flex items-center gap-4 text-sm text-slate-400">
          <div className="flex items-center gap-1">
            <Badge variant="primary" size="small">
              {selectedFiles.length} files
            </Badge>
          </div>
          <div>{stats.lines} lines</div>
          <div>{stats.words} words</div>
          <div>{stats.characters} characters</div>
        </div>
      </div>

      <div className="max-h-96 overflow-y-auto">
        <pre className="text-sm text-slate-300 whitespace-pre-wrap font-mono bg-slate-800 p-4 rounded-lg">
          {previewContent}
        </pre>
      </div>
    </motion.div>
  )
}

export default FilePreview