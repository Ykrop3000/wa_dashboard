'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { withTheme } from '@rjsf/core';
import { RJSFSchema, FormContextType, WidgetProps } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout';
import DynamicTextarea from '@/components/ui/fields/dynamic_text_area';
import { Card, MessageBar, MessageBarBody } from '@fluentui/react-components';

import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper';
import DescriptionFieldTemplateCustom from './templates/DescriptionFieldTemplateCustom';
import BaseInputTemplateCustom from './templates/BaseInputTemplateCustom';

const Create: React.FC<{
    title: string,
    getSchema: () => Promise<RJSFSchema>,
    onCreate: (data: FormContextType) => void,
    setFormData: (data: FormContextType) => void,
    formData: FormContextType,
    redirectOnCreate: string
}> = ({ title, getSchema, onCreate, setFormData, formData, redirectOnCreate }) => {
    const Form = withTheme(FluentUIRCTheme);
    const router = useRouter();
    const [schema, setSchema] = useState<RJSFSchema>({});
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const uiSchema = {
        "ui:options": { label: false },
        "green_api_data": {
            "items": {
                "id": {
                    "ui:widget": "hidden"
                }
            }
        },
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
                const schema = await getSchema();
                setSchema(schema);
            } catch (error) {
                console.error('Error fetching  schema:', error);
            }
        };
        fetchSchema();
    }, []);

    const handleSubmit = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessages([]); // Clear previous errors

        try {
            setFormData(data.formData)
            await onCreate(data.formData);
            router.push(redirectOnCreate);
        } catch (error) {
            console.error('Error creating:', error);
            if (Array.isArray(error)) {
                setErrorMessages(error.map((err) => `${err.location}: ${err.message}`));
            } else {
                setErrorMessages(['An unexpected error occurred. Please try again.']);
            }
        }
    };

    return (
        <BackButtonLayout title={title}>
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
                formData={formData}
                schema={schema}
                onSubmit={(data, e) => handleSubmit(data, e)}
                validator={validator}
                uiSchema={uiSchema}
                templates={{
                    ObjectFieldTemplate: ObjectFieldTemplateWrapper,
                    DescriptionFieldTemplate: DescriptionFieldTemplateCustom,
                    BaseInputTemplate: BaseInputTemplateCustom,
                }}
            />
        </BackButtonLayout>
    );
};

export default Create;
