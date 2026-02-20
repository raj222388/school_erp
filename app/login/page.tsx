'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Lock, Mail, Eye, EyeOff, GraduationCap } from 'lucide-react'

export default function LoginPage() {
    const router = useRouter()
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)

        const { error } = await supabase.auth.signInWithPassword({ email, password })

        if (error) {
            toast.error(error.message || 'Invalid credentials. Please try again.')
            setLoading(false)
            return
        }

        toast.success('Welcome back, Admin! 👋')
        router.push('/admin')
        router.refresh()
    }

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
            style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)' }}>

            {/* Animated background blobs */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
                    style={{ background: 'radial-gradient(circle, #6366f1, transparent)' }} />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full opacity-20 animate-pulse"
                    style={{ background: 'radial-gradient(circle, #ec4899, transparent)', animationDelay: '1s' }} />
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full opacity-5"
                    style={{ background: 'radial-gradient(circle, #06b6d4, transparent)' }} />
            </div>

            <div className="w-full max-w-md mx-4 z-10">
                {/* Logo / Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4"
                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                        <GraduationCap size={40} className="text-white" />
                    </div>
                    <h1 className="text-3xl font-bold" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        <span className="gradient-text">SchoolERP</span>
                        <span className="text-white"> Pro</span>
                    </h1>
                    <p className="text-slate-400 mt-2 text-sm">School Management System</p>
                </div>

                {/* Login Card */}
                <div className="glass rounded-2xl p-8" style={{ border: '1px solid rgba(99, 102, 241, 0.25)' }}>
                    <h2 className="text-xl font-semibold text-white mb-6">Admin Login</h2>

                    <form onSubmit={handleLogin} className="space-y-5">
                        {/* Email */}
                        <div>
                            <label className="label">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="login-email"
                                    type="email"
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    className="input-field pl-11"
                                    placeholder="admin@school.com"
                                    required
                                />
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="label">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                                <input
                                    id="login-password"
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    className="input-field pl-11 pr-11"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                                >
                                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                                </button>
                            </div>
                        </div>

                        {/* Submit */}
                        <button
                            id="login-submit"
                            type="submit"
                            disabled={loading}
                            className="btn-primary w-full justify-center py-3 text-base"
                            style={{ background: loading ? '#374151' : 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}
                        >
                            {loading ? (
                                <>
                                    <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    <Lock size={18} />
                                    Sign In to Dashboard
                                </>
                            )}
                        </button>
                    </form>

                    <div className="mt-6 pt-6 border-t border-white/10 text-center">
                        <p className="text-slate-400 text-xs">
                            🔒 Secured admin portal. Unauthorized access is prohibited.
                        </p>
                    </div>
                </div>

                <p className="text-center text-slate-500 text-xs mt-6">
                    © 2026 SchoolERP Pro. All rights reserved.
                </p>
            </div>
        </div>
    )
}
