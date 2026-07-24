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
    const maleCount = horses.filter(
        (horse) => horse.gender.toLowerCase() === 'male'
    ).length;

    const femaleCount = horses.filter(
        (horse) => horse.gender.toLowerCase() === 'female'
    ).length;

    const geldingCount = horses.filter(
        (horse) => horse.gender.toLowerCase() === 'gelding'
    ).length;

    const unspecifiedCount = horses.filter(
        (horse) =>
            horse.gender.trim() === '' ||
            (
                horse.gender.toLowerCase() !== 'male' &&
                horse.gender.toLowerCase() !== 'female' &&
                horse.gender.toLowerCase() !== 'gelding'
            )
    ).length;

    const chartData = {
        labels: ['Male', 'Female', 'Gelding', 'Unspecified'],
        datasets: [
            {
                label: 'Number of Horses',
                data: [maleCount, femaleCount, geldingCount, unspecifiedCount],
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

    return (
        <section>
            <h2>Horse Care Chart</h2>

            {horses.length === 0 ? (
                <p>Add a horse to display chart data.</p>
            ) : (
                <Bar data={chartData} options={chartOptions} />
            )}

            <p>Total Horses: {horses.length}</p>
        </section>
    );
}

export default HorseGraphic;