'use client';

import { useRouter } from 'next/navigation';
import {
    Text,
    makeStyles,
    Button,
} from '@fluentui/react-components';
import { ArrowLeftRegular } from '@fluentui/react-icons';

const useStyles = makeStyles({
    container: {
        padding: '20px',
        maxWidth: '900px',
        margin: '0 auto',
        '@media (max-width: 600px)': {
            paddingLeft: 0,
            paddingRight: 0
        },
    },
    header: {
        justifyContent: "flex-start",
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

export default function BackButtonLayout({ children, title, additionalChildren
}: {
    children: React.ReactNode,
    title: string
    additionalChildren?: React.ReactNode | React.JSX.Element,
}) {
    const styles = useStyles();
    const router = useRouter();

    return (
        <div className={styles.container} style={additionalChildren ? { display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px" } : {}}>
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
            {additionalChildren}
        </div>
    );
}