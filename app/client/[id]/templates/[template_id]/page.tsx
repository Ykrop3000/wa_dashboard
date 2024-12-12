'use client';

import { createRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import {
    Text,
    Spinner,
    Button,
} from '@fluentui/react-components';

import { withTheme } from '@rjsf/core';
import Form from '@rjsf/core';
import { RJSFSchema, FormContextType, WidgetProps } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'
import { User } from '@/types/user';
import { apiManager } from '@/services';
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper'
import DynamicTextarea from '@/components/ui/fields/dynamic_text_area';

export default function TemplateDetail() {
    const params = useParams();
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
        "template": {
            "ui:widget": (props: WidgetProps) => {
                const { value = "", onChange, label, readonly, required } = props;

                return <DynamicTextarea
                    value={value}
                    onChange={onChange}
                    label={label}
                    readonly={readonly}
                    required={required} />;
            },
        }
    };


    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const schema = await apiManager.getTemplateSchema();
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
                const user = await apiManager.getTemplate(Number(params.template_id));
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
            await apiManager.updateTemplate(Number(params.template_id), data.formData);
            setEditing(false)
            setUser(data.formData)
        } catch (error) {
            console.error('Error update client:', error);
        }

    }

    if (error) return <Text color="red">{error}</Text>;
    if (!user) return <Text>User not found</Text>;

    return (
        <BackButtonLayout title='Template detail'>
            {loading && <Spinner />}
            {!loading && <>
                <Button
                    appearance="primary"
                    onClick={() => setEditing(!isEditing)}
                    style={{ marginBottom: '10px', marginRight: '10px' }}
                >
                    Edit
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