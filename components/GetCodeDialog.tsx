'use client';

import {
    Dialog,
    DialogTrigger,
    DialogSurface,
    DialogTitle,
    DialogBody,
    DialogActions,
    DialogContent,
    Button,
    Spinner,
    Text
} from "@fluentui/react-components";

import { apiManager } from "@/services";
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog'
import { useState } from 'react';

const GetCodeDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
    id: number
}> = ({ open, onOpenChange, id }) => {
    const [code, setCode] = useState<string | undefined>()

    const getCode = async () => {
        try {
            const code = await apiManager.getCode(id)
            setCode(code)
        } catch (error) {
            console.log("Error bind whatsapp:", error)
        }
    }

    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Код:</DialogTitle>
                    <DialogContent>
                        {!code && <Spinner />}
                        <Text size={600}>{code}</Text>
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Закрыть</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={getCode}>Получить код</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default GetCodeDialog;