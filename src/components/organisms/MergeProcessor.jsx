import { useState } from 'react'
import { motion } from 'framer-motion'
import { toast } from 'react-toastify'
import ApperIcon from '@/components/ApperIcon'
import Button from '@/components/atoms/Button'
import ProgressBar from '@/components/molecules/ProgressBar'
import MergeConfigPanel from '@/components/molecules/MergeConfigPanel'

const MergeProcessor = ({ 
  selectedFiles, 
  allFiles, 
  mergeConfig, 
  onConfigChange 
}) => {
  const [processing, setProcessing] = useState(false)
  const [progress, setProgress] = useState(0)

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

  const generateMockContent = (file) => {
    const extension = file.extension?.toLowerCase()
    
    switch (extension) {
      case 'js':
      case 'jsx':
        return `// ${file.name}\nfunction example() {\n  console.log('Hello from ${file.name}');\n}\n\nexport default example;`
      case 'ts':
      case 'tsx':
        return `// ${file.name}\ninterface Example {\n  name: string;\n}\n\nconst example: Example = {\n  name: '${file.name}'\n};\n\nexport default example;`
      case 'css':
        return `/* ${file.name} */\n.container {\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  background: linear-gradient(135deg, #2563eb, #7c3aed);\n}`
      case 'html':
        return `<!DOCTYPE html>\n<html>\n<head>\n  <title>${file.name}</title>\n  <meta charset="UTF-8">\n</head>\n<body>\n  <h1>Welcome to ${file.name}</h1>\n  <p>This is a sample HTML file.</p>\n</body>\n</html>`
      case 'json':
        return `{\n  "name": "${file.name}",\n  "version": "1.0.0",\n  "description": "Sample JSON file",\n  "main": "index.js",\n  "scripts": {\n    "test": "echo \\"Error: no test specified\\" && exit 1"\n  }\n}`
      case 'md':
        return `# ${file.name}\n\nThis is a markdown file demonstrating various features.\n\n## Features\n\n- **Bold text**\n- *Italic text*\n- \`Inline code\`\n\n### Code Block\n\n\`\`\`javascript\nconsole.log('Hello, world!');\n\`\`\`\n\n### List\n\n1. First item\n2. Second item\n3. Third item\n\n> This is a blockquote example.`
      case 'txt':
        return `This is the content of ${file.name}.\n\nIt contains some sample text for demonstration purposes.\nThis file shows how plain text files are processed.\n\nMultiple paragraphs are supported.\nEach line represents different content that would be merged.`
      case 'py':
        return `# ${file.name}\n\ndef main():\n    print(f"Hello from {file.name}")\n    \n    # Sample data processing\n    data = [1, 2, 3, 4, 5]\n    result = sum(data)\n    print(f"Sum: {result}")\n\nif __name__ == "__main__":\n    main()`
      case 'java':
        return `// ${file.name}\npublic class ${file.name.replace('.java', '')} {\n    public static void main(String[] args) {\n        System.out.println("Hello from ${file.name}");\n    }\n}`
      case 'xml':
        return `<?xml version="1.0" encoding="UTF-8"?>\n<root>\n  <item name="${file.name}">\n    <description>Sample XML file</description>\n    <version>1.0</version>\n  </item>\n</root>`
      case 'yaml':
      case 'yml':
        return `# ${file.name}\nname: ${file.name}\nversion: 1.0.0\ndescription: Sample YAML file\n\nconfig:\n  debug: true\n  timeout: 30\n\nservices:\n  - name: web\n    port: 8080\n  - name: db\n    port: 5432`
      case 'csv':
        return `Name,Age,City,Country\nJohn Doe,30,New York,USA\nJane Smith,25,London,UK\nBob Johnson,35,Toronto,Canada\nAlice Brown,28,Sydney,Australia`
      case 'sql':
        return `-- ${file.name}\nCREATE TABLE users (\n    id INT PRIMARY KEY,\n    name VARCHAR(100),\n    email VARCHAR(255)\n);\n\nINSERT INTO users (id, name, email) VALUES\n(1, 'John Doe', 'john@example.com'),\n(2, 'Jane Smith', 'jane@example.com');`
      default:
        return `Content of ${file.name}\n\nThis file contains sample content for preview purposes.\nThe actual content would be read from the uploaded file.\n\nFile type: ${extension || 'unknown'}\nThis demonstrates how different file types are processed.`
    }
  }

  const handleMerge = async () => {
    if (!selectedFiles || selectedFiles.length === 0) {
      toast.error('No files selected for merging')
      return
    }

    setProcessing(true)
    setProgress(0)

    try {
      const fileContents = []
      const totalFiles = selectedFiles.length
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const fileId = selectedFiles[i]
        const file = findFileById(allFiles, fileId)
        
        if (file && file.type === 'file') {
          let content = ''
          
          // Add filename header if requested
          if (mergeConfig.includeFilenames) {
            const separator = '='.repeat(file.name.length + 8)
            content += `${separator}\n=== ${file.name} ===\n${separator}\n`
          }
          
          // Add file metadata if requested
          if (mergeConfig.includeHeaders) {
            const metadata = [
              `File: ${file.name}`,
              `Path: ${file.path}`,
              `Size: ${formatFileSize(file.size)}`,
              `Type: ${file.extension || 'unknown'}`,
              `Modified: ${new Date().toISOString()}`
            ].join('\n')
            content += metadata + '\n\n'
          }
          
          // Add file content
          content += file.content || generateMockContent(file)
          
          fileContents.push(content)
        }
        
        // Update progress
        setProgress((i + 1) / totalFiles * 100)
        
        // Simulate processing time
        await new Promise(resolve => setTimeout(resolve, 100))
      }
      
      // Merge all content
      const merged = fileContents.join(mergeConfig.separator || '\n\n')
      
      // Create and download file
      const filename = `${mergeConfig.filename || 'merged-files'}.${mergeConfig.outputFormat || 'txt'}`
      const blob = new Blob([merged], { type: 'text/plain;charset=utf-8' })
      const url = URL.createObjectURL(blob)
      
      const link = document.createElement('a')
      link.href = url
      link.download = filename
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      URL.revokeObjectURL(url)
      
      toast.success(`Successfully merged ${selectedFiles.length} files into ${filename}`)
      
    } catch (error) {
      console.error('Error merging files:', error)
      toast.error('Failed to merge files. Please try again.')
    } finally {
      setProcessing(false)
      setProgress(0)
    }
  }

  const formatFileSize = (bytes) => {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  const getSelectedFileCount = () => {
    return selectedFiles ? selectedFiles.length : 0
  }

  return (
    <motion.div
      className="space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MergeConfigPanel
        config={mergeConfig}
        onConfigChange={onConfigChange}
        onMerge={handleMerge}
        disabled={processing}
        fileCount={getSelectedFileCount()}
      />

      {processing && (
        <motion.div
          className="bg-surface rounded-lg p-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <motion.div
              className="w-8 h-8 bg-primary/20 rounded-full flex items-center justify-center"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <ApperIcon name="Loader" size={16} className="text-primary" />
            </motion.div>
            <div>
              <h4 className="font-semibold text-slate-200">Processing Files</h4>
              <p className="text-sm text-slate-400">
                Merging {getSelectedFileCount()} files...
              </p>
            </div>
          </div>

          <ProgressBar 
            progress={progress}
            label="Progress"
            showPercentage={true}
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default MergeProcessor