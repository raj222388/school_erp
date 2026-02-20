'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import {
    LayoutDashboard,
    Users,
    BookOpen,
    LogOut,
    GraduationCap,
    Menu,
    X,
    Settings,
    ChevronRight,
} from 'lucide-react'

const navItems = [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/students', label: 'Manage Students', icon: Users },
    { href: '/admin/teachers', label: 'Manage Teachers', icon: BookOpen },
    { href: '/admin/settings', label: 'Admin Settings', icon: Settings },
]

export default function Sidebar() {
    const pathname = usePathname()
    const router = useRouter()
    const supabase = createClient()
    const [mobileOpen, setMobileOpen] = useState(false)

    const handleLogout = async () => {
        await supabase.auth.signOut()
        toast.success('Logged out successfully')
        router.push('/login')
        router.refresh()
    }

    const SidebarContent = () => (
        <div className="flex flex-col h-full">
            {/* Logo */}
            <div className="p-6 border-b" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <GraduationCap size={22} className="text-white" />
                    </div>
                    <div>
                        <h2 className="font-bold text-white text-sm" style={{ fontFamily: 'Poppins, sans-serif' }}>
                            SchoolERP Pro
                        </h2>
                        <p className="text-slate-500 text-xs">Management System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 p-4 space-y-1">
                <p className="text-slate-600 text-xs font-semibold uppercase tracking-wider px-3 mb-3">
                    Main Menu
                </p>
                {navItems.map(({ href, label, icon: Icon }) => {
                    const isActive = href === '/admin' ? pathname === '/admin' : pathname.startsWith(href)
                    return (
                        <Link
                            key={href}
                            href={href}
                            onClick={() => setMobileOpen(false)}
                            className={`nav-item ${isActive ? 'active' : ''}`}
                        >
                            <Icon size={18} />
                            <span className="flex-1">{label}</span>
                            {isActive && <ChevronRight size={14} className="text-indigo-400" />}
                        </Link>
                    )
                })}
            </nav>

            {/* Admin Info + Logout */}
            <div className="p-4 border-t" style={{ borderColor: 'rgba(99, 102, 241, 0.2)' }}>
                <div className="glass rounded-xl p-3 mb-3"
                    style={{ border: '1px solid rgba(99,102,241,0.15)' }}>
                    <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white"
                            style={{ background: 'linear-gradient(135deg, #6366f1, #ec4899)' }}>
                            A
                        </div>
                        <div>
                            <p className="text-white text-xs font-semibold">Administrator</p>
                            <p className="text-slate-500 text-xs">Super Admin</p>
                        </div>
                    </div>
                </div>
                <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all text-sm font-medium"
                >
                    <LogOut size={16} />
                    Sign Out
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile hamburger */}
            <button
                id="sidebar-toggle"
                onClick={() => setMobileOpen(!mobileOpen)}
                className="fixed top-4 left-4 z-50 md:hidden p-2 rounded-lg"
                style={{ background: 'rgba(99,102,241,0.2)', border: '1px solid rgba(99,102,241,0.3)' }}
            >
                {mobileOpen ? <X size={20} className="text-white" /> : <Menu size={20} className="text-white" />}
            </button>

            {/* Mobile overlay */}
            {mobileOpen && (
                <div
                    className="fixed inset-0 bg-black/60 z-30 md:hidden"
                    onClick={() => setMobileOpen(false)}
                />
            )}

            {/* Sidebar */}
            <aside className={`sidebar ${mobileOpen ? 'open' : ''}`}>
                <SidebarContent />
            </aside>
        </>
    )
}
