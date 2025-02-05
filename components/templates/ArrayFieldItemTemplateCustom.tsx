import { useState, useEffect } from 'react';

import { ArrayFieldTemplateItemType, FormContextType, RJSFSchema, StrictRJSFSchema } from '@rjsf/utils';
import { Button, Spinner, DialogContent, DialogTitle, DialogBody, DialogSurface, Dialog } from '@fluentui/react-components';
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog'

import GetCodeDialog from '@/components/GetCodeDialog'
import GetQrDialog from '@/components/GetQrDialog';
import { apiManager } from '@/services'


const CreateInstanceDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
}> = ({ open, onOpenChange }) => {
    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Создание инстанса...</DialogTitle>
                    <DialogContent>
                        <Spinner />
                    </DialogContent>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default function ArrayFieldItemTemplate<
    T = any,
    S extends StrictRJSFSchema = RJSFSchema,
    F extends FormContextType = any
>(props: ArrayFieldTemplateItemType<T, S, F>) {
    const {
        children,
        disabled,
        hasToolbar,
        hasCopy,
        hasMoveDown,
        hasMoveUp,
        hasRemove,
        index,
        onCopyIndexClick,
        onDropIndexClick,
        onReorderClick,
        readonly,
        uiSchema,
        registry,
    } = props;
    const { CopyButton, MoveDownButton, MoveUpButton, RemoveButton } = registry.templates.ButtonTemplates;
    const [instanceDilogOpen, setInstanceDialogOpen] = useState<boolean>(false);
    const [createInstanceTaskId, setCreateInstanceTaskId] = useState<string>()
    const [codeDialogOpen, setCodeDialogOpen] = useState<boolean>(false);
    const [qrDialogOpen, setQrDialogOpen] = useState<boolean>(false);

    const isGreenApiData = props.children.props.schema.title == "GreenApiData"

    useEffect(() => {
        let intervalId: NodeJS.Timeout;

        if (createInstanceTaskId) {
            intervalId = setInterval(async () => {
                try {
                    const taskStatus = await apiManager.getTaskStatus(createInstanceTaskId);
                    if (taskStatus.status === 'SUCCESS') {
                        setInstanceDialogOpen(false);
                        setCreateInstanceTaskId(undefined);
                    } else if (taskStatus.status === 'PENDING') {
                        setInstanceDialogOpen(false);
                        setCreateInstanceTaskId(undefined);
                    }
                } catch (error) {
                    console.error('Error checking task status:', error);
                }
            }, 2000);
        }

        return () => {
            if (intervalId) {
                clearInterval(intervalId);
            }
        };
    }, [createInstanceTaskId]);

    const bindWhatsapp = async () => {
        try {
            setInstanceDialogOpen(true);
            const taskId = await apiManager.bindWhatsapp(props.children.props.formData.id);
            setCreateInstanceTaskId(taskId);
        } catch (error) {
            console.log("Error bind whatsapp:", error)
        }
    }


    return (
        <>
            {isGreenApiData && (
                <>
                    <CreateInstanceDialog open={instanceDilogOpen} onOpenChange={(e, data) => setInstanceDialogOpen(data.open)} />
                    <GetQrDialog open={qrDialogOpen} onOpenChange={(e, data) => setQrDialogOpen(data.open)} id={props.children.props.formData.id} />
                    <GetCodeDialog open={codeDialogOpen} onOpenChange={(e, data) => setCodeDialogOpen(data.open)} id={props.children.props.formData.id} />
                </>
            )}

            <div className='ms-Grid' dir='ltr'>
                <div className='ms-Grid-row'>
                    <div className='ms-Grid-col ms-sm6 ms-md8 ms-lg9'>
                        <div className='ms-Grid-row'>{children}</div>
                    </div>
                    {hasToolbar && (
                        <div
                            className='ms-Grid-col ms-sm6 ms-md4 ms-lg3'
                            style={{ textAlign: 'right', display: "flex", gap: "8px", paddingTop: "8px", justifyContent: "flex-end" }}
                        >
                            {(hasMoveUp || hasMoveDown) && (
                                <MoveUpButton
                                    disabled={disabled || readonly || !hasMoveUp}
                                    onClick={onReorderClick(index, index - 1)}
                                    uiSchema={uiSchema}
                                    registry={registry}
                                />
                            )}
                            {(hasMoveUp || hasMoveDown) && (
                                <MoveDownButton
                                    disabled={disabled || readonly || !hasMoveDown}
                                    onClick={onReorderClick(index, index + 1)}
                                    uiSchema={uiSchema}
                                    registry={registry}
                                />
                            )}
                            {hasCopy && (
                                <CopyButton
                                    disabled={disabled || readonly}
                                    onClick={onCopyIndexClick(index)}
                                    uiSchema={uiSchema}
                                    registry={registry}
                                />
                            )}
                            {!props.children.props.formData?.green_api_instance_id && isGreenApiData && (
                                <Button
                                    aria-label="Create whatsapp instance"
                                    onClick={bindWhatsapp}
                                >
                                    Create whatsapp instance
                                </Button>
                            )}
                            {props.children.props.formData?.green_api_instance_id && isGreenApiData && (
                                <>
                                    <Button onClick={() => setCodeDialogOpen(true)}>
                                        Получить код
                                    </Button>
                                    <Button onClick={() => setQrDialogOpen(true)}>
                                        Получить qr код
                                    </Button>
                                </>
                            )
                            }
                            {hasRemove && (
                                <RemoveButton
                                    disabled={disabled || readonly}
                                    onClick={onDropIndexClick(index)}
                                    uiSchema={uiSchema}
                                    registry={registry}
                                />
                            )}
                        </div>
                    )}
                </div>
            </div>
        </>
    );
}