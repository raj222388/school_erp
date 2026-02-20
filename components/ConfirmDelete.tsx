'use client'

import { AlertTriangle, X, Trash2 } from 'lucide-react'

interface ConfirmDeleteProps {
    isOpen: boolean
    onClose: () => void
    onConfirm: () => void
    title: string
    description: string
    loading?: boolean
}

export default function ConfirmDelete({
    isOpen,
    onClose,
    onConfirm,
    title,
    description,
    loading = false,
}: ConfirmDeleteProps) {
    if (!isOpen) return null

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div
                className="bg-slate-800 rounded-2xl p-6 max-w-sm w-full"
                style={{ border: '1px solid rgba(239,68,68,0.3)' }}
                onClick={e => e.stopPropagation()}
            >
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                    <div className="w-12 h-12 rounded-xl flex items-center justify-center"
                        style={{ background: 'rgba(239,68,68,0.15)' }}>
                        <AlertTriangle size={24} className="text-red-400" />
                    </div>
                    <button
                        onClick={onClose}
                        className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-slate-400 text-sm mb-6">{description}</p>

                <div className="flex gap-3">
                    <button
                        onClick={onClose}
                        disabled={loading}
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-slate-300 hover:text-white transition-colors"
                        style={{ background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.1)' }}
                    >
                        Cancel
                    </button>
                    <button
                        onClick={onConfirm}
                        disabled={loading}
                        id="confirm-delete-btn"
                        className="flex-1 py-2.5 rounded-xl text-sm font-semibold text-white flex items-center justify-center gap-2 transition-all"
                        style={{ background: 'linear-gradient(135deg, #ef4444, #dc2626)' }}
                    >
                        {loading ? (
                            <div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} />
                        ) : (
                            <>
                                <Trash2 size={14} />
                                Delete
                            </>
                        )}
                    </button>
                </div>
            </div>
        </div>
    )
}
