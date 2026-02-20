'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmDelete from '@/components/ConfirmDelete'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { Teacher } from '@/types'
import {
    Search,
    UserPlus,
    Eye,
    Trash2,
    QrCode,
    X,
    BookOpen,
    GraduationCap,
    Award,
} from 'lucide-react'

export default function TeachersPage() {
    const supabase = createClient()
    const [teachers, setTeachers] = useState<Teacher[]>([])
    const [filtered, setFiltered] = useState<Teacher[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState<Teacher | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [qrTeacher, setQrTeacher] = useState<Teacher | null>(null)

    const fetchTeachers = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('teachers')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) toast.error('Failed to load teachers')
        else {
            setTeachers(data || [])
            setFiltered(data || [])
        }
        setLoading(false)
    }, [])

    useEffect(() => { fetchTeachers() }, [fetchTeachers])

    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(teachers.filter(t =>
            t.name.toLowerCase().includes(q) ||
            t.school_name.toLowerCase().includes(q) ||
            t.qualification.toLowerCase().includes(q)
        ))
    }, [search, teachers])

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        const { error } = await supabase.from('teachers').delete().eq('id', deleteTarget.id)
        if (error) toast.error('Failed to delete teacher')
        else {
            toast.success('Teacher deleted successfully')
            setTeachers(prev => prev.filter(t => t.id !== deleteTarget.id))
        }
        setDeleting(false)
        setDeleteTarget(null)
    }

    return (
        <div className="page-enter">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Manage Teachers
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} teacher{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <Link href="/admin/teachers/new" id="add-teacher-link"
                    className="btn-primary whitespace-nowrap"
                    style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                    <UserPlus size={18} />
                    Add Teacher
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    id="teacher-search"
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-11"
                    placeholder="Search by name, school, qualification..."
                />
                {search && (
                    <button onClick={() => setSearch('')}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white">
                        <X size={16} />
                    </button>
                )}
            </div>

            {/* Table */}
            <div className="rounded-2xl overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {loading ? (
                    <div className="flex items-center justify-center py-20">
                        <div className="text-center">
                            <div className="spinner mx-auto mb-4" />
                            <p className="text-slate-400 text-sm">Loading teachers...</p>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'rgba(236,72,153,0.15)' }}>
                            <BookOpen size={30} className="text-pink-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-1">No teachers found</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            {search ? 'Try a different search term' : 'Add your first teacher to get started'}
                        </p>
                        {!search && (
                            <Link href="/admin/teachers/new" className="btn-primary"
                                style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                                <UserPlus size={16} /> Add First Teacher
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Teacher</th>
                                    <th>School</th>
                                    <th>Qualification</th>
                                    <th>Experience</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(teacher => (
                                    <tr key={teacher.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {teacher.photo_url ? (
                                                    <img src={teacher.photo_url} alt={teacher.name} className="avatar" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                                        style={{ background: 'linear-gradient(135deg, #ec4899, #f43f5e)' }}>
                                                        {teacher.name[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium text-sm">{teacher.name}</p>
                                                    <p className="text-slate-500 text-xs">{teacher.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-slate-300 text-sm">
                                                <GraduationCap size={12} className="text-slate-500" />
                                                <span className="truncate max-w-[140px]">{teacher.school_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-pink">{teacher.qualification}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-slate-300 text-sm">
                                                <Award size={12} className="text-slate-500" />
                                                {teacher.experience}
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/teacher/${teacher.id}`} target="_blank"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                                                    title="View Profile">
                                                    <Eye size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => setQrTeacher(teacher)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                                    title="View QR Code">
                                                    <QrCode size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(teacher)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete Teacher">
                                                    <Trash2 size={15} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* QR Modal */}
            {qrTeacher && (
                <div className="modal-overlay" onClick={() => setQrTeacher(null)}>
                    <div className="modal-content max-w-xs" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-semibold">Teacher QR Code</h3>
                            <button onClick={() => setQrTeacher(null)}
                                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="mb-3">
                                <p className="text-white font-medium">{qrTeacher.name}</p>
                                <span className="badge badge-pink mt-1">{qrTeacher.qualification}</span>
                            </div>
                            <QRCodeDisplay
                                value={`/teacher/${qrTeacher.id}`}
                                label={`ID: ${qrTeacher.id.slice(0, 8)}...`}
                                showDownload={true}
                                id={`teacher-qr-${qrTeacher.id}`}
                            />
                        </div>
                    </div>
                </div>
            )}

            {/* Delete Confirmation */}
            <ConfirmDelete
                isOpen={!!deleteTarget}
                onClose={() => setDeleteTarget(null)}
                onConfirm={handleDelete}
                loading={deleting}
                title="Delete Teacher"
                description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone.`}
            />
        </div>
    )
}
