import * as React from 'react';
import { CSSProperties, useEffect, useState } from 'react';
import { AccommodationInfo } from '../../../types/accommodation';

export interface AccommodationProps {
	accommodation: AccommodationInfo,
	color: string,
	referredBy: React.RefObject<HTMLTableCellElement>,
}

export const Accommodation: React.FC<AccommodationProps> = ({ referredBy, accommodation, color, }) => {
	const { id, daysLeft, client } = accommodation;
	const [styles, setStyles] = useState<CSSProperties>();
	
	useEffect(() => {
		const width = referredBy.current ? referredBy.current.offsetWidth : 1;
		const height = referredBy.current ? referredBy.current.offsetHeight : 1;
		const size = daysLeft * width;
		setStyles({
			width: size + 'px',
			height: height * 0.75 + 'px',
			backgroundColor: color,
			marginLeft: (width / 2.2) + 'px',
		});
	}, [referredBy.current?.offsetWidth])
	
	const getLabel = () => {
		if (client) return client.name || client.phoneNumber;
		return '';
	}
	
	const renderAccommodation = () => (
		<div id={`${id}`} style={styles} className="accommodation-line">
			<span className="label">{getLabel()}</span>
		</div>
	);
	return renderAccommodation();
}