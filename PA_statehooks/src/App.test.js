import { render, screen } from '@testing-library/react';
import App from './App';

test('renders todo list heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/todo list/i);
  expect(headingElement).toBeInTheDocument();
});
