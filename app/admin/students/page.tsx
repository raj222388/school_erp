'use client'

import { useState, useEffect, useCallback } from 'react'
import { createClient } from '@/lib/supabase/client'
import Link from 'next/link'
import toast from 'react-hot-toast'
import ConfirmDelete from '@/components/ConfirmDelete'
import QRCodeDisplay from '@/components/QRCodeDisplay'
import { Student } from '@/types'
import {
    Search,
    UserPlus,
    Eye,
    Trash2,
    QrCode,
    X,
    Users,
    Phone,
    School,
} from 'lucide-react'

export default function StudentsPage() {
    const supabase = createClient()
    const [students, setStudents] = useState<Student[]>([])
    const [filtered, setFiltered] = useState<Student[]>([])
    const [search, setSearch] = useState('')
    const [loading, setLoading] = useState(true)
    const [deleteTarget, setDeleteTarget] = useState<Student | null>(null)
    const [deleting, setDeleting] = useState(false)
    const [qrStudent, setQrStudent] = useState<Student | null>(null)

    const fetchStudents = useCallback(async () => {
        setLoading(true)
        const { data, error } = await supabase
            .from('students')
            .select('*')
            .order('created_at', { ascending: false })
        if (error) toast.error('Failed to load students')
        else {
            setStudents(data || [])
            setFiltered(data || [])
        }
        setLoading(false)
    }, [])

    useEffect(() => { fetchStudents() }, [fetchStudents])

    useEffect(() => {
        const q = search.toLowerCase()
        setFiltered(students.filter(s =>
            s.name.toLowerCase().includes(q) ||
            s.class_name.toLowerCase().includes(q) ||
            s.school_name.toLowerCase().includes(q) ||
            s.father_name.toLowerCase().includes(q)
        ))
    }, [search, students])

    const handleDelete = async () => {
        if (!deleteTarget) return
        setDeleting(true)
        const { error } = await supabase.from('students').delete().eq('id', deleteTarget.id)
        if (error) toast.error('Failed to delete student')
        else {
            toast.success('Student deleted successfully')
            setStudents(prev => prev.filter(s => s.id !== deleteTarget.id))
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
                        Manage Students
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">
                        {filtered.length} student{filtered.length !== 1 ? 's' : ''} found
                    </p>
                </div>
                <Link href="/admin/students/new" id="add-student-link"
                    className="btn-primary whitespace-nowrap">
                    <UserPlus size={18} />
                    Add Student
                </Link>
            </div>

            {/* Search */}
            <div className="relative mb-6">
                <Search size={16} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                <input
                    id="student-search"
                    type="text"
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    className="input-field pl-11"
                    placeholder="Search by name, class, school..."
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
                            <p className="text-slate-400 text-sm">Loading students...</p>
                        </div>
                    </div>
                ) : filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-20">
                        <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4"
                            style={{ background: 'rgba(99,102,241,0.15)' }}>
                            <Users size={30} className="text-indigo-400" />
                        </div>
                        <h3 className="text-white font-semibold mb-1">No students found</h3>
                        <p className="text-slate-400 text-sm mb-4">
                            {search ? 'Try a different search term' : 'Add your first student to get started'}
                        </p>
                        {!search && (
                            <Link href="/admin/students/new" className="btn-primary">
                                <UserPlus size={16} /> Add First Student
                            </Link>
                        )}
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Student</th>
                                    <th>Class</th>
                                    <th>School</th>
                                    <th>Father</th>
                                    <th className="hidden md:table-cell">Contacts</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filtered.map(student => (
                                    <tr key={student.id}>
                                        <td>
                                            <div className="flex items-center gap-3">
                                                {student.photo_url ? (
                                                    <img src={student.photo_url} alt={student.name}
                                                        className="avatar" />
                                                ) : (
                                                    <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white"
                                                        style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)' }}>
                                                        {student.name[0]?.toUpperCase()}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="text-white font-medium text-sm">{student.name}</p>
                                                    <p className="text-slate-500 text-xs truncate max-w-[120px]">{student.id.slice(0, 8)}...</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <span className="badge badge-purple">{student.class_name}</span>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-1 text-slate-300 text-sm">
                                                <School size={12} className="text-slate-500 flex-shrink-0" />
                                                <span className="truncate max-w-[120px]">{student.school_name}</span>
                                            </div>
                                        </td>
                                        <td>
                                            <p className="text-slate-300 text-sm">{student.father_name}</p>
                                        </td>
                                        <td className="hidden md:table-cell">
                                            <div className="flex flex-col gap-1">
                                                <div className="flex items-center gap-1 text-slate-400 text-xs">
                                                    <Phone size={10} />
                                                    {student.father_phone}
                                                </div>
                                                <div className="flex items-center gap-1 text-slate-400 text-xs">
                                                    <Phone size={10} />
                                                    {student.mother_phone}
                                                </div>
                                            </div>
                                        </td>
                                        <td>
                                            <div className="flex items-center gap-2">
                                                <Link href={`/student/${student.id}`} target="_blank"
                                                    className="p-2 rounded-lg text-slate-400 hover:text-indigo-400 hover:bg-indigo-500/10 transition-all"
                                                    title="View Profile">
                                                    <Eye size={15} />
                                                </Link>
                                                <button
                                                    onClick={() => setQrStudent(student)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-cyan-400 hover:bg-cyan-500/10 transition-all"
                                                    title="View QR Code">
                                                    <QrCode size={15} />
                                                </button>
                                                <button
                                                    onClick={() => setDeleteTarget(student)}
                                                    className="p-2 rounded-lg text-slate-400 hover:text-red-400 hover:bg-red-500/10 transition-all"
                                                    title="Delete Student">
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
            {qrStudent && (
                <div className="modal-overlay" onClick={() => setQrStudent(null)}>
                    <div className="modal-content max-w-xs" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-6">
                            <h3 className="text-white font-semibold">Student QR Code</h3>
                            <button onClick={() => setQrStudent(null)}
                                className="p-1 rounded-lg hover:bg-white/10 text-slate-400 hover:text-white transition-colors">
                                <X size={18} />
                            </button>
                        </div>
                        <div className="text-center">
                            <div className="mb-3">
                                <p className="text-white font-medium">{qrStudent.name}</p>
                                <span className="badge badge-purple mt-1">{qrStudent.class_name}</span>
                            </div>
                            <QRCodeDisplay
                                value={`/student/${qrStudent.id}`}
                                label={`ID: ${qrStudent.id.slice(0, 8)}...`}
                                showDownload={true}
                                id={`student-qr-${qrStudent.id}`}
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
                title="Delete Student"
                description={`Are you sure you want to delete ${deleteTarget?.name}? This action cannot be undone and will permanently remove all their data.`}
            />
        </div>
    )
}
