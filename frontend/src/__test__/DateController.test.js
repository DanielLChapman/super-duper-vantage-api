import * as React from 'react';
import * as TestUtils from 'react-dom/test-utils';
import {expect, it} from '@jest/globals';
import DateController from '../Components/DateHandler/DateController'
import ReactDOM from 'react-dom/client';
import {render, screen} from '@testing-library/react'


let container;

beforeEach(() => {
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  document.body.removeChild(container);
  container = null;
});

it('Renders loading with no props', async () => {
  await  TestUtils.act(async () => {
    await ReactDOM.createRoot(container).render(<DateController />);
  });

  const label = container.querySelector('span');

  expect (label.textContent).toBe('Loading...');
  
});

it('renders a form with props added in', async () => {
  const dateBuild = {
    month: 5,
    day: 11,
    year: 2023
  };
  const updateHandler = (val, selector) => {};
  const updateAllDates = (m, d, y) => {};

  const { getByRole } = render(<DateController dateBuild={dateBuild} updateHandler={updateHandler} updateAllDates={updateAllDates} />);

  expect(screen.getByText('Check Date To Use:'));
  expect(getByRole('button').textContent).toBe('Set Sell Date');
  expect(screen.getAllByRole('spinbutton').length).toBe(3);
})  