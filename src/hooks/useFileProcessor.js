import { useState, useCallback } from 'react'
import fileService from '@/services/api/fileService'

export const useFileProcessor = () => {
  const [files, setFiles] = useState([])
  const [processing, setProcessing] = useState(false)
  const [error, setError] = useState(null)

  const processFiles = useCallback(async (fileList) => {
    setProcessing(true)
    setError(null)
    
    try {
      const processedFiles = await fileService.processFiles(Array.from(fileList))
      setFiles(processedFiles)
      return processedFiles
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setProcessing(false)
    }
  }, [])

  const mergeFiles = useCallback(async (selectedFiles, config) => {
    setProcessing(true)
    setError(null)
    
    try {
      const validation = await fileService.validateMergeConfig(config)
      if (!validation.valid) {
        throw new Error(validation.errors.join(', '))
      }
      
      const mergedContent = await fileService.mergeFiles(selectedFiles, config)
      const downloadFile = await fileService.createDownloadFile(
        mergedContent,
        config.filename,
        config.outputFormat
      )
      
      return downloadFile
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setProcessing(false)
    }
  }, [])

  const reset = useCallback(() => {
    setFiles([])
    setError(null)
  }, [])

  return {
    files,
    processing,
    error,
    processFiles,
    mergeFiles,
    reset
  }
}