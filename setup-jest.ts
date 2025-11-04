import 'jest-preset-angular/setup-jest';
import '@testing-library/jest-dom';

// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock as any;

// Mock de window.alert y window.confirm
global.alert = jest.fn();
global.confirm = jest.fn(() => true);