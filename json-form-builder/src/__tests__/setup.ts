import '@testing-library/jest-dom';

// Mock window.grecaptcha
Object.defineProperty(window, 'grecaptcha', {
  value: {
    render: jest.fn(),
    getResponse: jest.fn()
  },
  writable: true
});

// Mock console.error to prevent noise in test output
const originalError = console.error;
console.error = (...args) => {
  if (
    typeof args[0] === 'string' &&
    args[0].includes('Warning: ReactDOM.render is no longer supported')
  ) {
    return;
  }
  originalError.call(console, ...args);
};

test('setup test', () => {
  expect(true).toBe(true);
}); 