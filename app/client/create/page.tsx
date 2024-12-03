'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { withTheme } from '@rjsf/core';
import { RJSFSchema, FormContextType } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';


import { apiManager } from '@/services'
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper';
import BackButtonLayout from '@/components/ui/layouts/back_button_layout'


const CreateClientPage: React.FC = () => {

    const Form = withTheme(FluentUIRCTheme);
    const router = useRouter();
    const [schema, setSchema] = useState<RJSFSchema>({});

    const uiSchema = {
        "ui:options": { label: false }
    }

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

    const handleSubmit = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault();
        try {
            await apiManager.createUser(data.formData);
            router.push('/client');
        } catch (error) {
            console.error('Error creating client:', error);
        }
    };


    return (
        <BackButtonLayout title="Create user">
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

export default CreateClientPage; 