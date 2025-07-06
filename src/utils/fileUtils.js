export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export const getFileExtension = (filename) => {
  return filename.split('.').pop()?.toLowerCase() || ''
}

export const getFileIcon = (filename) => {
  const extension = getFileExtension(filename)
  
  const iconMap = {
    // Code files
    js: 'FileText',
    jsx: 'FileText',
    ts: 'FileText',
    tsx: 'FileText',
    html: 'Globe',
    css: 'Palette',
    scss: 'Palette',
    sass: 'Palette',
    py: 'FileText',
    java: 'FileText',
    cpp: 'FileText',
    c: 'FileText',
    h: 'FileText',
    php: 'FileText',
    rb: 'FileText',
    go: 'FileText',
    rs: 'FileText',
    swift: 'FileText',
    kt: 'FileText',
    cs: 'FileText',
    
    // Data files
    json: 'FileText',
    xml: 'FileText',
    yaml: 'FileText',
    yml: 'FileText',
    csv: 'FileText',
    tsv: 'FileText',
    sql: 'FileText',
    toml: 'FileText',
    ini: 'FileText',
    conf: 'FileText',
    properties: 'FileText',
    
    // Text files
    txt: 'FileText',
    md: 'FileText',
    rtf: 'FileText',
    log: 'FileText',
    
    // Script files
    sh: 'FileText',
    bat: 'FileText',
    ps1: 'FileText',
    
    // Images
    png: 'Image',
    jpg: 'Image',
    jpeg: 'Image',
    gif: 'Image',
    svg: 'Image',
    webp: 'Image',
    ico: 'Image',
    
    // Media
    mp4: 'Video',
    mp3: 'Music',
    wav: 'Music',
    avi: 'Video',
    mov: 'Video',
    
    // Archives
    zip: 'Archive',
    tar: 'Archive',
    gz: 'Archive',
    rar: 'Archive',
    '7z': 'Archive',
    
    // Documents
    pdf: 'FileText',
    doc: 'FileText',
    docx: 'FileText',
    xls: 'FileText',
    xlsx: 'FileText',
    ppt: 'FileText',
    pptx: 'FileText'
  }
  
  return iconMap[extension] || 'File'
}

export const getFileCategoryBadge = (filename) => {
  const extension = getFileExtension(filename)
  
  const categories = {
    text: ['txt', 'md', 'rtf', 'log', 'readme', 'license', 'changelog'],
    code: ['js', 'jsx', 'ts', 'tsx', 'html', 'css', 'scss', 'sass', 'py', 'java', 'cpp', 'c', 'h', 'php', 'rb', 'go', 'rs', 'swift', 'kt', 'cs', 'sh', 'bat', 'ps1', 'dockerfile', 'makefile', 'svg'],
    data: ['json', 'xml', 'yaml', 'yml', 'csv', 'tsv', 'sql', 'toml', 'ini', 'conf', 'properties', 'env'],
    document: ['pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'],
    binary: ['png', 'jpg', 'jpeg', 'gif', 'webp', 'ico', 'mp4', 'mp3', 'wav', 'avi', 'mov', 'zip', 'tar', 'gz', 'rar', '7z', 'exe', 'dll', 'so', 'dylib', 'pkg']
  }
  
  for (const [category, extensions] of Object.entries(categories)) {
    if (extensions.includes(extension)) {
      return category
    }
  }
  
  return 'default'
}

export const isBinaryFile = (filename) => {
  const binaryExtensions = [
    'exe', 'dll', 'so', 'dylib', 'pkg',
    'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
    'mp4', 'mp3', 'wav', 'avi', 'mov',
    'zip', 'tar', 'gz', 'rar', '7z',
    'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
  ]
  
  const extension = getFileExtension(filename)
  return binaryExtensions.includes(extension)
}

export const isTextFile = (filename) => {
  return !isBinaryFile(filename)
}

export const createFileTree = (files) => {
  const tree = []
  const pathMap = new Map()
  
  files.forEach(file => {
    const pathParts = file.path.split('/')
    let currentPath = ''
    let currentLevel = tree
    
    // Create folder structure
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
          children: []
        }
        currentLevel.push(folder)
        pathMap.set(currentPath, folder)
      }
      
      currentLevel = folder.children
    }
    
    // Add file to current level
    currentLevel.push(file)
  })
  
  return tree
}

export const flattenFileTree = (tree) => {
  const files = []
  
  const traverse = (nodes) => {
    nodes.forEach(node => {
      if (node.type === 'file') {
        files.push(node)
      } else if (node.children) {
        traverse(node.children)
      }
    })
  }
  
  traverse(tree)
  return files
}

export const searchFiles = (files, searchTerm) => {
  if (!searchTerm) return files
  
  const term = searchTerm.toLowerCase()
  
  return files.filter(file => {
    return file.name.toLowerCase().includes(term) ||
           file.path.toLowerCase().includes(term) ||
           (file.extension && file.extension.toLowerCase().includes(term))
  })
}

export const sortFiles = (files, sortBy = 'name', sortOrder = 'asc') => {
  const sorted = [...files].sort((a, b) => {
    let aValue = a[sortBy]
    let bValue = b[sortBy]
    
    if (sortBy === 'size') {
      aValue = a.size || 0
      bValue = b.size || 0
    } else if (sortBy === 'name') {
      aValue = a.name.toLowerCase()
      bValue = b.name.toLowerCase()
    }
    
    if (sortOrder === 'asc') {
      return aValue > bValue ? 1 : -1
    } else {
      return aValue < bValue ? 1 : -1
    }
  })
  
  return sorted
}

export const validateFileName = (filename) => {
  const invalidChars = /[<>:"/\\|?*]/
  return !invalidChars.test(filename)
}

export const sanitizeFileName = (filename) => {
  return filename.replace(/[<>:"/\\|?*]/g, '_')
}

export const generateUniqueId = () => {
  return Date.now() + Math.random().toString(36).substr(2, 9)
}

export const downloadFile = (content, filename, mimeType = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType })
  const url = URL.createObjectURL(blob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  
  URL.revokeObjectURL(url)
}

export const copyToClipboard = async (text) => {
  try {
    await navigator.clipboard.writeText(text)
    return true
  } catch (error) {
    console.error('Failed to copy to clipboard:', error)
    return false
  }
}

export const readFileAsText = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target.result)
    reader.onerror = (e) => reject(e)
    reader.readAsText(file)
  })
}

export const getFileStats = (content) => {
  const lines = content.split('\n').length
  const words = content.split(/\s+/).filter(w => w.length > 0).length
  const characters = content.length
  const charactersNoSpaces = content.replace(/\s/g, '').length
  
  return {
    lines,
    words,
    characters,
    charactersNoSpaces
  }
}