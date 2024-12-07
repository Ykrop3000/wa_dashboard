'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { withTheme } from '@rjsf/core';
import { RJSFSchema, FormContextType } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';


import { apiManager } from '@/services'
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout'


const CreateTemplatePage: React.FC = () => {

    const Form = withTheme(FluentUIRCTheme);
    const router = useRouter();
    const params = useParams()
    const [schema, setSchema] = useState<RJSFSchema>({});

    const uiSchema = {
        "ui:options": { label: false },
        "template": { "ui:widget": "textarea" }
    }

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const schema = await apiManager.getTemplateSchema();
                setSchema(schema);
            } catch (error) {
                console.error('Error creating template:', error);
            }
        };
        fetchSchema();
    }, [setSchema]);

    const handleSubmit = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiManager.createTemplate(Number(params.id), data.formData);
            router.push(`/client/${params.id}/templates`);
        } catch (error) {
            console.error('Error creating template:', error);
        }
    };


    return (
        <BackButtonLayout title='Create template'>
            <Form
                schema={schema}
                onSubmit={(data, e) => handleSubmit(data, e)}
                validator={validator}
                // widgets={widgets}
                uiSchema={uiSchema}
                templates={{
                    ObjectFieldTemplate: ObjectFieldTemplateWrapper
                }}
            />
        </BackButtonLayout>
    );
};

export default CreateTemplatePage; 