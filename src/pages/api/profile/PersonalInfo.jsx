import React, { Fragment } from 'react';
import { FormattedMessage } from 'react-intl';
import { Card } from 'react-bootstrap';

export const PersonalInfo = ({ user }) => {
  return (
    <Card className='gutter-b'>
      <Card.Body style={{ padding: '2.25rem 1.5rem' }}>
        <Card.Title>
          <FormattedMessage id='KISISEL_BILGILER' />
        </Card.Title>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='TC_KIMLIK_NO' />
          </h6>
          <p>-</p>
        </div>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='POSITION' />
          </h6>
          <p>-</p>
        </div>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='CINSIYET' />
          </h6>
          <p>-</p>
        </div>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='ACTIVE' />
          </h6>
          <p>-</p>
        </div>
        <div className='mt-1'>
          <h6 className='mb-0'>
            <FormattedMessage id='BLOOD_GROUP' />
          </h6>
          <p>-</p>
        </div>
        {(user.userZone === 'parent' || user.userZone === 'student') && <Fragment></Fragment>}
      </Card.Body>
    </Card>
  );
};
