import React from 'react';
import { WidgetProps } from '@rjsf/utils';
import { Text, Label, makeStyles } from '@fluentui/react-components'

const useStyles = makeStyles({
    field: {
        display: 'grid',
        gridTemplateColumns: '1fr',
        // gap: '16px',
        marginBottom: '8px',
    },
    label: {
        fontWeight: 'bold',
    }
})

const TextWidget: React.FC<WidgetProps> = (props: WidgetProps) => {
    const { value, schema, label } = props;
    const styles = useStyles()

    return (
        <div className={styles.field}>
            <Label>{label}</Label>
            <Text>
                {schema.type === 'string' && schema.format === 'textarea'
                    ? value?.toString()
                    : value?.toString().split('\n').map((str: string, id: number) => <p key={id}>{str}</p>) || 'No set'}
            </Text>
        </div>
    );
};

export default TextWidget;

