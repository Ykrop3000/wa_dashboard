'use client';

import { useParams } from 'next/navigation'
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

import { apiManager } from "@/services";
import { DialogOpenChangeEventHandler } from '@fluentui/react-dialog'
import { useState } from 'react';

const GetCodeDialog: React.FC<{
    open: boolean | undefined;
    onOpenChange: DialogOpenChangeEventHandler;
}> = ({ open, onOpenChange }) => {
    const params = useParams();
    const [code, setCode] = useState<string>('')

    const getCode = async () => {
        setCode('Fetching code...')
        try {
            const code = await apiManager.getCode(Number(params.id))
            setCode(code)
        } catch (error) {
            console.log("Error bind whatsapp:", error)
        }
    }

    return (
        <Dialog surfaceMotion={null} open={open} onOpenChange={onOpenChange}>
            <DialogSurface>
                <DialogBody>
                    <DialogTitle>Code:</DialogTitle>
                    <DialogContent>
                        {code}
                    </DialogContent>
                    <DialogActions>
                        <DialogTrigger disableButtonEnhancement>
                            <Button appearance="secondary">Close</Button>
                        </DialogTrigger>
                        <Button appearance="primary" onClick={getCode}>Get code</Button>
                    </DialogActions>
                </DialogBody>
            </DialogSurface>
        </Dialog>
    );
};

export default GetCodeDialog;