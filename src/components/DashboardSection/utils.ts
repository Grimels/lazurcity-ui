import { getColorLine } from '../../utils/getColorLine';

export const getTopAccommodationIncomesData = (incomesByKey: Map<string, number>) => {
    const incomesByKeyArr = [...incomesByKey.entries()]
        .sort((a, b) => a[1] - b[1] == 0 ? 0 : (a[1] - b[1] > 0 ? -1 : 1));
    const topIncomes = incomesByKeyArr.slice(0, 7);
    const etcIncomes = incomesByKeyArr.slice(8)
        .reduce((accumulator, currentIncomes) => accumulator + currentIncomes[1], 0);

    const keys: string[] = incomesByKeyArr.length > 4
        ? [...topIncomes.map(topIncome => topIncome[0]), 'Остальные']
        : [...topIncomes.map(topIncome => topIncome[0])];
    const incomes: number[] = incomesByKeyArr.length > 4
        ? [...topIncomes.map(topIncome => topIncome[1]), etcIncomes]
        : [...topIncomes.map(topIncome => topIncome[1])];

    return {
        labels: keys,
        datasets: [
            {
                data: incomes,
                backgroundColor: keys.map((_, index) => getColorLine(index)),
                borderColor: keys.map((_, index) => getColorLine(index)),
                borderWidth: 1,
            }
        ]
    }
}

export const getIncomesByMonthChart = (incomesByMonth: Map<string, number>) => {
    const entries = [...incomesByMonth.entries()]
        .sort(([dataKey1], [dataKey2]) => {
            const [day1, month1] = dataKey1.split('.').map(item => Number(item));
            const [day2, month2] = dataKey2.split('.').map(item => Number(item));

            if (month1 === month2) {
                if (day1 - day2 > 0) return 1;
                else if (day1 - day2 < 0) return -1;
                return 0;
            }
            if (month1 - month2 > 0) return 1;
            else if (month1 - month2 < 0) return -1;
            return 0;
        });
    const resultX = [];
    const resultY: number[] = [];

    for (const [dateKey, incomes] of entries) {
        resultX.push(dateKey);
        resultY.push(incomes);
    }

    return {
        labels: resultX,
        datasets: [
            {
                label: 'Ежедневный доход',
                data: resultY,
                fill: false,
                backgroundColor: 'rgb(255, 99, 132)',
                borderColor: 'rgba(255, 99, 132, 0.2)',
                borderWidth: 1,
            }
        ],
    }
}
