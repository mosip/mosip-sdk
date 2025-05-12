import '@testing-library/jest-dom';

// Mock window.grecaptcha
Object.defineProperty(window, 'grecaptcha', {
  value: {
    render: jest.fn().mockReturnValue(1),
    getResponse: jest.fn().mockReturnValue('test-token'),
    reset: jest.fn()
  },
  writable: true
});

// Mock document.createElement
const originalCreateElement = document.createElement;
document.createElement = function(tagName: string) {
  const element = originalCreateElement.call(document, tagName);
  if (tagName === 'script') {
    // Simulate script loading
    setTimeout(() => {
      if (element.onload) {
        element.onload(new Event('load'));
      }
    }, 0);
  }
  return element;
}; 