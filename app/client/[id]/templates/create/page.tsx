'use client';

import React, { useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
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
    state: string;
    status: string;
    template: string;
}

const CreateClientPage: React.FC = () => {
    const styles = useStyles();
    const router = useRouter();
    const params = useParams();
    const [formData, setFormData] = useState<FormData>({
        state: '',
        status: '',
        template: '',
    });
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validateForm = (): boolean => {
        const newErrors: Partial<FormData> = {};

        // if (!formData.state.trim()) {
        //     newErrors.state = 'state is required';
        // }
        // if (!formData.status.trim()) {
        //     newErrors.phone = 'Phone is required';
        // }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        try {
            const template = apiManager.createTemplate(Number(params.id), formData)

            // Redirect back to clients list after successful creation
            router.push(`/client/${params.id}/templates`);
        } catch (error) {
            console.error('Error creating client:', error);
            // Handle error (show error message to template)
        }
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear error when template starts typing
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
                        label="State"
                        required
                        validationState={errors.state ? "error" : "none"}
                        validationMessage={errors.state}
                    >
                        <Input
                            name="state"
                            value={formData.state}
                            onChange={handleChange}
                            placeholder="Enter state"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field
                        label="Status"
                        required
                        validationState={errors.status ? "error" : "none"}
                        validationMessage={errors.status}
                    >
                        <Input
                            name="status"
                            value={formData.status}
                            onChange={handleChange}
                            placeholder="Enter status"
                        />
                    </Field>
                </div>

                <div className={styles.field}>
                    <Field
                        label="Template"
                        required
                        validationState={errors.template ? "error" : "none"}
                        validationMessage={errors.template}
                    >
                        <Textarea
                            style={{ width: '100%' }}
                            name="template"
                            value={formData.template}
                            onChange={handleChange}
                            placeholder="Enter template"
                        />
                    </Field>
                </div>

                <div className={styles.actions}>
                    <Button
                        appearance="secondary"
                        onClick={() => router.push(`/client/${params.id}/templates`)}
                    >
                        Cancel
                    </Button>
                    <Button
                        appearance="primary"
                        type="submit"
                    >
                        Create template
                    </Button>
                </div>
            </form>
        </div>
    );
};

export default CreateClientPage; 