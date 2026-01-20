'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

/**
 * Admin Index - Redirects to dashboard
 */
export default function AdminIndexPage() {
    const router = useRouter();

    useEffect(() => {
        router.push('/admin/dashboard');
    }, [router]);

    return (
        <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            color: 'rgba(255, 255, 255, 0.6)',
        }}>
            <p>Redirection vers le dashboard...</p>
        </div>
    );
}
