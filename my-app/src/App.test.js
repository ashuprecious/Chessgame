import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Snake Game title', () => {
  render(<App />);
  const titleElement = screen.getByText(/snake game/i);
  expect(titleElement).toBeInTheDocument();
});
