import { createClient } from '@/lib/supabase/server'
import Link from 'next/link'
import {
    Users,
    BookOpen,
    UserPlus,
    GraduationCap,
    TrendingUp,
    QrCode,
    ArrowRight,
} from 'lucide-react'

export default async function AdminDashboard() {
    const supabase = createClient()

    const [{ count: studentCount }, { count: teacherCount }] = await Promise.all([
        supabase.from('students').select('*', { count: 'exact', head: true }),
        supabase.from('teachers').select('*', { count: 'exact', head: true }),
    ])

    const stats = [
        {
            label: 'Total Students',
            value: studentCount ?? 0,
            icon: Users,
            color: '#6366f1',
            bg: 'rgba(99, 102, 241, 0.15)',
            href: '/admin/students',
        },
        {
            label: 'Total Teachers',
            value: teacherCount ?? 0,
            icon: BookOpen,
            color: '#ec4899',
            bg: 'rgba(236, 72, 153, 0.15)',
            href: '/admin/teachers',
        },
    ]

    const quickActions = [
        {
            label: 'Add Student',
            desc: 'Register a new student with all details',
            icon: UserPlus,
            href: '/admin/students/new',
            gradient: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            id: 'add-student-btn',
        },
        {
            label: 'Add Teacher',
            desc: 'Onboard a new teaching staff member',
            icon: GraduationCap,
            href: '/admin/teachers/new',
            gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
            id: 'add-teacher-btn',
        },
        {
            label: 'Manage Students',
            desc: 'View, search, edit and manage students',
            icon: Users,
            href: '/admin/students',
            gradient: 'linear-gradient(135deg, #06b6d4, #0284c7)',
            id: 'manage-students-btn',
        },
        {
            label: 'Manage Teachers',
            desc: 'View, search and manage teaching staff',
            icon: BookOpen,
            href: '/admin/teachers',
            gradient: 'linear-gradient(135deg, #10b981, #059669)',
            id: 'manage-teachers-btn',
        },
    ]

    return (
        <div className="page-enter">
            {/* Header */}
            <div className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <TrendingUp size={20} className="text-white" />
                    </div>
                    <div>
                        <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            Dashboard Overview
                        </h1>
                        <p className="text-slate-400 text-sm">Welcome back, Administrator! 👋</p>
                    </div>
                </div>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {stats.map(({ label, value, icon: Icon, color, bg, href }) => (
                    <Link key={label} href={href} className="stat-card group hover:no-underline">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-slate-400 text-sm font-medium">{label}</p>
                                <p className="text-4xl font-bold text-white mt-2 mb-1"
                                    style={{ fontFamily: 'Poppins, sans-serif' }}>
                                    {value.toLocaleString()}
                                </p>
                                <p className="text-slate-500 text-xs">Registered records</p>
                            </div>
                            <div className="w-16 h-16 rounded-2xl flex items-center justify-center"
                                style={{ background: bg }}>
                                <Icon size={30} style={{ color }} />
                            </div>
                        </div>
                        <div className="mt-4 pt-4 border-t flex items-center gap-1 text-xs font-medium"
                            style={{ borderColor: 'rgba(255,255,255,0.07)', color }}>
                            <span>View all records</span>
                            <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                        </div>
                    </Link>
                ))}
            </div>

            {/* Quick Actions */}
            <div className="mb-8">
                <h2 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                    <QrCode size={18} className="text-indigo-400" />
                    Quick Actions
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                    {quickActions.map(({ label, desc, icon: Icon, href, gradient, id }) => (
                        <Link key={id} href={href} id={id}
                            className="block p-5 rounded-2xl group transition-all hover:scale-105 hover:no-underline"
                            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}
                        >
                            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4"
                                style={{ background: gradient }}>
                                <Icon size={24} className="text-white" />
                            </div>
                            <h3 className="text-white font-semibold text-sm mb-1">{label}</h3>
                            <p className="text-slate-500 text-xs leading-relaxed">{desc}</p>
                            <div className="mt-3 flex items-center gap-1 text-xs font-medium text-slate-400 group-hover:text-white transition-colors">
                                <span>Go</span>
                                <ArrowRight size={12} className="group-hover:translate-x-1 transition-transform" />
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            {/* Info Banner */}
            <div className="rounded-2xl p-5"
                style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(236,72,153,0.08))', border: '1px solid rgba(99,102,241,0.2)' }}>
                <div className="flex items-start gap-4">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
                        style={{ background: 'rgba(99,102,241,0.2)' }}>
                        <QrCode size={20} className="text-indigo-400" />
                    </div>
                    <div>
                        <h3 className="text-white font-semibold text-sm mb-1">🎯 QR Code System Active</h3>
                        <p className="text-slate-400 text-xs leading-relaxed">
                            Every student and teacher gets a permanent, unique QR code that links to their digital ID card.
                            These QR codes never change, even if profile data is updated. Share them for instant verification.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    )
}
