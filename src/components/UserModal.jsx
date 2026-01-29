import React from 'react'
import { X } from 'lucide-react'

export function Modal({ isOpen, onClose, title, children, className }) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black opacity-30"
        onClick={onClose}
      />

      {/* Modal */}
      <div
        className={`relative w-full rounded-lg bg-white p-6 shadow-lg ${
          className || 'max-w-md'
        }`}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h3 className="text-lg font-semibold">{title}</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  )
}
