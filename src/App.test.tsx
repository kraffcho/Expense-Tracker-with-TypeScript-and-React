import { render, screen } from '@testing-library/react';
import App from './App';

test("renders expense tracker text", () => {
  render(<App />);
  const linkElement = screen.getByText(/Expense Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
