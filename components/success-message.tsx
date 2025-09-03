"use client"

import { useEffect, useState } from "react"
import { CheckCircle, X } from "lucide-react"
import { Button } from "@/components/ui/button"

interface SuccessMessageProps {
  message: string
  onClose?: () => void
}

export function SuccessMessage({ message, onClose }: SuccessMessageProps) {
  const [isVisible, setIsVisible] = useState(true)

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsVisible(false)
      onClose?.()
    }, 5000)

    return () => clearTimeout(timer)
  }, [onClose])

  if (!isVisible) return null

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-top-2 duration-300">
      <div className="bg-green-600 text-white px-4 py-3 rounded-lg shadow-lg flex items-center gap-3 min-w-80">
        <CheckCircle className="w-5 h-5 text-green-100" />
        <span className="flex-1">{message}</span>
        <Button
          variant="ghost"
          size="sm"
          className="text-green-100 hover:text-white hover:bg-green-700"
          onClick={() => {
            setIsVisible(false)
            onClose?.()
          }}
        >
          <X className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
