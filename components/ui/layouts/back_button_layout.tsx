'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import {
    Card,
    CardHeader,
    Text,
    Label,
    Spinner,
    makeStyles,
    Button,
} from '@fluentui/react-components';
import { ArrowLeftRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    container: {
        padding: '20px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        display: 'flex',
        alignItems: 'center',
        marginBottom: '20px',
        gap: '16px',
    },
    backButton: {
        minWidth: 'auto',
        padding: '8px',
    },
});

export default function BackButtonLayout({ children, title
}: {
    children: React.ReactNode,
    title: String
}) {
    const styles = useStyles();
    const params = useParams();
    const router = useRouter();

    return (
        <div className={styles.container}>
            <div className={styles.header}>
                <Button
                    appearance="subtle"
                    icon={<ArrowLeftRegular />}
                    className={styles.backButton}
                    onClick={() => router.back()}
                />
                <Text size={600} weight="semibold">{title}</Text>
            </div>

            {children}
        </div>
    );
}