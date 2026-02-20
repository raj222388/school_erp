import Link from 'next/link'
import { GraduationCap, Home } from 'lucide-react'

export default function NotFound() {
    return (
        <div className="min-h-screen flex items-center justify-center"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)' }}>
            <div className="text-center">
                <div className="w-20 h-20 rounded-2xl flex items-center justify-center mx-auto mb-6"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <GraduationCap size={40} className="text-white" />
                </div>
                <h1 className="text-6xl font-bold gradient-text mb-4" style={{ fontFamily: 'Poppins, sans-serif' }}>
                    404
                </h1>
                <h2 className="text-xl font-semibold text-white mb-2">Profile Not Found</h2>
                <p className="text-slate-400 mb-6 text-sm max-w-sm mx-auto">
                    The student or teacher profile you&apos;re looking for doesn&apos;t exist or may have been removed.
                </p>
                <Link href="/"
                    className="btn-primary inline-flex">
                    <Home size={16} />
                    Go Home
                </Link>
            </div>
        </div>
    )
}
