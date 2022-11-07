import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import { LocaleProvider } from 'theme/i18n/LocaleProvider';

import MailLabel from './MailLabel';
import labels from './_store/labels';

describe('MailLabel component snapshot', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useLocation: jest.fn()
    }));
  });

  it('should render as expected', () => {
    const tree = renderer
      .create(
        <LocaleProvider lang='en' activeSchool='1'>
          <MemoryRouter>
            <MailLabel label={labels[0]} />
          </MemoryRouter>
        </LocaleProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
