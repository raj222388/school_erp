export interface Student {
    id: string
    name: string
    photo_url: string | null
    father_name: string
    father_photo: string | null
    mother_name: string
    mother_photo: string | null
    father_phone: string
    mother_phone: string
    address: string
    school_name: string
    school_phone: string
    school_address: string
    class_name: string
    class_teacher: string
    created_at: string
}

export interface Teacher {
    id: string
    name: string
    photo_url: string | null
    experience: string
    qualification: string
    school_name: string
    address: string
    school_address: string
    created_at: string
}

export interface Admin {
    id: string
    email: string
    created_at: string
}

export interface StudentFormData {
    name: string
    photo: File | null
    father_name: string
    father_photo: File | null
    mother_name: string
    mother_photo: File | null
    father_phone: string
    mother_phone: string
    address: string
    school_name: string
    school_phone: string
    school_address: string
    class_name: string
    class_teacher: string
}

export interface TeacherFormData {
    name: string
    photo: File | null
    experience: string
    qualification: string
    school_name: string
    address: string
    school_address: string
}
