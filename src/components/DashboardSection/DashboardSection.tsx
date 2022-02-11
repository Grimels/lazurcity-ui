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
import * as Chart from 'chart.js';

export const DashboardSection = () => {
    const [statistics, setStatistics] = useState<AccommodationsStatistics>();
    const [error, setError] = useState<string>();

    useEffect(() => {
        (async () => {
            try {
                const statisticsResponse = await AccommodationsDataService
                    .getAccommodationsStatistics(SEASON.START, SEASON.END, SEASON.TODAY);
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
    const dailyIncomeOptions: Chart.ChartOptions = {
        scales: {
            y: {
                display: true,
                title: {
                    display: true,
                    text: 'Доход (грн)'
                }
            },
            x: {
                display: true,
                title: {
                    display: true,
                    text: 'День'
                }
            },
        },
        plugins: {
            legend: {
                display: true,
                labels: { boxWidth: 20 },
            }
        }
    }
    const doughnutOptions: Chart.ChartOptions = {
        plugins: {
            legend: {
                display: true,
                position: "right",
                labels: { boxWidth: 20 },
            },
        },
    }

    return (
        <div className="dashboard">
            <Typography className="section-header" variant="h2">Статистика</Typography>
            <div className="section">
                <div className="charts">
                    <div className="incomes-chart-container full">
                        <Typography variant="h5">Доходы за сезон</Typography>
                        <Line className="incomes-chart" options={dailyIncomeOptions}
                              data={getIncomesByMonthChart(statistics.incomesByKey)}/>
                    </div>
                    <div className="incomes-chart-container">
                        <Typography variant="h5">Доходы комнат за сезон</Typography>
                        <Doughnut className="incomes-chart"
                                  options={doughnutOptions}
                                  data={getTopAccommodationIncomesData(statistics.seasonIncomeByRoomName, 'Комната №')}/>
                    </div>
                    <div className="incomes-chart-container">
                        <Typography variant="h5">Доходы по категории</Typography>
                        <Doughnut className="incomes-chart"
                                  options={doughnutOptions}
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
                    <DashboardCard colorIndex={4}>
                        <Typography variant="h3" className="stat-number">{statistics.totalSeasonIncome}</Typography>
                        <p className="stat-description">Заработано за сезон</p>
                    </DashboardCard>
                </div>
            </div>
            {error && <Alert severity="error">{error}</Alert>}
        </div>
    );

}
