import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import { LocaleProvider } from 'theme/i18n/LocaleProvider';

import labels from './_store/labels';
import MailToolbar from './MailToolbar';

describe('MailToolbar component snapshot', () => {
  beforeEach(() => {
    jest.mock('react-router-dom', () => ({
      ...jest.requireActual('react-router-dom'),
      useNavigate: jest.fn()
    }));
  });

  it('should render as expected', () => {
    const tree = renderer
      .create(
        <LocaleProvider lang='en' activeSchool='1'>
          <MemoryRouter>
            <MailToolbar section='inbox' label={labels[0]} />
          </MemoryRouter>
        </LocaleProvider>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
