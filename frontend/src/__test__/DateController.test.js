import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import {expect, it} from '@jest/globals';
import DateController from '../Components/DateHandler/DateController'
import ReactDOM from 'react-dom/client';

let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('Renders loading with no props', () => {
  TestUtils.act(() => {
    ReactDOM.createRoot(container).render(<DateController />);
  });

  const label = container.querySelector('span');

  expect (label.textContent).toBe('Loading...');
});