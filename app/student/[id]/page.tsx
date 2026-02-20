import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import {
    Phone,
    MapPin,
    School,
    Users,
    BookOpen,
    Calendar,
    User,
    GraduationCap,
    Shield,
} from 'lucide-react'
import type { Metadata } from 'next'

interface Props {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = createClient()
    const { data } = await supabase.from('students').select('name, school_name, class_name').eq('id', params.id).single()
    return {
        title: data ? `${data.name} - Student ID | SchoolERP Pro` : 'Student Profile | SchoolERP Pro',
        description: data ? `Digital ID card for ${data.name}, ${data.class_name} student at ${data.school_name}` : 'Student digital ID card',
    }
}

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

function PhotoCard({ url, name, role }: { url: string | null; name: string; role: string }) {
    return (
        <div className="flex flex-col items-center gap-2">
            {url ? (
                <img src={url} alt={name}
                    className="w-16 h-16 rounded-xl object-cover"
                    style={{ border: '2px solid rgba(99,102,241,0.4)' }} />
            ) : (
                <div className="w-16 h-16 rounded-xl flex items-center justify-center text-lg font-bold text-white"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    {name[0]?.toUpperCase()}
                </div>
            )}
            <div className="text-center">
                <p className="text-white text-xs font-medium">{name}</p>
                <p className="text-slate-500 text-xs">{role}</p>
            </div>
        </div>
    )
}

export default async function StudentProfilePage({ params }: Props) {
    const supabase = createClient()
    const { data: student, error } = await supabase
        .from('students')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !student) notFound()

    const joinedDate = new Date(student.created_at).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric'
    })

    return (
        <div className="min-h-screen py-10 px-4"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

            {/* Top watermark */}
            <div className="text-center mb-6">
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
                    style={{ background: 'rgba(99,102,241,0.15)', border: '1px solid rgba(99,102,241,0.3)' }}>
                    <GraduationCap size={16} className="text-indigo-400" />
                    <span className="text-indigo-300 text-sm font-semibold">SchoolERP Pro — Official Digital ID</span>
                </div>
            </div>

            {/* ID Card */}
            <div className="max-w-md mx-auto id-card">

                {/* Card Header */}
                <div className="p-5 text-center relative overflow-hidden"
                    style={{ background: 'linear-gradient(135deg, #4338ca, #7c3aed, #4338ca)' }}>
                    <div className="absolute inset-0 opacity-10"
                        style={{ backgroundImage: 'repeating-linear-gradient(45deg, white 0, white 1px, transparent 0, transparent 50%)', backgroundSize: '10px 10px' }} />
                    <div className="relative z-10">
                        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/20 text-white text-xs font-bold mb-3">
                            <Shield size={10} />
                            STUDENT ID CARD
                        </div>
                        <div className="flex flex-col items-center">
                            {student.photo_url ? (
                                <img src={student.photo_url} alt={student.name}
                                    className="w-24 h-24 rounded-2xl object-cover mb-3"
                                    style={{ border: '3px solid rgba(255,255,255,0.5)', boxShadow: '0 8px 32px rgba(0,0,0,0.4)' }} />
                            ) : (
                                <div className="w-24 h-24 rounded-2xl flex items-center justify-center text-3xl font-bold text-white mb-3"
                                    style={{ background: 'rgba(255,255,255,0.2)', border: '3px solid rgba(255,255,255,0.4)' }}>
                                    {student.name[0]?.toUpperCase()}
                                </div>
                            )}
                            <h1 className="text-xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                                {student.name}
                            </h1>
                            <div className="flex items-center gap-2 mt-2">
                                <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/20 text-white">
                                    {student.class_name}
                                </span>
                                <span className="text-white/60 text-xs">•</span>
                                <span className="text-white/80 text-xs">{student.school_name}</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Card Body */}
                <div className="p-5 space-y-1">
                    {/* ID Number */}
                    <div className="rounded-xl p-3 mb-4 flex items-center justify-between"
                        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}>
                        <div>
                            <p className="text-slate-500 text-xs">Student ID</p>
                            <p className="text-indigo-300 text-xs font-mono font-bold mt-0.5">{student.id.toUpperCase()}</p>
                        </div>
                        <Calendar size={16} className="text-slate-500" />
                    </div>

                    {/* School Info */}
                    <div className="mb-2">
                        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2">School Details</p>
                        <InfoRow icon={School} label="School Name" value={student.school_name} color="text-indigo-300" />
                        <InfoRow icon={Phone} label="School Phone" value={student.school_phone} />
                        <InfoRow icon={MapPin} label="School Address" value={student.school_address} />
                    </div>

                    {/* Student Info */}
                    <div className="mb-2">
                        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-2 mt-4">Student Details</p>
                        <InfoRow icon={BookOpen} label="Class" value={student.class_name} />
                        <InfoRow icon={User} label="Class Teacher" value={student.class_teacher} />
                        <InfoRow icon={MapPin} label="Home Address" value={student.address} />
                    </div>

                    {/* Parents Info */}
                    <div className="mb-4">
                        <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider mb-3 mt-4">Parent Information</p>
                        <div className="grid grid-cols-2 gap-3 mb-3">
                            <PhotoCard url={student.father_photo} name={student.father_name} role="Father" />
                            <PhotoCard url={student.mother_photo} name={student.mother_name} role="Mother" />
                        </div>
                        <InfoRow icon={Phone} label="Father's Phone" value={student.father_phone} />
                        <InfoRow icon={Phone} label="Mother's Phone" value={student.mother_phone} />
                    </div>

                    {/* QR Code */}
                    <div className="rounded-xl p-4 text-center"
                        style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
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
                        <p className="text-slate-700 text-xs mt-1">This is an official digital identity card issued by SchoolERP Pro</p>
                    </div>
                </div>
            </div>

            {/* Back link */}
            <div className="text-center mt-6">
                <p className="text-slate-600 text-xs">
                    Powered by <span className="text-indigo-500">SchoolERP Pro</span>
                </p>
            </div>
        </div>
    )
}
