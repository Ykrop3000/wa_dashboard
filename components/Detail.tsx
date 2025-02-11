'use client';

import React, { createRef, useEffect, useRef, useState } from 'react';
import { useParams } from 'next/navigation';

import {
    Text,
    Spinner,
    ToolbarButton,
    Toolbar,
    Card,
    MessageBarBody,
    MessageBar,
} from '@fluentui/react-components';
import { Edit12Regular, Delete12Regular } from "@fluentui/react-icons"

import { withTheme } from '@rjsf/core';
import Form from '@rjsf/core';
import { RJSFSchema, FormContextType, WidgetProps, ArrayFieldTemplateItemType } from '@rjsf/utils';
import { Theme as FluentUIRCTheme } from '@rjsf/fluentui-rc';
import validator from '@rjsf/validator-ajv8';

import BackButtonLayout from '@/components/ui/layouts/back_button_layout'

import ObjectFieldTemplateWrapper from '@/components/templates/ObjectFieldTemplateWrapper'
import DescriptionFieldTemplateCustom from '@/components/templates/DescriptionFieldTemplateCustom'
import TemplateTextarea from './ui/fields/template_text_area';
import BaseInputTemplateCustom from '@/components/templates/BaseInputTemplateCustom'
import JsonDataPicker from '@/components/JsonDataPicker'

import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
} from "@fluentui/react-components";
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog'


const RemoveDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
    handleRemove: () => void;
}> = ({ open, onOpenChange, handleRemove }) => {
    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Подтвердить удаление</DialogTitle>
                    <DialogContent>
                        Вы уверены, что хотите удалить этот элемент? Это действие не может быть отменено.
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Закрыть</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={handleRemove}>Удалить</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};


const Detail: React.FC<{
    title: string,
    getSchema: () => Promise<RJSFSchema>,
    getFormData: () => Promise<RJSFSchema>,
    setFormData: (data: FormContextType) => void,
    handleRemove: () => void,
    handleUpdate: (data: FormContextType) => void,
    formData: FormContextType,
    toolbar?: React.ReactNode,
    arrayFieldItemTemplate?: (props: ArrayFieldTemplateItemType) => React.ReactNode
}> = ({ title, getSchema, getFormData, setFormData, handleRemove, handleUpdate, formData, toolbar, arrayFieldItemTemplate }) => {
    const params = useParams();
    const [isEditing, setEditing] = useState<boolean>(false)
    const [jsonPickerMod, setJsonPickerMod] = useState<boolean>(false)
    const [removeDilogOpen, setRemoveDilogOpen] = useState<boolean>(false)
    const [loading, setLoading] = useState(true);
    const [errorMessages, setErrorMessages] = useState<string[]>([]);

    const Form = withTheme(FluentUIRCTheme);
    const [schema, setSchema] = useState<RJSFSchema>({});
    const formRef = createRef<Form>();
    const textareaRef = useRef<HTMLTextAreaElement>(null);


    const uiSchema = {
        "ui:options": { label: false },
        "ui:submitButtonOptions": { norender: true },
        "green_api_data": {
            "items": {
                "ui:title": 'Инстанс',
                "id": {
                    "ui:widget": "hidden"
                }
            }
        },
        "template": {
            "ui:widget": (props: WidgetProps) => {
                const { value = "", onChange, label, readonly, required } = props;
                return <TemplateTextarea
                    value={value}
                    onChange={onChange}
                    label={label}
                    textareaRef={textareaRef}
                    readonly={readonly}
                    required={required} />;
            },
        }
    };

    useEffect(() => {
        const fetchSchema = async () => {
            try {
                const schema = await getSchema();
                setSchema(schema);
            } catch (error) {
                console.error('Error fetching schema:', error);
            }
        };
        fetchSchema();
    }, [setSchema]);

    useEffect(() => {
        const fetchUser = async () => {
            try {
                const form_data = await getFormData();
                setFormData(form_data);
            } catch (error) {
                if (Array.isArray(error)) {
                    setErrorMessages(error.map((err) => `${err.location}: ${err.message}`));
                } else {
                    setErrorMessages(['An unexpected error occurred. Please try again.']);
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
    }, [params.id]);


    const handleSubmit = async (data: FormContextType, e: React.FormEvent) => {
        e.preventDefault()
        try {
            console.log(data.formData)
            setFormData(data.formData)
            await handleUpdate(data.formData);
            setEditing(false)
        } catch (error) {
            console.error('Error updating template:', error);
            if (Array.isArray(error)) {
                setErrorMessages(error.map((err) => `${err.location}: ${err.message}`));
            } else {
                setErrorMessages(['An unexpected error occurred. Please try again.']);
            }
            console.error('Error update:', error);
        }

    }

    const handleInsertText = (text: string) => {
        const textarea = textareaRef.current;
        if (textarea) {
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            const newValue = formData.template.substring(0, start) + text + formData.template.substring(end);
            setFormData({ ...formData, template: newValue });
            setTimeout(() => {
                textarea.setSelectionRange(start + text.length, start + text.length);
                textarea.focus();
            }, 0);
        }
    };
    const JsonDataPickerComponent = () => <JsonDataPicker onInsert={handleInsertText} />;

    console.log(schema)
    if (!formData) return <Text>not found</Text>;

    return (
        <>
            <RemoveDialog
                open={removeDilogOpen}
                onOpenChange={(e, data) => setRemoveDilogOpen(data.open)}
                handleRemove={async () => await handleRemove()}
            />

            <BackButtonLayout
                title={title}
                additionalChildren={jsonPickerMod ? <JsonDataPickerComponent /> : null}
            >
                {loading && <Spinner />}
                {!loading && <>
                    <Toolbar aria-label="toolbar">
                        {schema?.properties?.template &&
                            <ToolbarButton
                                aria-label="Template pro mod"
                                onClick={() => setJsonPickerMod(!jsonPickerMod)}
                                style={{ marginRight: "5px" }}
                            >
                                Template pro mod
                            </ToolbarButton>
                        }
                        <ToolbarButton
                            aria-label="Edit"
                            appearance="primary"
                            onClick={() => setEditing(!isEditing)}
                            icon={<Edit12Regular />}
                        />
                        <ToolbarButton
                            aria-label="Remove"
                            appearance="transparent"
                            onClick={() => setRemoveDilogOpen(true)}
                            icon={<Delete12Regular />}
                        />
                        {isEditing &&
                            <ToolbarButton
                                aria-label="Save"
                                appearance="primary"
                                onClick={() => formRef.current?.submit()}
                            >
                                Сохранить
                            </ToolbarButton>
                        }
                        {toolbar}

                    </Toolbar>
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
                        readonly={!isEditing}
                        schema={schema}
                        onSubmit={handleSubmit}
                        validator={validator}
                        ref={formRef}
                        noValidate={true}
                        uiSchema={uiSchema}
                        templates={{
                            ObjectFieldTemplate: ObjectFieldTemplateWrapper,
                            DescriptionFieldTemplate: DescriptionFieldTemplateCustom,
                            BaseInputTemplate: BaseInputTemplateCustom,
                            // FieldTemplate: FieldTemplateCustom,
                            // WrapIfAdditionalTemplate: WrapIfAdditionalTemplateCustom
                            ArrayFieldItemTemplate: arrayFieldItemTemplate
                        }}
                    />
                </>}
            </BackButtonLayout>
        </>
    );
}
export default Detail;