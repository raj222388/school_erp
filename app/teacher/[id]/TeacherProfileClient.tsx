'use client'

import { useState } from 'react'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import ImagePreviewModal from '@/components/ImagePreviewModal'
import {
    MapPin,
    School,
    Award,
    Calendar,
    GraduationCap,
    Shield,
    BookOpen,
} from 'lucide-react'
import type { Teacher } from '@/types'

// ── Info row ───────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, color = 'text-slate-300' }: {
    icon: React.ElementType; label: string; value: string | null | undefined; color?: string
}) {
    if (!value) return null
    return (
        <div className="flex items-start gap-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(236,72,153,0.15)' }}>
                <Icon size={13} className="text-pink-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                <p className={`text-sm font-medium ${color} break-words`}>{value}</p>
            </div>
        </div>
    )
}

// ── Main Client Component ──────────────────────────────────────────────────
export default function TeacherProfileClient({ teacher, joinedDate }: {
    teacher: Teacher
    joinedDate: string
}) {
    const [heroOpen, setHeroOpen] = useState(false)

    return (
        <div
            className="min-h-screen py-8 px-4 sm:py-10"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #3b0764 50%, #0f172a 100%)' }}
        >
            {/* Top badge */}
            <div className="text-center mb-6">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'rgba(236,72,153,0.15)', border: '1px solid rgba(236,72,153,0.3)' }}
                >
                    <GraduationCap size={16} className="text-pink-400" />
                    <span className="text-pink-300 text-sm font-semibold">SchoolERP Pro — Official Digital ID</span>
                </div>
            </div>

            {/* ── ID Card (FIX 2 — responsive container) ── */}
            <div className="max-w-xl mx-auto">
                <div
                    className="rounded-2xl shadow-lg overflow-hidden"
                    style={{
                        background: 'linear-gradient(135deg, #1e1b4b 0%, #2d1b69 50%, #1e1b4b 100%)',
                        border: '2px solid rgba(236,72,153,0.4)',
                        boxShadow: '0 20px 60px rgba(0,0,0,0.5), 0 0 40px rgba(236,72,153,0.15)',
                    }}
                >
                    {/* Card Header */}
                    <div
                        className="p-5 sm:p-6 text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #9d174d, #be185d, #9d174d)' }}
                    >
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'repeating-linear-gradient(-45deg,white 0,white 1px,transparent 0,transparent 50%)', backgroundSize: '10px 10px' }}
                        />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4">
                                <Shield size={10} />
                                TEACHER ID CARD
                            </div>

                            {/* FIX 3 + FIX 4 — passport-size + clickable hero photo */}
                            <div className="flex justify-center mb-3">
                                {teacher.photo_url ? (
                                    <img
                                        src={teacher.photo_url}
                                        alt={teacher.name}
                                        title="Click to preview"
                                        onClick={() => setHeroOpen(true)}
                                        className="w-28 h-28 object-cover rounded-lg cursor-pointer transition-transform hover:scale-105 active:scale-95"
                                        style={{ border: '3px solid rgba(255,255,255,0.55)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }}
                                    />
                                ) : (
                                    <div
                                        className="w-28 h-28 rounded-lg flex items-center justify-center text-4xl font-bold text-white"
                                        style={{ background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}
                                    >
                                        {teacher.name[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {teacher.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                                    {teacher.qualification}
                                </span>
                                {teacher.experience && (
                                    <>
                                        <span className="text-white/60 text-xs">•</span>
                                        <span className="text-white/80 text-xs">{teacher.experience}</span>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-6 space-y-1">
                        {/* ID chip */}
                        <div
                            className="rounded-xl p-3 mb-4 flex items-center justify-between"
                            style={{ background: 'rgba(236,72,153,0.12)', border: '1px solid rgba(236,72,153,0.2)' }}
                        >
                            <div className="min-w-0 mr-3">
                                <p className="text-slate-500 text-xs">Teacher ID</p>
                                <p className="text-pink-300 text-xs font-mono font-bold mt-0.5 break-all">{teacher.id.toUpperCase()}</p>
                            </div>
                            <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                        </div>

                        {/* Professional */}
                        <div className="mb-2">
                            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">Professional Details</p>
                            <InfoRow icon={BookOpen} label="Qualification" value={teacher.qualification} color="text-pink-300" />
                            <InfoRow icon={Award} label="Teaching Experience" value={teacher.experience} />
                            <InfoRow icon={MapPin} label="Home Address" value={teacher.address} />
                        </div>

                        {/* School */}
                        <div className="mb-4">
                            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2 mt-4">School Information</p>
                            <InfoRow icon={School} label="School Name" value={teacher.school_name} color="text-indigo-300" />
                            <InfoRow icon={MapPin} label="School Address" value={teacher.school_address} />
                        </div>

                        {/* QR */}
                        <div
                            className="rounded-xl p-4 text-center"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <p className="text-slate-500 text-xs mb-3">Scan QR to verify identity</p>
                            <QRCodeDisplay
                                value={`/teacher/${teacher.id}`}
                                size={140}
                                showDownload={false}
                                id={`teacher-profile-qr-${teacher.id}`}
                            />
                        </div>

                        {/* Footer */}
                        <div className="pt-4 text-center">
                            <p className="text-slate-600 text-xs">Issued: {joinedDate}</p>
                            <p className="text-slate-700 text-xs mt-1">Official digital identity card — SchoolERP Pro</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Powered by */}
            <div className="text-center mt-6">
                <p className="text-slate-600 text-xs">
                    Powered by <span className="text-pink-500">SchoolERP Pro</span>
                </p>
            </div>

            {/* Hero photo modal */}
            {heroOpen && teacher.photo_url && (
                <ImagePreviewModal src={teacher.photo_url} alt={teacher.name} onClose={() => setHeroOpen(false)} />
            )}
        </div>
    )
}
