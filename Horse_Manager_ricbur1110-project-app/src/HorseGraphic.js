import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
} from 'chart.js';

import { Bar } from 'react-chartjs-2';

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
);

function HorseGraphic({ horses }) {
    const genderOptions = ['Mare', 'Filly', 'Stallion', 'Colt', 'Gelding'];
    const genderCounts = genderOptions.map(
        (gender) =>
            horses.filter(
                (horse) => horse.gender.toLowerCase() === gender.toLowerCase()
            ).length
    );

    const unspecifiedCount = horses.filter(
        (horse) =>
            horse.gender.trim() === '' ||
            !genderOptions.some(
                (gender) => gender.toLowerCase() === horse.gender.toLowerCase()
            )
    ).length;

    const chartData = {
        labels: [...genderOptions, 'Unspecified'],
        datasets: [
            {
                label: 'Number of Horses',
                data: [...genderCounts, unspecifiedCount],
            },
        ],
    };

    const chartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Horse Profiles by Gender',
            },
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    const breedCounts = horses.reduce((counts, horse) => {
        const breed = horse.type.trim() || 'Unspecified';
        counts[breed] = (counts[breed] || 0) + 1;
        return counts;
    }, {});

    const breedChartData = {
        labels: Object.keys(breedCounts),
        datasets: [
            {
                label: 'Number of Horses',
                data: Object.values(breedCounts),
                backgroundColor: '#8b5e3c',
            },
        ],
    };

    const breedChartOptions = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Horse Profiles by Breed',
            },
            legend: {
                display: true,
            },
        },
        scales: {
            y: {
                beginAtZero: true,
                ticks: {
                    stepSize: 1,
                },
            },
        },
    };

    return (
        <>
            <section id="horse-gender-chart">
                <h2>Horse Gender Chart</h2>

                {horses.length === 0 ? (
                    <p>Add a horse to display gender chart data.</p>
                ) : (
                    <Bar data={chartData} options={chartOptions} />
                )}
            </section>

            <section id="horse-breed-chart">
                <h2>Horse Breed Chart</h2>

                {horses.length === 0 ? (
                    <p>Add a horse to display breed chart data.</p>
                ) : (
                    <Bar data={breedChartData} options={breedChartOptions} />
                )}

                <p>Total Horses: {horses.length}</p>
            </section>
        </>
    );
}

export default HorseGraphic;
