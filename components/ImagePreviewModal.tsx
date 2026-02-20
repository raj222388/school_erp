'use client'

import { useEffect } from 'react'
import { X } from 'lucide-react'

interface ImagePreviewModalProps {
    src: string
    alt: string
    onClose: () => void
}

export default function ImagePreviewModal({ src, alt, onClose }: ImagePreviewModalProps) {
    // Close on Escape key
    useEffect(() => {
        const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler)
    }, [onClose])

    // Prevent body scroll while open
    useEffect(() => {
        document.body.style.overflow = 'hidden'
        return () => { document.body.style.overflow = '' }
    }, [])

    return (
        <div
            className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
            style={{ background: 'rgba(0,0,0,0.85)', backdropFilter: 'blur(6px)' }}
            onClick={onClose}
        >
            {/* Modal panel — 50% of screen on mobile, auto on desktop */}
            <div
                className="relative w-full sm:w-auto flex flex-col items-center"
                style={{
                    maxHeight: '50vh',
                    animation: 'previewSlideUp 0.25s cubic-bezier(0.34,1.56,0.64,1)',
                }}
                onClick={e => e.stopPropagation()}
            >
                {/* Close button */}
                <button
                    onClick={onClose}
                    aria-label="Close preview"
                    className="absolute -top-10 right-2 sm:-top-10 sm:-right-10 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all hover:scale-110"
                    style={{ background: 'rgba(255,255,255,0.15)', border: '1px solid rgba(255,255,255,0.3)' }}
                >
                    <X size={18} className="text-white" />
                </button>

                {/* Image */}
                <img
                    src={src}
                    alt={alt}
                    className="max-h-[50vh] w-auto object-contain rounded-xl shadow-2xl"
                    style={{ border: '2px solid rgba(255,255,255,0.15)' }}
                />

                {/* Caption */}
                {alt && (
                    <p className="mt-3 text-white/70 text-xs text-center px-4 pb-4">{alt}</p>
                )}
            </div>

            {/* Keyframe injection */}
            <style>{`
        @keyframes previewSlideUp {
          from { opacity: 0; transform: translateY(30px) scale(0.95); }
          to   { opacity: 1; transform: translateY(0)   scale(1);    }
        }
      `}</style>
        </div>
    )
}
