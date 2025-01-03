'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button, Input, Card, CardHeader, Label, Text } from '@fluentui/react-components';
import { makeStyles } from '@fluentui/react-components'; // Import makeStyles
import { useAuth } from '@/context/AuthContext'; // Import useAuth

const useStyles = makeStyles({
    container: {
        display: 'flex',
        justifyContent: 'center',
        margin: '20px',
    },
    card: {
        padding: '20px', // Optional: Add padding to the card
    },
    field: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        gap: '8px',
        marginBottom: '8px',
    },
});

const Login: React.FC = () => {
    const classes = useStyles(); // Use the styles
    const router = useRouter();
    const { login } = useAuth(); // Get login function from context
    const [username, setUsername] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        try {
            await login(username, password); // Use the login function from context
            // After successful login, redirect based on user role
            const user = await login(username, password);
            if (user.role === 'admin') {
                router.push('/client');
            } else {
                router.push('/dashboard');
            }
        } catch (err: unknown) {
            if (typeof err === 'object' && err !== null && 'message' in err) {
                setError((err as { message: string }).message || 'Login failed');
            } else {
                setError('Login failed');
            }
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        const role = localStorage.getItem('role');

        if (token && role === 'admin') {
            router.push('/client');
        }
    }, []);

    return (
        <div className={classes.container}>
            <Card className={classes.card}>
                <CardHeader header={<Text size={500}>Вход</Text>} />
                <form onSubmit={handleLogin}>
                    <div className={classes.field}>
                        <Label htmlFor="username">Имя пользователя:</Label>
                        <Input
                            type="text"
                            id="username"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                        />
                    </div>
                    <div className={classes.field}>
                        <Label htmlFor="password">Пароль:</Label>
                        <Input
                            type="password"
                            id="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                        />
                    </div>
                    {error && <p style={{ color: 'red' }}>{error}</p>}
                    <Button appearance="primary" type="submit" disabled={loading}>
                        {loading ? 'Вход...' : 'Войти'}
                    </Button>
                </form>
            </Card>
        </div>
    );
};

export default Login; 