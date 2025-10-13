'use client'

import { ReactNode } from 'react'
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  IconButton
} from '@mui/material'
import { Close } from '@mui/icons-material'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
}

export default function Modal({ isOpen, onClose, title, children }: ModalProps) {
  return (
    <Dialog 
      open={isOpen} 
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          backgroundColor: 'background.paper',
          maxHeight: '80vh',
        }
      }}
    >
      {title && (
        <DialogTitle sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          pb: 1
        }}>
          {title}
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{ ml: 1 }}
          >
            <Close />
          </IconButton>
        </DialogTitle>
      )}
      <DialogContent sx={{ pt: title ? 1 : 2 }}>
        {children}
      </DialogContent>
    </Dialog>
  )
}
