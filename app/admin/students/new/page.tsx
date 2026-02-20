'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import { StudentFormData } from '@/types'
import {
    User,
    Phone,
    MapPin,
    School,
    BookOpen,
    ArrowLeft,
    Save,
    Users,
} from 'lucide-react'
import Link from 'next/link'

const initialForm: StudentFormData = {
    name: '',
    photo: null,
    father_name: '',
    father_photo: null,
    mother_name: '',
    mother_photo: null,
    father_phone: '',
    mother_phone: '',
    address: '',
    school_name: '',
    school_phone: '',
    school_address: '',
    class_name: '',
    class_teacher: '',
}

async function uploadImage(
    supabase: ReturnType<typeof createClient>,
    file: File,
    bucket: string,
    path: string
): Promise<string> {
    const { error } = await supabase.storage
        .from(bucket)
        .upload(path, file, { upsert: true, contentType: file.type })
    if (error) throw new Error(`Upload failed: ${error.message}`)
    const { data } = supabase.storage.from(bucket).getPublicUrl(path)
    return data.publicUrl
}

export default function AddStudentPage() {
    const router = useRouter()
    const supabase = createClient()
    const [form, setForm] = useState<StudentFormData>(initialForm)
    const [loading, setLoading] = useState(false)

    const set = (key: keyof StudentFormData, value: string | File | null) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) { toast.error('Student name is required'); return }
        if (!form.class_name.trim()) { toast.error('Class name is required'); return }

        setLoading(true)
        const id = uuidv4()

        try {
            // Upload images
            let photo_url: string | null = null
            let father_photo: string | null = null
            let mother_photo: string | null = null

            if (form.photo) {
                photo_url = await uploadImage(supabase, form.photo, 'student-photos', `${id}/student.${form.photo.name.split('.').pop()}`)
            }
            if (form.father_photo) {
                father_photo = await uploadImage(supabase, form.father_photo, 'student-photos', `${id}/father.${form.father_photo.name.split('.').pop()}`)
            }
            if (form.mother_photo) {
                mother_photo = await uploadImage(supabase, form.mother_photo, 'student-photos', `${id}/mother.${form.mother_photo.name.split('.').pop()}`)
            }

            // Insert to DB
            const { error } = await supabase.from('students').insert({
                id,
                name: form.name.trim(),
                photo_url,
                father_name: form.father_name.trim(),
                father_photo,
                mother_name: form.mother_name.trim(),
                mother_photo,
                father_phone: form.father_phone.trim(),
                mother_phone: form.mother_phone.trim(),
                address: form.address.trim(),
                school_name: form.school_name.trim(),
                school_phone: form.school_phone.trim(),
                school_address: form.school_address.trim(),
                class_name: form.class_name.trim(),
                class_teacher: form.class_teacher.trim(),
            })

            if (error) throw new Error(error.message)

            toast.success(`Student "${form.name}" added successfully! 🎉`)
            router.push('/admin/students')
        } catch (err: unknown) {
            const message = err instanceof Error ? err.message : 'An error occurred'
            toast.error(message)
        } finally {
            setLoading(false)
        }
    }

    const Section = ({ title, icon: Icon, children }: { title: string; icon: React.ElementType; children: React.ReactNode }) => (
        <div className="rounded-2xl p-6" style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 className="text-white font-semibold flex items-center gap-2 mb-5">
                <Icon size={18} className="text-indigo-400" />
                {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    )

    const Field = ({ label, id, type = 'text', value, onChange, placeholder, required, fullWidth }: {
        label: string; id: string; type?: string; value: string;
        onChange: (v: string) => void; placeholder?: string; required?: boolean; fullWidth?: boolean
    }) => (
        <div className={fullWidth ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={id}>{label}{required && ' *'}</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={e => onChange(e.target.value)}
                className="input-field"
                placeholder={placeholder}
                required={required}
            />
        </div>
    )

    return (
        <div className="page-enter max-w-3xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/students"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Add New Student
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Fill in all the student details below</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Student Info */}
                <Section title="Student Information" icon={User}>
                    <div className="sm:col-span-2">
                        <ImageUpload
                            label="Student Photo"
                            id="student-photo"
                            value={form.photo}
                            onChange={f => set('photo', f)}
                        />
                    </div>
                    <Field label="Student Name" id="student-name" value={form.name}
                        onChange={v => set('name', v)} placeholder="Full name" required />
                    <Field label="Class Name" id="class-name" value={form.class_name}
                        onChange={v => set('class_name', v)} placeholder="e.g. Grade 5-A" required />
                    <Field label="Class Teacher" id="class-teacher" value={form.class_teacher}
                        onChange={v => set('class_teacher', v)} placeholder="Teacher's name" fullWidth />
                    <Field label="Home Address" id="student-address" value={form.address}
                        onChange={v => set('address', v)} placeholder="Full home address" fullWidth />
                </Section>

                {/* Father Info */}
                <Section title="Father's Information" icon={Users}>
                    <div className="sm:col-span-2">
                        <ImageUpload
                            label="Father's Photo"
                            id="father-photo"
                            value={form.father_photo}
                            onChange={f => set('father_photo', f)}
                            compact
                        />
                    </div>
                    <Field label="Father's Name" id="father-name" value={form.father_name}
                        onChange={v => set('father_name', v)} placeholder="Father's full name" required />
                    <Field label="Father's Phone" id="father-phone" type="tel" value={form.father_phone}
                        onChange={v => set('father_phone', v)} placeholder="+91 98765 43210" required />
                </Section>

                {/* Mother Info */}
                <Section title="Mother's Information" icon={Users}>
                    <div className="sm:col-span-2">
                        <ImageUpload
                            label="Mother's Photo"
                            id="mother-photo"
                            value={form.mother_photo}
                            onChange={f => set('mother_photo', f)}
                            compact
                        />
                    </div>
                    <Field label="Mother's Name" id="mother-name" value={form.mother_name}
                        onChange={v => set('mother_name', v)} placeholder="Mother's full name" required />
                    <Field label="Mother's Phone" id="mother-phone" type="tel" value={form.mother_phone}
                        onChange={v => set('mother_phone', v)} placeholder="+91 98765 43210" required />
                </Section>

                {/* School Info */}
                <Section title="School Information" icon={School}>
                    <Field label="School Name" id="school-name" value={form.school_name}
                        onChange={v => set('school_name', v)} placeholder="Official school name" required />
                    <Field label="School Phone" id="school-phone" type="tel" value={form.school_phone}
                        onChange={v => set('school_phone', v)} placeholder="School contact number" />
                    <Field label="School Address" id="school-address" value={form.school_address}
                        onChange={v => set('school_address', v)} placeholder="School full address" fullWidth />
                </Section>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        id="save-student-btn"
                        disabled={loading}
                        className="btn-primary px-8 py-3 text-base"
                        style={{ opacity: loading ? 0.7 : 1 }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Student
                            </>
                        )}
                    </button>
                    <Link href="/admin/students"
                        className="px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}
