import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import StudentProfileClient from './StudentProfileClient'

interface Props {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = createClient()
    const { data } = await supabase
        .from('students')
        .select('name, school_name, class_name')
        .eq('id', params.id)
        .single()
    return {
        title: data ? `${data.name} - Student ID | SchoolERP Pro` : 'Student Profile | SchoolERP Pro',
        description: data
            ? `Digital ID card for ${data.name}, ${data.class_name} student at ${data.school_name}`
            : 'Student digital ID card',
    }
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
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return <StudentProfileClient student={student} joinedDate={joinedDate} />
}
