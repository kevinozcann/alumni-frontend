import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card } from 'react-bootstrap';

export const CommInfo = ({ user }) => {
  return (
    <Card className='gutter-b'>
      <Card.Body style={{ padding: '2.25rem 1.5rem' }}>
        <Card.Title>
          <FormattedMessage id='CONTACT_INFO' />
        </Card.Title>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='CEP_TELEFONU' />
          </h6>
          <p>-</p>
        </div>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='TELEFON' />
          </h6>
          <p>-</p>
        </div>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='ADRES' />
          </h6>
          <p>-</p>
        </div>
        {(user.userZone === 'parent' || user.userZone === 'student') && <Fragment></Fragment>}
      </Card.Body>
    </Card>
  );
};
