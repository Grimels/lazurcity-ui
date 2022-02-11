import React from 'react';
import { Alert } from '@material-ui/lab';
import { Color } from '@material-ui/lab/Alert/Alert';

export interface PopUpProps {
    color?: Color,
    text?: string,
    className?: string,
}

export const PopUp: React.FC<PopUpProps> = ({ color, text, className }) => {
    return <Alert className={className} severity={color}>{text}</Alert>
}
