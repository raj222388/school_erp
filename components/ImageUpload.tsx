'use client'

import { useCallback, useState } from 'react'
import { Upload, X, Image as ImageIcon } from 'lucide-react'

interface ImageUploadProps {
    label: string
    value: File | null
    onChange: (file: File | null) => void
    previewUrl?: string | null
    id?: string
    compact?: boolean
}

export default function ImageUpload({
    label,
    value,
    onChange,
    previewUrl,
    id,
    compact = false,
}: ImageUploadProps) {
    const [dragActive, setDragActive] = useState(false)
    const [preview, setPreview] = useState<string | null>(previewUrl || null)

    const handleFile = (file: File) => {
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }
        onChange(file)
        const reader = new FileReader()
        reader.onload = (e) => setPreview(e.target?.result as string)
        reader.readAsDataURL(file)
    }

    const handleDrop = useCallback((e: React.DragEvent) => {
        e.preventDefault()
        setDragActive(false)
        const file = e.dataTransfer.files[0]
        if (file) handleFile(file)
    }, [])

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const clear = () => {
        onChange(null)
        setPreview(null)
    }

    if (compact) {
        return (
            <div>
                <label className="label">{label}</label>
                <div className="flex items-center gap-3">
                    {preview ? (
                        <div className="relative">
                            <img src={preview} alt="preview" className="w-16 h-16 rounded-xl object-cover border-2"
                                style={{ borderColor: 'rgba(99,102,241,0.4)' }} />
                            <button onClick={clear}
                                className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-red-500 flex items-center justify-center">
                                <X size={10} className="text-white" />
                            </button>
                        </div>
                    ) : (
                        <label htmlFor={id} className="w-16 h-16 rounded-xl flex flex-col items-center justify-center cursor-pointer"
                            style={{ background: 'rgba(99,102,241,0.1)', border: '2px dashed rgba(99,102,241,0.4)' }}>
                            <ImageIcon size={18} className="text-indigo-400" />
                            <input id={id} type="file" accept="image/*" onChange={handleChange} className="hidden" />
                        </label>
                    )}
                    <div className="text-slate-500 text-xs">
                        <p>JPG, PNG, GIF</p>
                        <p>Max 5MB</p>
                    </div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <label className="label">{label}</label>
            {preview ? (
                <div className="relative inline-block">
                    <img src={preview} alt="preview"
                        className="w-32 h-32 rounded-xl object-cover"
                        style={{ border: '2px solid rgba(99,102,241,0.4)' }} />
                    <button
                        onClick={clear}
                        className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors"
                    >
                        <X size={12} className="text-white" />
                    </button>
                </div>
            ) : (
                <label
                    htmlFor={id}
                    onDragOver={(e) => { e.preventDefault(); setDragActive(true) }}
                    onDragLeave={() => setDragActive(false)}
                    onDrop={handleDrop}
                    className={`upload-zone cursor-pointer block ${dragActive ? 'drag-active' : ''}`}
                >
                    <Upload size={28} className="mx-auto mb-2 text-indigo-400" />
                    <p className="text-slate-300 text-sm font-medium">
                        Drop your image here or <span className="text-indigo-400">browse</span>
                    </p>
                    <p className="text-slate-500 text-xs mt-1">JPG, PNG, GIF - Max 5MB</p>
                    <input
                        id={id}
                        type="file"
                        accept="image/*"
                        onChange={handleChange}
                        className="hidden"
                    />
                </label>
            )}
        </div>
    )
}
