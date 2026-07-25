import { render, screen } from '@testing-library/react';
import HorseGraphic from './HorseGraphic';

jest.mock('react-chartjs-2', () => ({
  Bar: ({ data }) => (
    <div data-testid="bar-chart">
      {data.labels.join(',')}:{data.datasets[0].data.join(',')}
    </div>
  ),
}));

test('renders empty chart states safely when horses is missing', () => {
  render(<HorseGraphic />);

  expect(screen.getByText('Add a horse to display gender chart data.')).toBeInTheDocument();
  expect(screen.getByText('Add a horse to display breed chart data.')).toBeInTheDocument();
  expect(screen.getByText('Total Horses: 0')).toBeInTheDocument();
});

test('handles incomplete horse records without crashing', () => {
  render(
    <HorseGraphic
      horses={[
        { id: '1', gender: null, type: undefined },
        { id: '2', gender: 'Mare', type: 'Arabian' },
      ]}
    />
  );

  expect(screen.getAllByTestId('bar-chart')).toHaveLength(2);
  expect(screen.getByText('Total Horses: 2')).toBeInTheDocument();
  expect(screen.getByText(/Mare,Filly,Stallion,Colt,Gelding,Unspecified:1,0,0,0,0,1/)).toBeInTheDocument();
  expect(screen.getByText(/Unspecified,Arabian:1,1/)).toBeInTheDocument();
});
