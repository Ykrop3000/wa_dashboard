'use client';

import { createRef, useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import {
    Text,
    Spinner,
    Button,
    Card,
    MessageBarBody,
    MessageBar,
} from '@fluentui/react-components';

import { withTheme } from '@rjsf/core';
import Form from '@rjsf/core';
import { RJSFSchema, FormContextType, WidgetProps } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'
import { apiManager } from '@/services';
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper'
import DynamicTextarea from '@/components/ui/fields/dynamic_text_area';
import { Template } from '@/types/template';

export default function TemplateDetail() {
    const params = useParams();
    const [template, setTemplate] = useState<Partial<Template>>({});
    const [isEditing, setEditing] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

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
        const fetchTemplate = async () => {
            try {
                const template = await apiManager.getTemplate(Number(params.template_id));
                setTemplate(template);
            } catch (error) {
                console.error('Error fetch template:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [params.id]);


    const handleSave = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault()
        try {
            await apiManager.updateTemplate(Number(params.template_id), data.formData);
            setEditing(false)
            setTemplate(data.formData)
        } catch (error) {
            console.error('Error updating template:', error);
            if (Array.isArray(error)) {
                setErrorMessages(error.map((err) => `${err.location}: ${err.message}`));
            } else {
                setErrorMessages(['An unexpected error occurred. Please try again.']);
            }
        }

    }

    if (!template) return <Text>Template not found</Text>;

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
                {errorMessages.length > 0 && (
                    <Card
                        appearance="outline"
                        className="error-alert"
                    >
                        {errorMessages.map((msg, index) => (
                            <MessageBar key={index} intent={'error'}>
                                <MessageBarBody>
                                    {msg}
                                </MessageBarBody>
                            </MessageBar>
                        ))}
                    </Card>
                )}
                <Form
                    formData={template}
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