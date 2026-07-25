import { fireEvent, render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./HorseGraphic', () => function MockHorseGraphic({ horses }) {
  return <div data-testid="charts">Chart horses: {horses.length}</div>;
});

function addHorse(name, gender = '', breed = '', color = '') {
  fireEvent.change(screen.getByLabelText('Horse Name'), {
    target: { value: name },
  });
  if (gender) {
    fireEvent.change(screen.getByLabelText('Gender'), {
      target: { value: gender },
    });
  }
  if (breed) {
    fireEvent.change(screen.getByLabelText('Breed'), {
      target: { value: breed },
    });
  }
  if (color) {
    fireEvent.change(screen.getByLabelText('Color'), {
      target: { value: color },
    });
  }
  fireEvent.click(screen.getByRole('button', { name: 'Add Horse' }));
}

beforeEach(() => {
  jest.restoreAllMocks();
});

test('renders all main sections and the requested dropdown choices', () => {
  render(<App />);

  expect(screen.getByRole('heading', { name: 'Add Horse Information' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Horse Profiles' })).toBeInTheDocument();
  expect(screen.getByRole('heading', { name: 'Appointments' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Mare (Adult female)' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Pinto (Large areas of white and another coat color)' })).toBeInTheDocument();
  expect(screen.getByRole('option', { name: 'Dark Bay (Deep brown body with black mane, tail, and legs)' })).toBeInTheDocument();
  expect(screen.getByTestId('charts')).toHaveTextContent('Chart horses: 0');
});

test('validates and sanitizes horse names without adding invalid records', () => {
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Add Horse' }));
  expect(screen.getByText('Please enter a horse name.', { selector: '.field-error' })).toBeInTheDocument();

  fireEvent.change(screen.getByLabelText('Horse Name'), {
    target: { value: 'Star<script>' },
  });
  expect(screen.getByLabelText('Horse Name')).toHaveValue('Starscript');
  fireEvent.click(screen.getByRole('button', { name: 'Add Horse' }));
  expect(screen.getByText('Starscript', { selector: 'strong' })).toBeInTheDocument();
});

test('edits the selected horse rather than the latest horse', () => {
  render(<App />);
  addHorse('Spirit', 'Mare', 'Arabian', 'Bay');
  addHorse('Comet', 'Gelding', 'Morgan', 'Dark Bay');

  fireEvent.click(screen.getByRole('button', { name: 'Edit Spirit' }));
  expect(screen.getByLabelText('Horse Name')).toHaveValue('Spirit');
  fireEvent.change(screen.getByLabelText('Horse Name'), {
    target: { value: 'Spirit Moon' },
  });
  fireEvent.click(screen.getByRole('button', { name: 'Save Changes' }));

  expect(screen.getByText('Spirit Moon', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.getByText('Comet', { selector: 'strong' })).toBeInTheDocument();
  expect(screen.queryByText('Spirit', { selector: 'strong' })).not.toBeInTheDocument();
});

test('only deletes the selected horse after confirmation', () => {
  const confirm = jest.spyOn(window, 'confirm');
  render(<App />);
  addHorse('Spirit');
  addHorse('Comet');

  confirm.mockReturnValueOnce(false);
  fireEvent.click(screen.getByRole('button', { name: 'Delete Spirit' }));
  expect(screen.getByText('Spirit', { selector: 'strong' })).toBeInTheDocument();

  confirm.mockReturnValueOnce(true);
  fireEvent.click(screen.getByRole('button', { name: 'Delete Spirit' }));
  expect(screen.queryByText('Spirit', { selector: 'strong' })).not.toBeInTheDocument();
  expect(screen.getByText('Comet', { selector: 'strong' })).toBeInTheDocument();
});

test('requires complete appointment details and sorts appointments by date and time', () => {
  jest.spyOn(window, 'confirm').mockReturnValue(true);
  render(<App />);

  fireEvent.click(screen.getByRole('button', { name: 'Add Appointment' }));
  expect(screen.getByText('Please enter an appointment purpose, date, and time.')).toBeInTheDocument();

  const addAppointment = (name, date, time) => {
    fireEvent.change(screen.getByLabelText('Appointment Purpose'), {
      target: { value: name },
    });
    fireEvent.change(screen.getByLabelText('Appointment Date'), {
      target: { value: date },
    });
    fireEvent.change(screen.getByLabelText('Appointment Time'), {
      target: { value: time },
    });
    fireEvent.click(screen.getByRole('button', { name: 'Add Appointment' }));
  };

  addAppointment('Veterinarian', '2027-08-10', '14:30');
  addAppointment('Farrier', '2027-08-10', '09:00');

  const appointments = screen.getAllByRole('listitem').map((item) => item.textContent);
  expect(appointments[0]).toContain('Farrier');
  expect(appointments[1]).toContain('Veterinarian');
  expect(screen.getByText(/August 10, 2027 at 9:00 AM/)).toBeInTheDocument();

  fireEvent.click(screen.getAllByRole('button', { name: 'Delete appointment' })[0]);
  expect(screen.queryByText('Farrier', { selector: 'strong' })).not.toBeInTheDocument();
});
