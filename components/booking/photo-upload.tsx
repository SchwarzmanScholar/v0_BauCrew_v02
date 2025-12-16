"use client"

import type React from "react"

import { useState, useCallback, useRef } from "react"
import { Upload, X } from "lucide-react"
import { cn } from "@/lib/utils"

interface PhotoUploadProps {
  value: File[]
  onChange: (files: File[]) => void
  maxFiles?: number
}

export function PhotoUpload({ value, onChange, maxFiles = 5 }: PhotoUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      setIsDragging(false)
      const droppedFiles = Array.from(e.dataTransfer.files).filter((file) => file.type.startsWith("image/"))
      const newFiles = [...value, ...droppedFiles].slice(0, maxFiles)
      onChange(newFiles)
    },
    [value, onChange, maxFiles],
  )

  const handleFileSelect = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files) {
        const selectedFiles = Array.from(e.target.files).filter((file) => file.type.startsWith("image/"))
        const newFiles = [...value, ...selectedFiles].slice(0, maxFiles)
        onChange(newFiles)
      }
    },
    [value, onChange, maxFiles],
  )

  const removeFile = useCallback(
    (index: number) => {
      const newFiles = value.filter((_, i) => i !== index)
      onChange(newFiles)
    },
    [value, onChange],
  )

  return (
    <div className="space-y-3">
      <div
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={cn(
          "border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
        )}
      >
        <input ref={inputRef} type="file" accept="image/*" multiple onChange={handleFileSelect} className="hidden" />
        <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
        <p className="text-sm font-medium text-foreground mb-1">Fotos hochladen</p>
        <p className="text-xs text-muted-foreground">Drag & Drop oder klicken zum Auswählen (max. {maxFiles} Fotos)</p>
      </div>

      {value.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {value.map((file, index) => (
            <div key={index} className="relative w-20 h-20 rounded-lg overflow-hidden border bg-muted group">
              <img
                src={URL.createObjectURL(file) || "/placeholder.svg"}
                alt={`Upload ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation()
                  removeFile(index)
                }}
                className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-destructive hover:text-destructive-foreground transition-colors"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
