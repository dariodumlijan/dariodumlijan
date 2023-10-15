import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import Home from '../../src/components/pages/Home';

test('should render App', () => {
  const { container } = render(<Home />);
  expect(container.querySelector('main')).toBeInTheDocument();
});
