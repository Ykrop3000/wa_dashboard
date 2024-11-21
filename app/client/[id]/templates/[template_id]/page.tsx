'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';

import {
    Card,
    Text,
    Label,
    Spinner,
    makeStyles,
    Button,
} from '@fluentui/react-components';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'
import { Template } from '@/types/template';
import { apiManager } from '@/services';
import SwitchableInput from '@/components/ui/fields/editable_field'

const useStyles = makeStyles({

    section: {
        marginBottom: '20px',
        padding: '16px',
    },
    field: {
        display: 'grid',
        gridTemplateColumns: '200px 1fr',
        gap: '16px',
        marginBottom: '8px',
    },
    label: {
        fontWeight: 'bold',
    },
});

export default function TemplateDetail() {
    const styles = useStyles();
    const params = useParams();
    const [template, setTemplate] = useState<Partial<Template>>({});
    const [isEditing, setEditing] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchTemplate = async () => {
            try {
                const template = await apiManager.getTemplate(Number(params.template_id));
                setTemplate(template);
            } catch {
                setError('An error occurred while fetching template data');
            } finally {
                setLoading(false);
            }
        };

        fetchTemplate();
    }, [params.id]);

    const handleOnChangeField = (name: string, value: string | boolean | number) => {
        setTemplate(prevTemplate => ({
            ...prevTemplate,
            [name]: value
        }));
        console.log(template)
    }

    const handleSave = async () => {
        await apiManager.updateTemplate(Number(params.template_id), template);
        setEditing(false)
    }

    if (loading) return <Spinner />;
    if (error) return <Text color="red">{error}</Text>;
    if (!template) return <Text>Template not found</Text>;

    return (
        <BackButtonLayout title='Template detail'>
            <Button
                appearance="primary"
                onClick={() => setEditing(!isEditing)}
                style={{ marginBottom: '10px', marginRight: '10px' }}
            >
                Edit
            </Button>
            {isEditing &&
                <Button
                    appearance="primary"
                    onClick={handleSave}
                    style={{ marginBottom: '10px' }}
                >
                    Save
                </Button>
            }
            <Card className={styles.section}>
                <div className={styles.field}>
                    <Label className={styles.label}>State</Label>
                    <SwitchableInput
                        isEditing={isEditing}
                        initialValue={template.state || ''}
                        onChange={handleOnChangeField}
                        name='state'
                    />
                </div>
                <div className={styles.field}>
                    <Label className={styles.label}>Status</Label>
                    <SwitchableInput
                        isEditing={isEditing}
                        initialValue={template.status || ''}
                        onChange={handleOnChangeField}
                        name='status'
                    />
                </div>
            </Card>
            <Card>
                <div className={styles.field}>
                    <Label className={styles.label}>Template</Label>
                    <SwitchableInput
                        isEditing={isEditing}
                        initialValue={template.template || ''}
                        onChange={handleOnChangeField}
                        isTextarea={true}
                        name='template'
                    />
                </div>
            </Card>
        </BackButtonLayout>
    );
} 