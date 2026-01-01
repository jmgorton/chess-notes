import { render, screen } from '@testing-library/react';
import App from './App';

// test('renders learn react link', () => {
//   render(<App />);
//   const linkElement = screen.getByText(/learn react/i);
//   expect(linkElement).toBeInTheDocument();
// });

// test('possible positions at depth', () => {
test('number of light pawns on starting position', () => {
  render(<App/>);
  const lightPawns = screen.findAllByAltText(/Light Pawn/);
  expect(lightPawns.length === 8);
});