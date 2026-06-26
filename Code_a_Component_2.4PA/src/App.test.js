import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import App from './App';

test('renders button and updates click count', async () => {
  render(<App />);

  const button = screen.getByRole('button', { name: /click me/i });
  expect(screen.getByText(/button clicked 0 times/i)).toBeInTheDocument();

  await userEvent.click(button);

  expect(screen.getByText(/button clicked 1 times/i)).toBeInTheDocument();
});
