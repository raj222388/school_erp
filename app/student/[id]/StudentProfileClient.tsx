'use client'

import { useState } from 'react'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import ImagePreviewModal from '@/components/ImagePreviewModal'
import {
    Phone,
    MapPin,
    School,
    BookOpen,
    Calendar,
    User,
    GraduationCap,
    Shield,
} from 'lucide-react'
import type { Student } from '@/types'

// ── Clickable passport-size photo ──────────────────────────────────────────
function PassportPhoto({ url, name, role }: { url: string | null; name: string; role: string }) {
    const [open, setOpen] = useState(false)
    return (
        <>
            <div className="flex flex-col items-center gap-2">
                {url ? (
                    <img
                        src={url}
                        alt={name}
                        title={`Click to preview ${name}`}
                        onClick={() => setOpen(true)}
                        className="w-28 h-28 object-cover rounded-lg border-2 cursor-pointer transition-transform hover:scale-105 active:scale-95"
                        style={{ borderColor: 'rgba(99,102,241,0.5)' }}
                    />
                ) : (
                    <div
                        className="w-28 h-28 rounded-lg flex items-center justify-center text-2xl font-bold text-white"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', border: '2px solid rgba(99,102,241,0.4)' }}
                    >
                        {name[0]?.toUpperCase()}
                    </div>
                )}
                <div className="text-center">
                    <p className="text-white text-xs font-medium">{name}</p>
                    <p className="text-slate-500 text-xs">{role}</p>
                </div>
            </div>
            {open && url && (
                <ImagePreviewModal src={url} alt={name} onClose={() => setOpen(false)} />
            )}
        </>
    )
}

// ── Info row ───────────────────────────────────────────────────────────────
function InfoRow({ icon: Icon, label, value, color = 'text-slate-300' }: {
    icon: React.ElementType; label: string; value: string | null | undefined; color?: string
}) {
    if (!value) return null
    return (
        <div className="flex items-start gap-3 py-2.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5"
                style={{ background: 'rgba(99,102,241,0.15)' }}>
                <Icon size={13} className="text-indigo-400" />
            </div>
            <div className="flex-1 min-w-0">
                <p className="text-slate-500 text-xs mb-0.5">{label}</p>
                <p className={`text-sm font-medium ${color} break-words`}>{value}</p>
            </div>
        </div>
    )
}

// ── Main Client Component ──────────────────────────────────────────────────
export default function StudentProfileClient({ student, joinedDate }: {
    student: Student
    joinedDate: string
}) {
    const [heroOpen, setHeroOpen] = useState(false)

    return (
        <div
            className="min-h-screen py-8 px-4 sm:py-10"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}
        >
            {/* Top badge */}
            <div className="text-center mb-6">
                <div
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}
                >
                    <GraduationCap size={16} className="text-indigo-400" />
                    <span className="text-indigo-300 text-sm font-semibold">SchoolERP Pro — Official Digital ID</span>
                </div>
            </div>

            {/* ── ID Card (FIX 2 — responsive container) ── */}
            <div className="max-w-xl mx-auto">
                <div className="id-card rounded-2xl shadow-lg overflow-hidden">

                    {/* Card Header */}
                    <div
                        className="p-5 sm:p-6 text-center relative overflow-hidden"
                        style={{ background: 'linear-gradient(135deg, #4338ca, #7c3aed, #4338ca)' }}
                    >
                        <div
                            className="absolute inset-0 opacity-10"
                            style={{ backgroundImage: 'repeating-linear-gradient(45deg,white 0,white 1px,transparent 0,transparent 50%)', backgroundSize: '10px 10px' }}
                        />
                        <div className="relative z-10">
                            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-4">
                                <Shield size={10} />
                                STUDENT ID CARD
                            </div>

                            {/* FIX 3 + FIX 4 — hero student photo passport-size + clickable */}
                            <div className="flex justify-center mb-3">
                                {student.photo_url ? (
                                    <img
                                        src={student.photo_url}
                                        alt={student.name}
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
                                        {student.name[0]?.toUpperCase()}
                                    </div>
                                )}
                            </div>

                            <h1 className="text-xl sm:text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {student.name}
                            </h1>
                            <div className="flex flex-wrap items-center justify-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                                    {student.class_name}
                                </span>
                                <span className="text-white/60 text-xs">•</span>
                                <span className="text-white/80 text-xs">{student.school_name}</span>
                            </div>
                        </div>
                    </div>

                    {/* Card Body */}
                    <div className="p-4 sm:p-6 space-y-1">
                        {/* ID chip */}
                        <div
                            className="rounded-xl p-3 mb-4 flex items-center justify-between"
                            style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
                        >
                            <div className="min-w-0 mr-3">
                                <p className="text-slate-500 text-xs">Student ID</p>
                                <p className="text-indigo-300 text-xs font-mono font-bold mt-0.5 break-all">{student.id.toUpperCase()}</p>
                            </div>
                            <Calendar size={16} className="text-slate-500 flex-shrink-0" />
                        </div>

                        {/* School */}
                        <div className="mb-2">
                            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">School Details</p>
                            <InfoRow icon={School} label="School Name" value={student.school_name} color="text-indigo-300" />
                            <InfoRow icon={Phone} label="School Phone" value={student.school_phone} />
                            <InfoRow icon={MapPin} label="School Address" value={student.school_address} />
                        </div>

                        {/* Student details */}
                        <div className="mb-2">
                            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2 mt-4">Student Details</p>
                            <InfoRow icon={BookOpen} label="Class" value={student.class_name} />
                            <InfoRow icon={User} label="Class Teacher" value={student.class_teacher} />
                            <InfoRow icon={MapPin} label="Home Address" value={student.address} />
                        </div>

                        {/* Parents — FIX 3 passport size, FIX 4 clickable */}
                        <div className="mb-4">
                            <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-3 mt-4">Parent Information</p>
                            <div className="grid grid-cols-2 gap-4 mb-3">
                                <PassportPhoto url={student.father_photo} name={student.father_name} role="Father" />
                                <PassportPhoto url={student.mother_photo} name={student.mother_name} role="Mother" />
                            </div>
                            <InfoRow icon={Phone} label="Father's Phone" value={student.father_phone} />
                            <InfoRow icon={Phone} label="Mother's Phone" value={student.mother_phone} />
                        </div>

                        {/* QR */}
                        <div
                            className="rounded-xl p-4 text-center"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <p className="text-slate-500 text-xs mb-3">Scan QR to verify identity</p>
                            <QRCodeDisplay
                                value={`/student/${student.id}`}
                                size={140}
                                showDownload={false}
                                id={`student-profile-qr-${student.id}`}
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
                    Powered by <span className="text-indigo-500">SchoolERP Pro</span>
                </p>
            </div>

            {/* Hero photo modal */}
            {heroOpen && student.photo_url && (
                <ImagePreviewModal src={student.photo_url} alt={student.name} onClose={() => setHeroOpen(false)} />
            )}
        </div>
    )
}
