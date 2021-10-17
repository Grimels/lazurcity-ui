import { useEffect, useState } from 'react';
import { AccommodationsDataService } from '../../dataservices/AccommodationsDataService';
import { AccommodationsStatistics } from '../../types/accommodation';
import { DashboardCard } from './DashboardCard';

import './DashboardSection.scss';
import { Typography } from '@material-ui/core';
import { Doughnut, Line } from 'react-chartjs-2';
import { getIncomesByMonthChart, getTopAccommodationIncomesData } from './utils';
import { SEASON } from '../../constants/date';
import { Alert } from '@material-ui/lab';
import * as React from 'react';

export const DashboardSection = () => {
    const [statistics, setStatistics] = useState<AccommodationsStatistics>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        (async () => {
            try {
                const statisticsResponse = await AccommodationsDataService
                    .getAccommodationsStatistics(SEASON.START, SEASON.END, new Date(2021, 6, 5));
                setStatistics(statisticsResponse);
            } catch (e) {
                setError(e);
            }
        })();
    }, []);

    if (!statistics) {
        return <div>
            Loading...
            {error && <Alert severity="error">{error}</Alert>}
        </div>
    }
    return (
        <div className="dashboard">
            <Typography className="section-header" variant="h2">Статистика</Typography>
            <div className="section">
                <div className="charts">
                    <div className="incomes-chart-container full">
                        <Typography variant="h5">Доходы за сезон</Typography>
                        <Line className="incomes-chart" data={getIncomesByMonthChart(statistics.incomesByKey)}/>
                    </div>
                    <div className="incomes-chart-container">
                        <Typography variant="h5">Доходы комнат за сезон</Typography>
                        <Doughnut className="incomes-chart"
                                  data={getTopAccommodationIncomesData(statistics.seasonIncomeByRoomName)}/>
                    </div>
                    <div className="incomes-chart-container">
                        <Typography variant="h5">Доходы по категории</Typography>
                        <Doughnut className="incomes-chart"
                                  data={getTopAccommodationIncomesData(statistics.seasonIncomeByRoomCategory)}/>
                    </div>
                </div>
                <div className="cards-container">
                    <DashboardCard colorIndex={1}>
                        <Typography variant="h3" className="stat-number">{statistics.roomsLeavingToday}</Typography>
                        <p className="stat-description">Комнат выезжает сегодня</p>
                    </DashboardCard>
                    <DashboardCard colorIndex={2}>
                        <Typography variant="h3" className="stat-number">{statistics.dailyIncome}</Typography>
                        <p className="stat-description">Заработано сегодня</p>
                    </DashboardCard>
                    <DashboardCard colorIndex={3}>
                        <Typography variant="h3" className="stat-number">{statistics.freeRooms}</Typography>
                        <p className="stat-description">Комнат свободно</p>
                    </DashboardCard>
                </div>
            </div>
            {error && <Alert severity="error">{error}</Alert>}
        </div>
    )

}