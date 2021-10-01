import * as React from 'react';
import { CSSProperties, useEffect, useState } from 'react';
import { AccommodationInfo } from '../../../types/accommodation';
import { Button } from '@material-ui/core';

export interface AccommodationProps {
	accommodation: AccommodationInfo,
	color: string,
	onClick: (accommodation: AccommodationInfo) => void,
	referredBy: React.RefObject<HTMLTableCellElement>,
}

export const Accommodation: React.FC<AccommodationProps> = ({ referredBy, onClick, accommodation, color, }) => {
	const { id, client, daysLeft } = accommodation;
	const [styles, setStyles] = useState<CSSProperties>();
	
	useEffect(() => {
		const width = referredBy.current ? referredBy.current.offsetWidth : 1;
		const size = daysLeft * width;
		setStyles({
			width: size - 5 + 'px',
			backgroundColor: color,
			marginLeft: (width / 4) + 'px',
		});
	}, [referredBy.current?.offsetWidth])
	
	const getLabel = () => {
		if (client) return client.name || client.phoneNumber;
		return '';
	}
	
	const renderAccommodation = () => (
		<Button id={`${id}`} style={styles} className="accommodation-line" onClick={() => onClick(accommodation)}>
			<span className="label">{getLabel()}</span>
		</Button>
	);
	return renderAccommodation();
}