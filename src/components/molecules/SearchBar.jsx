import { motion } from 'framer-motion'
import Input from '@/components/atoms/Input'
import Button from '@/components/atoms/Button'

const SearchBar = ({ 
  value, 
  onChange, 
  placeholder = "Search files...",
  onClear,
  disabled = false 
}) => {
  return (
    <motion.div 
      className="relative"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        icon="Search"
        disabled={disabled}
        className="pr-12"
      />
      
      {value && (
        <motion.div
          className="absolute right-3 top-1/2 transform -translate-y-1/2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
        >
          <Button
            variant="ghost"
            size="small"
            icon="X"
            onClick={onClear}
            className="p-1 hover:bg-slate-700 rounded-full"
          />
        </motion.div>
      )}
    </motion.div>
  )
}

export default SearchBar