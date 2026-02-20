'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import toast from 'react-hot-toast'
import { Settings, Mail, Lock, Eye, EyeOff, Shield, Save } from 'lucide-react'

export default function AdminSettingsPage() {
    const supabase = createClient()
    const [email, setEmail] = useState('')
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [showPasswords, setShowPasswords] = useState(false)
    const [loadingEmail, setLoadingEmail] = useState(false)
    const [loadingPass, setLoadingPass] = useState(false)

    const handleUpdateEmail = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!email.trim()) { toast.error('Enter a new email'); return }
        setLoadingEmail(true)
        const { error } = await supabase.auth.updateUser({ email })
        if (error) toast.error(error.message)
        else toast.success('Email update link sent! Check your inbox.')
        setLoadingEmail(false)
        setEmail('')
    }

    const handleUpdatePassword = async (e: React.FormEvent) => {
        e.preventDefault()
        if (newPassword !== confirmPassword) { toast.error('Passwords do not match'); return }
        if (newPassword.length < 8) { toast.error('Password must be at least 8 characters'); return }
        setLoadingPass(true)

        // Re-authenticate first
        const { data: { user } } = await supabase.auth.getUser()
        if (!user?.email) { toast.error('Could not get user info'); setLoadingPass(false); return }

        const { error: reAuthError } = await supabase.auth.signInWithPassword({
            email: user.email,
            password: currentPassword,
        })
        if (reAuthError) { toast.error('Current password is incorrect'); setLoadingPass(false); return }

        const { error } = await supabase.auth.updateUser({ password: newPassword })
        if (error) toast.error(error.message)
        else toast.success('Password updated successfully! 🔒')
        setLoadingPass(false)
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
    }

    return (
        <div className="page-enter max-w-xl">
            {/* Header */}
            <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-xl flex items-center justify-center"
                    style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                    <Settings size={20} className="text-white" />
                </div>
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Admin Settings
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Update your login credentials</p>
                </div>
            </div>

            {/* Security Notice */}
            <div className="rounded-xl p-4 mb-6 flex items-start gap-3"
                style={{ background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)' }}>
                <Shield size={18} className="text-indigo-400 flex-shrink-0 mt-0.5" />
                <p className="text-slate-400 text-sm">
                    Keep your credentials secure. Never share your admin password. Use a strong, unique password for your account.
                </p>
            </div>

            {/* Update Email */}
            <div className="rounded-2xl p-6 mb-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <h2 className="text-white font-semibold flex items-center gap-2 mb-5">
                    <Mail size={18} className="text-indigo-400" />
                    Update Email Address
                </h2>
                <form onSubmit={handleUpdateEmail} className="space-y-4">
                    <div>
                        <label className="label" htmlFor="new-email">New Email Address</label>
                        <div className="relative">
                            <Mail size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="new-email"
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                className="input-field pl-11"
                                placeholder="new.admin@school.com"
                                required
                            />
                        </div>
                    </div>
                    <button
                        type="submit"
                        id="update-email-btn"
                        disabled={loadingEmail}
                        className="btn-primary"
                    >
                        {loadingEmail ? (
                            <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Sending...</>
                        ) : (
                            <><Save size={16} /> Update Email</>
                        )}
                    </button>
                </form>
            </div>

            {/* Update Password */}
            <div className="rounded-2xl p-6"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                <div className="flex items-center justify-between mb-5">
                    <h2 className="text-white font-semibold flex items-center gap-2">
                        <Lock size={18} className="text-pink-400" />
                        Update Password
                    </h2>
                    <button
                        type="button"
                        onClick={() => setShowPasswords(!showPasswords)}
                        className="text-slate-400 hover:text-white text-xs flex items-center gap-1 transition-colors"
                    >
                        {showPasswords ? <EyeOff size={14} /> : <Eye size={14} />}
                        {showPasswords ? 'Hide' : 'Show'}
                    </button>
                </div>
                <form onSubmit={handleUpdatePassword} className="space-y-4">
                    <div>
                        <label className="label" htmlFor="current-password">Current Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="current-password"
                                type={showPasswords ? 'text' : 'password'}
                                value={currentPassword}
                                onChange={e => setCurrentPassword(e.target.value)}
                                className="input-field pl-11"
                                placeholder="••••••••"
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label" htmlFor="new-password">New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="new-password"
                                type={showPasswords ? 'text' : 'password'}
                                value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                className="input-field pl-11"
                                placeholder="Min. 8 characters"
                                required
                                minLength={8}
                            />
                        </div>
                    </div>
                    <div>
                        <label className="label" htmlFor="confirm-password">Confirm New Password</label>
                        <div className="relative">
                            <Lock size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                            <input
                                id="confirm-password"
                                type={showPasswords ? 'text' : 'password'}
                                value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                className="input-field pl-11"
                                placeholder="Repeat new password"
                                required
                            />
                        </div>
                        {newPassword && confirmPassword && newPassword !== confirmPassword && (
                            <p className="text-red-400 text-xs mt-1">⚠ Passwords do not match</p>
                        )}
                    </div>
                    <button
                        type="submit"
                        id="update-password-btn"
                        disabled={loadingPass}
                        className="btn-primary"
                        style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}
                    >
                        {loadingPass ? (
                            <><div className="spinner" style={{ width: 16, height: 16, borderWidth: 2 }} /> Updating...</>
                        ) : (
                            <><Lock size={16} /> Update Password</>
                        )}
                    </button>
                </form>
            </div>
        </div>
    )
}
