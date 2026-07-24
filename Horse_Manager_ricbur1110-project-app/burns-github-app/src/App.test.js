import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./HorseGraphic', () => {
  return function MockHorseGraphic({ horses }) {
    return <p>Total Horses: {horses.length}</p>;
  };
});

test('adds a horse from the controlled text field', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/horse name/i), {
    target: { value: '  Star Runner  ' },
  });
  fireEvent.change(screen.getByLabelText(/gender/i), {
    target: { value: 'Mare' },
  });
  fireEvent.change(screen.getByLabelText(/type/i), {
    target: { value: 'Thoroughbred' },
  });
  fireEvent.change(screen.getByLabelText(/notes/i), {
    target: { value: '  Morning turnout  ' },
  });
  fireEvent.click(screen.getByRole('button', { name: /add horse/i }));

  expect(screen.getByText('Star Runner')).toBeInTheDocument();
  expect(screen.getByText(/gender: mare/i)).toBeInTheDocument();
  expect(screen.getByText(/type: thoroughbred/i)).toBeInTheDocument();
  expect(screen.getByText(/notes: morning turnout/i)).toBeInTheDocument();
  expect(screen.getByText('Star Runner was added.')).toBeInTheDocument();
  expect(screen.getByLabelText(/horse name/i)).toHaveValue('');
  expect(screen.getByLabelText(/gender/i)).toHaveValue('');
  expect(screen.getByLabelText(/type/i)).toHaveValue('');
  expect(screen.getByLabelText(/notes/i)).toHaveValue('');
});

test('validates and sanitizes horse name input', () => {
  render(<App />);

  const horseNameInput = screen.getByLabelText(/horse name/i);

  fireEvent.change(horseNameInput, {
    target: { value: '<Sea*Biscuit>' },
  });

  expect(horseNameInput).toHaveValue('Sea*Biscuit');

  fireEvent.click(screen.getByRole('button', { name: /add horse/i }));

  expect(
    screen.getAllByText(/horse names can only include letters/i)
  ).toHaveLength(2);
});

test('sanitizes optional profile fields', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/gender/i), {
    target: { value: '<Gelding>' },
  });
  fireEvent.change(screen.getByLabelText(/type/i), {
    target: { value: 'Quarter   Horse' },
  });
  fireEvent.change(screen.getByLabelText(/notes/i), {
    target: { value: 'Needs <extra> hay' },
  });

  expect(screen.getByLabelText(/gender/i)).toHaveValue('Gelding');
  expect(screen.getByLabelText(/type/i)).toHaveValue('Quarter Horse');
  expect(screen.getByLabelText(/notes/i)).toHaveValue('Needs extra hay');
});

test('updates the last horse instead of creating a duplicate', () => {
  render(<App />);

  fireEvent.change(screen.getByLabelText(/horse name/i), {
    target: { value: 'Comet' },
  });
  fireEvent.click(screen.getByRole('button', { name: /add horse/i }));
  fireEvent.click(screen.getByRole('button', { name: /edit horse/i }));

  fireEvent.change(screen.getByLabelText(/horse name/i), {
    target: { value: 'Comet II' },
  });
  fireEvent.click(screen.getByRole('button', { name: /save changes/i }));

  expect(screen.queryByText('Comet')).not.toBeInTheDocument();
  expect(screen.getByText('Comet II')).toBeInTheDocument();
  expect(screen.getByText('Comet II was updated.')).toBeInTheDocument();
  expect(screen.getByText('Total Horses: 1')).toBeInTheDocument();
});
