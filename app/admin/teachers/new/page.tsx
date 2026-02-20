'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'
import { v4 as uuidv4 } from 'uuid'
import toast from 'react-hot-toast'
import ImageUpload from '@/components/ImageUpload'
import { TeacherFormData } from '@/types'
import {
    User,
    MapPin,
    School,
    Award,
    ArrowLeft,
    Save,
} from 'lucide-react'
import Link from 'next/link'

const initialForm: TeacherFormData = {
    name: '',
    photo: null,
    experience: '',
    qualification: '',
    school_name: '',
    address: '',
    school_address: '',
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

export default function AddTeacherPage() {
    const router = useRouter()
    const supabase = createClient()
    const [form, setForm] = useState<TeacherFormData>(initialForm)
    const [loading, setLoading] = useState(false)

    const set = (key: keyof TeacherFormData, value: string | File | null) => {
        setForm(prev => ({ ...prev, [key]: value }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.name.trim()) { toast.error('Teacher name is required'); return }
        if (!form.qualification.trim()) { toast.error('Qualification is required'); return }

        setLoading(true)
        const id = uuidv4()

        try {
            let photo_url: string | null = null
            if (form.photo) {
                photo_url = await uploadImage(supabase, form.photo, 'teacher-photos', `${id}/teacher.${form.photo.name.split('.').pop()}`)
            }

            const { error } = await supabase.from('teachers').insert({
                id,
                name: form.name.trim(),
                photo_url,
                experience: form.experience.trim(),
                qualification: form.qualification.trim(),
                school_name: form.school_name.trim(),
                address: form.address.trim(),
                school_address: form.school_address.trim(),
            })

            if (error) throw new Error(error.message)
            toast.success(`Teacher "${form.name}" added successfully! 🎉`)
            router.push('/admin/teachers')
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
                <Icon size={18} className="text-pink-400" />
                {title}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {children}
            </div>
        </div>
    )

    const Field = ({ label, id, value, onChange, placeholder, required, fullWidth }: {
        label: string; id: string; value: string;
        onChange: (v: string) => void; placeholder?: string; required?: boolean; fullWidth?: boolean
    }) => (
        <div className={fullWidth ? 'sm:col-span-2' : ''}>
            <label className="label" htmlFor={id}>{label}{required && ' *'}</label>
            <input
                id={id}
                type="text"
                value={value}
                onChange={e => onChange(e.target.value)}
                className="input-field"
                placeholder={placeholder}
                required={required}
            />
        </div>
    )

    return (
        <div className="page-enter max-w-2xl">
            {/* Header */}
            <div className="flex items-center gap-4 mb-8">
                <Link href="/admin/teachers"
                    className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10 transition-all">
                    <ArrowLeft size={20} />
                </Link>
                <div>
                    <h1 className="text-2xl font-bold text-white" style={{ fontFamily: 'Poppins, sans-serif' }}>
                        Add New Teacher
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">Fill in the teacher details below</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
                {/* Teacher Info */}
                <Section title="Teacher Information" icon={User}>
                    <div className="sm:col-span-2">
                        <ImageUpload
                            label="Teacher Photo"
                            id="teacher-photo"
                            value={form.photo}
                            onChange={f => set('photo', f)}
                        />
                    </div>
                    <Field label="Teacher Name" id="teacher-name" value={form.name}
                        onChange={v => set('name', v)} placeholder="Full name" required />
                    <Field label="Qualification" id="qualification" value={form.qualification}
                        onChange={v => set('qualification', v)} placeholder="e.g. B.Ed, M.Sc" required />
                    <Field label="Teaching Experience" id="experience" value={form.experience}
                        onChange={v => set('experience', v)} placeholder="e.g. 8 Years" />
                    <Field label="Home Address" id="teacher-address" value={form.address}
                        onChange={v => set('address', v)} placeholder="Teacher's home address" fullWidth />
                </Section>

                {/* School Info */}
                <Section title="School Information" icon={School}>
                    <Field label="School Name" id="school-name" value={form.school_name}
                        onChange={v => set('school_name', v)} placeholder="Official school name" required />
                    <Field label="School Address" id="school-address" value={form.school_address}
                        onChange={v => set('school_address', v)} placeholder="School full address" fullWidth />
                </Section>

                {/* Submit */}
                <div className="flex items-center gap-4">
                    <button
                        type="submit"
                        id="save-teacher-btn"
                        disabled={loading}
                        className="btn-primary px-8 py-3 text-base"
                        style={{
                            background: loading ? '#374151' : 'linear-gradient(135deg, #ec4899, #f43f5e)',
                            opacity: loading ? 0.7 : 1
                        }}
                    >
                        {loading ? (
                            <>
                                <div className="spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
                                Saving...
                            </>
                        ) : (
                            <>
                                <Save size={18} />
                                Save Teacher
                            </>
                        )}
                    </button>
                    <Link href="/admin/teachers"
                        className="px-6 py-3 rounded-xl text-slate-400 hover:text-white transition-colors text-sm font-medium">
                        Cancel
                    </Link>
                </div>
            </form>
        </div>
    )
}
