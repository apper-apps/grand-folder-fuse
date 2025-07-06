import { motion } from 'framer-motion'
import Select from '@/components/atoms/Select'
import Input from '@/components/atoms/Input'
import Checkbox from '@/components/atoms/Checkbox'
import Button from '@/components/atoms/Button'

const MergeConfigPanel = ({ 
  config, 
  onConfigChange, 
  onMerge, 
  disabled = false,
  fileCount = 0 
}) => {
  const separatorOptions = [
    { value: '\n\n', label: 'Double Line Break' },
    { value: '\n', label: 'Single Line Break' },
    { value: '\n---\n', label: 'Horizontal Rule' },
    { value: '\n/* === */\n', label: 'Comment Block' },
    { value: '\n================\n', label: 'Equals Separator' },
    { value: 'custom', label: 'Custom Separator' }
  ]

  const outputFormatOptions = [
    { value: 'txt', label: 'Plain Text (.txt)' },
    { value: 'md', label: 'Markdown (.md)' },
    { value: 'html', label: 'HTML (.html)' },
    { value: 'json', label: 'JSON (.json)' },
    { value: 'xml', label: 'XML (.xml)' }
  ]

  const encodingOptions = [
    { value: 'utf-8', label: 'UTF-8' },
    { value: 'ascii', label: 'ASCII' },
    { value: 'latin1', label: 'Latin-1' }
  ]

  const handleConfigChange = (key, value) => {
    onConfigChange({
      ...config,
      [key]: value
    })
  }

  return (
    <motion.div
      className="bg-surface rounded-lg p-6 space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <div className="border-b border-slate-600 pb-4">
        <h3 className="text-lg font-semibold text-slate-200 flex items-center gap-2">
          <span>Merge Configuration</span>
          {fileCount > 0 && (
            <span className="text-sm text-slate-400">({fileCount} files)</span>
          )}
        </h3>
        <p className="text-sm text-slate-400 mt-1">
          Configure how files should be merged together
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="File Separator"
          value={config.separator === '\n\n' ? '\n\n' : config.separator === '\n' ? '\n' : config.separator === '\n---\n' ? '\n---\n' : config.separator === '\n/* === */\n' ? '\n/* === */\n' : config.separator === '\n================\n' ? '\n================\n' : 'custom'}
          onChange={(value) => {
            if (value === 'custom') {
              handleConfigChange('separator', '')
            } else {
              handleConfigChange('separator', value)
            }
          }}
          options={separatorOptions}
          disabled={disabled}
        />

        <Select
          label="Output Format"
          value={config.outputFormat}
          onChange={(value) => handleConfigChange('outputFormat', value)}
          options={outputFormatOptions}
          disabled={disabled}
        />
      </div>

      {(config.separator === '' || !separatorOptions.find(opt => opt.value === config.separator)) && (
        <Input
          label="Custom Separator"
          value={config.separator}
          onChange={(e) => handleConfigChange('separator', e.target.value)}
          placeholder="Enter custom separator..."
          disabled={disabled}
        />
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Select
          label="Text Encoding"
          value={config.encoding}
          onChange={(value) => handleConfigChange('encoding', value)}
          options={encodingOptions}
          disabled={disabled}
        />

        <Input
          label="Output Filename"
          value={config.filename || 'merged-files'}
          onChange={(e) => handleConfigChange('filename', e.target.value)}
          placeholder="merged-files"
          disabled={disabled}
        />
      </div>

      <div className="space-y-3">
        <Checkbox
          checked={config.includeFilenames}
          onChange={(e) => handleConfigChange('includeFilenames', e.target.checked)}
          label="Include original filenames as headers"
          disabled={disabled}
        />

        <Checkbox
          checked={config.includeHeaders}
          onChange={(e) => handleConfigChange('includeHeaders', e.target.checked)}
          label="Include file metadata (size, type, etc.)"
          disabled={disabled}
        />

        <Checkbox
          checked={config.preserveStructure}
          onChange={(e) => handleConfigChange('preserveStructure', e.target.checked)}
          label="Preserve folder structure in output"
          disabled={disabled}
        />
      </div>

      <div className="pt-4 border-t border-slate-600">
        <Button
          variant="primary"
          size="large"
          icon="Download"
          onClick={onMerge}
          disabled={disabled || fileCount === 0}
          className="w-full"
        >
          Merge & Download Files
        </Button>
      </div>
    </motion.div>
  )
}

export default MergeConfigPanel