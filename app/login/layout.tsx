import type { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Admin Login - SchoolERP Pro',
    description: 'Secure admin login for SchoolERP Pro management system',
}

export default function LoginLayout({ children }: { children: React.ReactNode }) {
    return children
}
