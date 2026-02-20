import { createClient } from '@/lib/supabase/server'
import { notFound } from 'next/navigation'
import type { Metadata } from 'next'
import TeacherProfileClient from './TeacherProfileClient'

interface Props {
    params: { id: string }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
    const supabase = createClient()
    const { data } = await supabase
        .from('teachers')
        .select('name, school_name, qualification')
        .eq('id', params.id)
        .single()
    return {
        title: data ? `${data.name} - Teacher ID | SchoolERP Pro` : 'Teacher Profile | SchoolERP Pro',
        description: data
            ? `Digital ID card for ${data.name}, ${data.qualification} at ${data.school_name}`
            : 'Teacher digital ID card',
    }
}

export default async function TeacherProfilePage({ params }: Props) {
    const supabase = createClient()
    const { data: teacher, error } = await supabase
        .from('teachers')
        .select('*')
        .eq('id', params.id)
        .single()

    if (error || !teacher) notFound()

    const joinedDate = new Date(teacher.created_at).toLocaleDateString('en-IN', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
    })

    return <TeacherProfileClient teacher={teacher} joinedDate={joinedDate} />
}
