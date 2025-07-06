import fileFormatsData from '@/services/mockData/fileFormats.json'

class FileService {
  async getFileFormats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200))
    return [...fileFormatsData]
  }

  async getFileFormatByExtension(extension) {
    await new Promise(resolve => setTimeout(resolve, 100))
    return fileFormatsData.find(format => format.extension === extension.toLowerCase()) || null
  }

  async processFiles(files) {
    await new Promise(resolve => setTimeout(resolve, 300))
    
    const processedFiles = []
    
    for (const file of files) {
      const extension = this.getFileExtension(file.name)
      const format = await this.getFileFormatByExtension(extension)
      
      processedFiles.push({
        id: this.generateId(),
        name: file.name,
        path: file.webkitRelativePath || file.name,
        type: 'file',
        extension: extension,
        size: file.size,
        format: format,
        content: await this.readFileContent(file),
        lastModified: new Date(file.lastModified).toISOString()
      })
    }
    
    return processedFiles
  }

  async readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      
      reader.onerror = (e) => {
        reject(e)
      }
      
      // Check if file is likely binary
      if (this.isBinaryFile(file)) {
        resolve(`[Binary file: ${file.name}]`)
      } else {
        reader.readAsText(file)
      }
    })
  }

  isBinaryFile(file) {
    const binaryExtensions = [
      'exe', 'dll', 'so', 'dylib', 'pkg',
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
      'mp4', 'mp3', 'wav', 'avi', 'mov',
      'zip', 'tar', 'gz', 'rar', '7z',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
    ]
    
    const extension = this.getFileExtension(file.name)
    return binaryExtensions.includes(extension.toLowerCase())
  }

  getFileExtension(filename) {
    return filename.split('.').pop() || ''
  }

  generateId() {
    return Date.now() + Math.random()
  }

  async mergeFiles(files, config) {
    await new Promise(resolve => setTimeout(resolve, 500))
    
    const mergedContent = []
    
    for (const file of files) {
      let content = ''
      
      if (config.includeFilenames) {
        const separator = '='.repeat(file.name.length + 8)
        content += `${separator}\n=== ${file.name} ===\n${separator}\n`
      }
      
      if (config.includeHeaders) {
        const metadata = [
          `File: ${file.name}`,
          `Path: ${file.path}`,
          `Size: ${this.formatFileSize(file.size)}`,
          `Type: ${file.extension || 'unknown'}`,
          `Format: ${file.format?.category || 'unknown'}`,
          `Last Modified: ${file.lastModified || 'unknown'}`
        ].join('\n')
        content += metadata + '\n\n'
      }
      
      content += file.content || ''
      mergedContent.push(content)
    }
    
    return mergedContent.join(config.separator || '\n\n')
  }

  formatFileSize(bytes) {
    if (bytes === 0) return '0 B'
    const k = 1024
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  async createDownloadFile(content, filename, format) {
    const mimeTypes = {
      txt: 'text/plain',
      md: 'text/markdown',
      html: 'text/html',
      json: 'application/json',
      xml: 'application/xml',
      csv: 'text/csv'
    }
    
    const mimeType = mimeTypes[format] || 'text/plain'
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` })
    
    return {
      blob,
      filename: `${filename}.${format}`,
      url: URL.createObjectURL(blob)
    }
  }

  async validateMergeConfig(config) {
    const errors = []
    
    if (!config.outputFormat) {
      errors.push('Output format is required')
    }
    
    if (!config.filename || config.filename.trim() === '') {
      errors.push('Filename is required')
    }
    
    if (!config.encoding) {
      errors.push('Encoding is required')
    }
    
    return {
      valid: errors.length === 0,
      errors
    }
  }
}

export default new FileService()