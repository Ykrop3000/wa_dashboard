'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Button,
    Input,
    Field,
    Card,
    Label,
    Textarea,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';

import { apiManager } from '@/services'

const useStyles = makeStyles({
    container: {
        maxWidth: '600px',
        margin: '0 auto',
        ...shorthands.padding('20px'),
    },
    form: {
        display: 'flex',
        flexDirection: 'column',
        gap: '20px',
    },
    header: {
        fontSize: '24px',
        fontWeight: '600',
        marginBottom: '20px',
    },
    actions: {
        display: 'flex',
        justifyContent: 'flex-end',
        gap: '12px',
        marginTop: '20px',
    },
    field: {
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
    }
});

interface FormData {
    name: string;
    phone: string;
    username: string;
    role: string;
    kaspi_username?: string;
    kaspi_password?: string;
    kaspi_api_key?: string;
    green_api_instance_id?: string;
    green_api_instance_token?: string;
    green_api_url?: string;
    green_api_media_url?: string;
}

const CreateClientPage: React.FC = () => {
    const styles = useStyles();
    const router = useRouter();
    const [formData, setFormData] = useState<FormData>({
        name: '',
        phone: '',
        username: '',
        role: 'user',
        kaspi_username: '',
        kaspi_password: '',
        kaspi_api_key: '',
        green_api_instance_id: '',
        green_api_instance_token: '',
        green_api_url: '',
        green_api_media_url: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        if (!formData.name.trim()) {
            newErrors.name = 'Name is required';
        }
        if (!formData.phone.trim()) {
            newErrors.phone = 'Phone is required';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const user = apiManager.createUser(formData)

            // Redirect back to clients list after successful creation
            router.push('/client');
        } catch (error) {
            console.error('Error creating client:', error);
            // Handle error (show error message to user)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when user starts typing
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({
                ...prev,
                [name]: undefined
            }));
        }
    };

    return (
        <div className={styles.container}>
            <h1 className={styles.header}>Create New Client</h1>

            <form onSubmit={handleSubmit} className={styles.form}>
                <div className={styles.field}>
                    <Field
                        label="Name"
                        required
                        validationState={errors.name ? "error" : "none"}
                        validationMessage={errors.name}
                    >
                        <Input
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="Enter client name"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field
                        label="Phone"
                        required
                        validationState={errors.phone ? "error" : "none"}
                        validationMessage={errors.phone}
                    >
                        <Input
                            name="phone"
                            value={formData.phone}
                            onChange={handleChange}
                            placeholder="Enter phone number"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field
                        label="Username"
                        required
                        validationState={errors.username ? "error" : "none"}
                        validationMessage={errors.username}
                    >
                        <Input
                            name="username"
                            value={formData.username}
                            onChange={handleChange}
                            placeholder="Enter username"
                        />
                    </Field>
                </div>

                {/* Kaspi Fields */}
                <div className={styles.field}>
                    <Field label="Kaspi Username">
                        <Input
                            name="kaspi_username"
                            value={formData.kaspi_username}
                            onChange={handleChange}
                            placeholder="Enter Kaspi username"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field label="Kaspi Password">
                        <Input
                            name="kaspi_password"
                            value={formData.kaspi_password}
                            onChange={handleChange}
                            placeholder="Enter Kaspi password"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field label="Kaspi API Key">
                        <Input
                            name="kaspi_api_key"
                            value={formData.kaspi_api_key}
                            onChange={handleChange}
                            placeholder="Enter Kaspi API key"
                        />
                    </Field>
                </div>

                {/* Green API Fields */}
                <div className={styles.field}>
                    <Field label="Green API Instance ID">
                        <Input
                            name="green_api_instance_id"
                            value={formData.green_api_instance_id}
                            onChange={handleChange}
                            placeholder="Enter Green API Instance ID"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field label="Green API Instance Token">
                        <Input
                            name="green_api_instance_token"
                            value={formData.green_api_instance_token}
                            onChange={handleChange}
                            placeholder="Enter Green API Instance Token"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field label="Green API URL">
                        <Input
                            name="green_api_url"
                            value={formData.green_api_url}
                            onChange={handleChange}
                            placeholder="Enter Green API URL"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field label="Green API Media URL">
                        <Input
                            name="green_api_media_url"
                            value={formData.green_api_media_url}
                            onChange={handleChange}
                            placeholder="Enter Green API Media URL"
                        />
                    </Field>
                </div>

                <div className={styles.actions}>
                    <Button
                        appearance="secondary"
                        onClick={() => router.push('/client')}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        type="submit"
                    >
                        Create Client
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateClientPage; 