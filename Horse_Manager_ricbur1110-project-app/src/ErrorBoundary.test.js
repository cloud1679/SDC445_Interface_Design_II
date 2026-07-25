import { render, screen } from '@testing-library/react';
import ErrorBoundary from './ErrorBoundary';

function BrokenComponent() {
  throw new Error('Test failure');
}

test('shows a recovery screen when a child component crashes', () => {
  jest.spyOn(console, 'error').mockImplementation(() => {});

  render(
    <ErrorBoundary>
      <BrokenComponent />
    </ErrorBoundary>
  );

  expect(screen.getByRole('alert')).toHaveTextContent(
    'Something unexpected happened'
  );
  expect(
    screen.getByRole('button', { name: 'Reload Horse Manager' })
  ).toBeInTheDocument();
});
