'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { withTheme } from '@rjsf/core';
import { RJSFSchema, FormContextType, WidgetProps } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import { apiManager } from '@/services';
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import DynamicTextarea from '@/components/ui/fields/dynamic_text_area';
import { Card, MessageBar, MessageBarBody } from '@fluentui/react-components';

const CreateTemplatePage: React.FC = () => {
    const Form = withTheme(FluentUIRCTheme);
    const router = useRouter();
    const params = useParams();
    const [schema, setSchema] = useState<RJSFSchema>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const uiSchema = {
        "ui:options": { label: false },
        "template": {
            "ui:widget": (props: WidgetProps) => {
                const { value = "", onChange, label, readonly, required } = props;

                return (
                    <DynamicTextarea
                        value={value}
                        onChange={onChange}
                        label={label}
                        readonly={readonly}
                        required={required}
                    />
                );
            },
        },
    };

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const schema = await apiManager.getTemplateSchema();
                setSchema(schema);
            } catch (error) {
                console.error('Error fetching template schema:', error);
            }
        };
        fetchSchema();
    }, []);

    const handleSubmit = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessages([]); // Clear previous errors

        try {
            await apiManager.createTemplate(Number(params.id), data.formData);
            router.push(`/client/${params.id}/templates`);
        } catch (error) {
            console.error('Error creating template:', error);
            if (Array.isArray(error)) {
                setErrorMessages(error.map((err) => `${err.location}: ${err.message}`));
            } else {
                setErrorMessages(['An unexpected error occurred. Please try again.']);
            }
        }
    };

    return (
        <BackButtonLayout title="Create template">
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
                schema={schema}
                onSubmit={(data, e) => handleSubmit(data, e)}
                validator={validator}
                uiSchema={uiSchema}
                templates={{
                    ObjectFieldTemplate: ObjectFieldTemplateWrapper,
                }}
            />
        </BackButtonLayout>
    );
};

export default CreateTemplatePage;
