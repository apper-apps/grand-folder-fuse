import fileFormatsData from "@/services/mockData/fileFormats.json";
import { jsPDF } from "jspdf";
import { formatFileSize, getFileExtension, isBinaryFile } from "@/utils/fileUtils";

class FileService {
  async getFileFormats() {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...fileFormatsData];
  }

async getFileFormatByExtension(extension) {
    await new Promise(resolve => setTimeout(resolve, 100));
    return fileFormatsData.find(format => format.extension === extension.toLowerCase()) || null;
  }

  async processFiles(files) {
    await new Promise(resolve => setTimeout(resolve, 300));
    
    const processedFiles = [];
    
    for (const file of files) {
      const extension = getFileExtension(file.name);
      const format = await this.getFileFormatByExtension(extension);
      
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
      });
    }
    
    return processedFiles;
  }

  async readFileContent(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      
      reader.onload = (e) => {
        resolve(e.target.result)
      }
      
reader.onerror = (e) => {
        reject(e);
      };
      
      // Check if file is likely binary
      if (isBinaryFile(file)) {
        resolve(`[Binary file: ${file.name}]`);
      } else {
        reader.readAsText(file);
      }
    });
  }

  isBinaryFile(file) {
    const binaryExtensions = [
      'exe', 'dll', 'so', 'dylib', 'pkg',
      'png', 'jpg', 'jpeg', 'gif', 'webp', 'ico',
      'mp4', 'mp3', 'wav', 'avi', 'mov',
      'zip', 'tar', 'gz', 'rar', '7z',
      'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx'
    ]
const extension = getFileExtension(file.name);
    return binaryExtensions.includes(extension.toLowerCase());
  }

  getFileExtension(filename) {
    return filename.split('.').pop() || '';
  }

generateId() {
    return Date.now() + Math.random();
  }

  async mergeFiles(files, config) {
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const mergedContent = [];
    
for (const file of files) {
      let content = '';
      
      if (config.includeFilenames) {
        const separator = '='.repeat(file.name.length + 8);
        content += `${separator}\n=== ${file.name} ===\n${separator}\n`;
      }
      if (config.includeHeaders) {
        const metadata = [
          `File: ${file.name}`,
          `Path: ${file.path}`,
`Size: ${formatFileSize(file.size)}`,
          `Type: ${file.extension || 'unknown'}`,
          `Format: ${file.format?.category || 'unknown'}`,
          `Last Modified: ${file.lastModified || 'unknown'}`
        ].join('\n');
        content += metadata + '\n\n';
      }
      
      content += file.content || '';
      mergedContent.push(content);
    }
    
    return mergedContent.join(config.separator || '\n\n');
  }

formatFileSize(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  async createDownloadFile(content, filename, format) {
if (format === 'pdf') {
      return this.createPDFDocument(content, filename);
    }
    
    const mimeTypes = {
      txt: 'text/plain',
      md: 'text/markdown',
      html: 'text/html',
json: 'application/json',
      xml: 'application/xml',
      csv: 'text/csv'
    };
    
    const mimeType = mimeTypes[format] || 'text/plain';
    const blob = new Blob([content], { type: `${mimeType};charset=utf-8` });
    
    return {
      blob,
      filename: `${filename}.${format}`,
      url: URL.createObjectURL(blob)
    };
  }

async createPDFDocument(content, filename) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20;
    const lineHeight = 6;
    const maxWidth = pageWidth - (margin * 2);
    
    // Add title
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text(`Merged Files: ${filename}`, margin, margin);
    
// Add generation info
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleString()}`, margin, margin + 8);
    
    // Reset text color and start content
    doc.setTextColor(0, 0, 0);
    let yPosition = margin + 20;
    
    // Split content into lines and pages
    const lines = content.split('\n');
    
for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      
      // Check if we need a new page
      if (yPosition > pageHeight - margin) {
        doc.addPage();
        yPosition = margin;
      }
      
      // Handle different line types
      if (line.startsWith('===') && line.includes('===')) {
// File header
        doc.setFontSize(12);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 100, 200);
        const headerText = line.replace(/=/g, '').trim();
        doc.text(headerText, margin, yPosition);
        yPosition += lineHeight + 2;
      } else if (line.startsWith('File:') || line.startsWith('Path:') || line.startsWith('Size:') || line.startsWith('Type:')) {
        // Metadata
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(80, 80, 80);
        doc.text(line, margin + 5, yPosition);
        yPosition += lineHeight - 1;
      } else if (line.trim() === '') {
        // Empty line
        yPosition += lineHeight / 2;
} else {
        // Regular content
        doc.setFontSize(10);
        doc.setFont('courier', 'normal');
        doc.setTextColor(0, 0, 0);
        
        // Split long lines
        const wrappedLines = doc.splitTextToSize(line, maxWidth - 10);
        for (const wrappedLine of wrappedLines) {
          if (yPosition > pageHeight - margin) {
            doc.addPage();
            yPosition = margin;
          }
          doc.text(wrappedLine, margin + 5, yPosition);
          yPosition += lineHeight;
        }
      }
    }
    
// Create blob and return
    const pdfBlob = doc.output('blob');
    
    return {
      blob: pdfBlob,
      filename: `${filename}.pdf`,
      url: URL.createObjectURL(pdfBlob)
    };
  }
  
  async validateMergeConfig(config) {
const errors = [];
    
    if (!config.outputFormat) {
      errors.push('Output format is required');
    }
    
    if (!config.filename || config.filename.trim() === '') {
      errors.push('Filename is required');
    }
    
    if (!config.encoding) {
      errors.push('Encoding is required');
    }
    
    return {
      valid: errors.length === 0,
      errors
    };
  }
}

export default new FileService();