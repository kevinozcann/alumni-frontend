import React from 'react';
import { Badge } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconName } from '@fortawesome/pro-duotone-svg-icons';

import { createMarkup, SchoostLinearProgress, ShortDate } from 'utils/Helpers';

import AllCaughtUp from './AllCaughtUp';

export interface INews {
  id: string;
  title: string;
  details: string;
  version: string;
  updateDate: string;
  updateType: string;
  updateIcon: IconName;
}

const News: React.FC<{
  news: INews[];
  newsPhase: string;
}> = ({ news, newsPhase }) => {
  return (
    <React.Fragment>
      {newsPhase === 'PULLING' && (
        <div className='mb-5 px-5'>
          <SchoostLinearProgress />
        </div>
      )}

      {!news && <AllCaughtUp message='NO_RECORD' />}

      {news && (
        <React.Fragment>
          {news.map((n) => {
            return (
              <a key={n.id} href='#' className='navi-item'>
                <div className='navi-link'>
                  <div className={`symbol symbol-40 mr-5`}>
                    <span className={`symbol-label`}>
                      <FontAwesomeIcon size='lg' icon={['fad', n.updateIcon]} />
                    </span>
                  </div>
                  <div className='navi-text'>
                    <div className='font-weight-bold'>{n.title}</div>
                    <div className='text-muted'>
                      <ShortDate date={n.updateDate} />
                    </div>
                  </div>
                  <div>
                    <Badge variant='standard'>{n.version}</Badge>
                  </div>
                </div>
                <div className='text-dark-50' dangerouslySetInnerHTML={createMarkup(n.details)} />
              </a>
            );
          })}
        </React.Fragment>
      )}
    </React.Fragment>
  );
};

export default News;
