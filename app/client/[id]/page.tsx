'use client';

import { createRef, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

import {
    Text,
    Spinner,
    Button,
} from '@fluentui/react-components';

import { withTheme } from '@rjsf/core';
import Form from '@rjsf/core';
import { RJSFSchema, FormContextType } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'
import { User } from '@/types/user';
import { apiManager } from '@/services';
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper'

export default function UserDetail() {
    const params = useParams();
    const router = useRouter();
    const [user, setUser] = useState<Partial<User>>({});
    const [isEditing, setEditing] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const Form = withTheme(FluentUIRCTheme);
    const [schema, setSchema] = useState<RJSFSchema>({});
    const formRef = createRef<Form>();


    const uiSchema = {
        "ui:options": { label: false },
        "ui:submitButtonOptions": { norender: true },
    };

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const schema = await apiManager.getUserSchema();
                setSchema(schema);
            } catch (error) {
                console.error('Error creating client:', error);
            }
        };
        fetchSchema();
    }, [setSchema]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const user = await apiManager.getUser(Number(params.id));
                setUser(user);
            } catch {
                setError('An error occurred while fetching user data');
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);


    const handleSave = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiManager.updateUser(Number(params.id), data.formData);
            setEditing(false)
            setUser(data.formData)
        } catch (error) {
            console.error('Error update client:', error);
        }

    }

    if (error) return <Text color="red">{error}</Text>;
    if (!user) return <Text>User not found</Text>;

    return (
        <BackButtonLayout title='Client detail'>
            {loading && <Spinner />}
            {!loading && <>
                <Button
                    appearance="primary"
                    onClick={() => setEditing(!isEditing)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Edit
                </Button>
                <Button
                    appearance="secondary"
                    onClick={() => router.push(`/client/${params.id}/orders`)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Orders
                </Button>
                <Button
                    appearance="secondary"
                    onClick={() => router.push(`/client/${params.id}/templates`)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Templates
                </Button>
                <Button
                    appearance="secondary"
                    onClick={() => router.push(`/client/${params.id}/period_notification`)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Create period notification
                </Button>
                {isEditing &&
                    <Button
                        type='submit'
                        appearance="primary"
                        onClick={() => formRef.current?.submit()}
                        style={{ marginBottom: '10px' }}
                    >
                        Save
                    </Button>
                }
                <Form
                    formData={user}
                    readonly={!isEditing}
                    schema={schema}
                    onSubmit={handleSave}
                    // onChange={handleOnChange}
                    validator={validator}
                    // widgets={!isEditing ? widgets : {}}
                    ref={formRef}
                    noValidate={true}
                    uiSchema={uiSchema}
                    templates={{
                        ObjectFieldTemplate: ObjectFieldTemplateWrapper
                    }}
                />
            </>}
        </BackButtonLayout>
    );
} 