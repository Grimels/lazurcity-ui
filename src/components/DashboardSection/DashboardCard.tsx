import React from 'react';
import { getColorLine } from '../../utils/getColorLine';

export const DashboardCard: React.FC<{ colorIndex?: number }> = ({ colorIndex = 1, children}) => (
    <div className="dashboard-card" style={{ backgroundColor: getColorLine(colorIndex) }}>
        {children}
    </div>
)