import React from 'react';
import renderer from 'react-test-renderer';
import { MemoryRouter } from 'react-router-dom';

import MailItem from './MailItem';
import labels from './_store/labels';
import emails from './_mocks/emails';

describe('MailItem component snapshot', () => {
  it('should render as expected', () => {
    const email = emails[0];

    const tree = renderer
      .create(
        <MemoryRouter>
          <MailItem
            handleStarClick={() => console.log('starred')}
            labels={labels}
            mail={email}
            selected={false}
          />
        </MemoryRouter>
      )
      .toJSON();

    expect(tree).toMatchSnapshot();
  });
});
