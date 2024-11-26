'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import {
    Button,
    makeStyles,
    shorthands,
} from '@fluentui/react-components';
import { withTheme } from '@rjsf/core';
import { RJSFSchema, FormContextType } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';


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


const CreateClientPage: React.FC = () => {

    const Form = withTheme(FluentUIRCTheme);
    const styles = useStyles();
    const router = useRouter();
    const [schema, setSchema] = useState<RJSFSchema>({});

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
        <div className={styles.container}>
            <div>
                <h1>Create New Client</h1>
                <Form
                    schema={schema}
                    onSubmit={(data, e) => handleSubmit(data, e)}
                    validator={validator}
                // widgets={widgets}
                // uiSchema={uiSchema}
                />
                <Button onClick={() => router.push('/client')}>Cancel</Button>
            </div>
        </div>
    );
};

export default CreateClientPage; 