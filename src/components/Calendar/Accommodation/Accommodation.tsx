import * as React from 'react';
import { CSSProperties, useEffect, useState } from 'react';
import { AccommodationInfo } from '../../../types/accommodation';
import { Button } from '@material-ui/core';

import * as R from 'ramda';

export interface AccommodationProps {
    accommodation: AccommodationInfo,
    color: string,
    onClick: (accommodation: AccommodationInfo) => void,
    referredBy: React.RefObject<HTMLTableCellElement>,
}

export const Accommodation: React.FC<AccommodationProps> = ({referredBy, onClick, accommodation, color,}) => {
    const {id, client, daysLeft} = accommodation;
    const [styles, setStyles] = useState<CSSProperties>();

    useEffect(() => {
        const width = referredBy.current ? referredBy.current.offsetWidth : 1;
        const size = daysLeft * width - 5;
        setStyles({
            width: size + 'px',
            backgroundColor: color,
            marginLeft: (width / 4) + 'px',
        });
    }, [referredBy.current?.offsetWidth])

    const label = R.or(client.name, R.or(client.phoneNumber, ''));
    const wrapWidth = styles ? styles.width : '100%';

    return (
        <>
            <Button id={`${id}`} style={styles} className="accommodation-line" onClick={() => onClick(accommodation)}>
                <div className="blocker-wrap" style={{width: wrapWidth }}/>
                <span className="label">{label}</span>
                {!accommodation.isFinal && <span className="label end">?</span>}
            </Button>
        </>
    );
}
