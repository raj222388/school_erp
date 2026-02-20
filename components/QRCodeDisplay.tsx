'use client'

import { useEffect, useRef, useState } from 'react'
import QRCode from 'qrcode'
import { Download, QrCode } from 'lucide-react'

interface QRCodeDisplayProps {
    value: string
    size?: number
    label?: string
    showDownload?: boolean
    id?: string
}

export default function QRCodeDisplay({
    value,
    size = 200,
    label,
    showDownload = true,
    id,
}: QRCodeDisplayProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [dataUrl, setDataUrl] = useState<string>('')

    // Resolve the full URL inside useEffect so window.location.origin is always
    // the REAL domain the browser is on (localhost in dev, Vercel URL in prod).
    // No env vars needed — can never encode localhost after deployment.
    useEffect(() => {
        const origin = window.location.origin   // e.g. https://school-erp-xxx.vercel.app
        const fullUrl = `${origin}${value}`     // e.g. .../student/uuid

        if (canvasRef.current) {
            QRCode.toCanvas(canvasRef.current, fullUrl, {
                width: size,
                margin: 2,
                color: {
                    dark: '#1e1b4b',
                    light: '#ffffff',
                },
            })
            QRCode.toDataURL(fullUrl, {
                width: size,
                margin: 2,
                color: {
                    dark: '#1e1b4b',
                    light: '#ffffff',
                },
            }).then(setDataUrl)
        }
    }, [value, size])  // re-generates whenever path or size changes

    const handleDownload = () => {
        if (!dataUrl) return
        const link = document.createElement('a')
        link.download = `qr-${label || 'code'}.png`
        link.href = dataUrl
        link.click()
    }

    return (
        <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-white rounded-xl shadow-lg">
                <canvas ref={canvasRef} id={id} />
            </div>
            {label && (
                <div className="text-center">
                    <p className="text-slate-400 text-xs flex items-center gap-1 justify-center">
                        <QrCode size={12} />
                        {label}
                    </p>
                </div>
            )}
            {showDownload && dataUrl && (
                <button
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2 rounded-lg text-xs font-semibold text-indigo-300 hover:text-white transition-all"
                    style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
                    id={`download-qr-${id || 'btn'}`}
                >
                    <Download size={14} />
                    Download QR
                </button>
            )}
        </div>
    )
}
