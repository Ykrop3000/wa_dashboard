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
import { RJSFSchema, WidgetProps } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'
import { apiManager } from '@/services';
import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper'
import DynamicTextarea from '@/components/ui/fields/dynamic_text_area';
import { OrdersGroup } from '@/types/orders_group';

export default function TemplateDetail() {
    const params = useParams();
    const router = useRouter();
    const [ordersGroup, setOrdersGroup] = useState<Partial<OrdersGroup>>({});
    // const [isEditing, setEditing] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    // const [errorMessages, setErrorMessages] = useState<string[]>([]);

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
                const schema = await apiManager.getOrdersGroupSchema();
                setSchema(schema);
            } catch (error) {
                console.error('Error creating client:', error);
            }
        };
        fetchSchema();
    }, [setSchema]);

    useEffect(() => {
        const fetchOrdersGroup = async () => {
            try {
                const orders_group = await apiManager.getOrdersGroup(Number(params.orders_group_id));
                setOrdersGroup(orders_group);
            } catch (error) {
                console.error('Error fetch orders group:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrdersGroup();
    }, [params.id]);


    // const handleSave = async (data: FormContextType, e: React.FormEvent) => {
    //     e.preventDefault()
    //     try {
    //         await apiManager.updateTemplate(Number(params.template_id), data.formData);
    //         setEditing(false)
    //         setTemplate(data.formData)
    //     } catch (error) {
    //         console.error('Error updating template:', error);
    //         if (Array.isArray(error)) {
    //             setErrorMessages(error.map((err) => `${err.location}: ${err.message}`));
    //         } else {
    //             setErrorMessages(['An unexpected error occurred. Please try again.']);
    //         }
    //     }

    // }

    if (!ordersGroup) return <Text>Template not found</Text>;

    return (
        <BackButtonLayout title='Orders group detail'>
            <Button
                appearance="primary"
                onClick={() => router.push(`/client/${params.id}/orders?group=${params.orders_group_id}`)}
                style={{ marginBottom: '10px', marginRight: '10px' }}
            >
                Orders
            </Button>
            <Button
                appearance="primary"
                onClick={() => router.push(`/client/${params.id}/orders?group=${params.orders_group_id}`)}
                style={{ marginBottom: '10px', marginRight: '10px' }}
            >
                Send Orders
            </Button>
            {loading && <Spinner />}
            {!loading && <>
                <Form
                    formData={ordersGroup}
                    readonly={!false}
                    schema={schema}
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