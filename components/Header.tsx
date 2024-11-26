'use client';

import React from 'react';
import { useAuth } from '@/context/AuthContext'; // Import useAuth
import { Button, Text } from '@fluentui/react-components';
import { useRouter } from 'next/navigation';

const Header: React.FC = () => {
    const { user, logout } = useAuth(); // Get user and logout function from context
    const router = useRouter();

    const handleLogout = () => {
        logout(); // Call the logout function
        router.push('/login'); // Redirect to login page after logout
    };

    return (
        <header style={{ display: 'flex', justifyContent: 'space-between', padding: '10px' }}>
            {user && (
                <>
                    <Text size={400}>{user.username}</Text>
                    <Button appearance="primary" onClick={handleLogout}>
                        Logout
                    </Button>
                </>
            )}
        </header>
    );
};

export default Header; 