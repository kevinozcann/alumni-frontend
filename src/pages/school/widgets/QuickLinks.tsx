import React from 'react';
import { useIntl } from 'react-intl';
import { Grid } from '@mui/material';
import {
  faAlarmPlus,
  faCalendarPlus,
  faCartPlus,
  faPhonePlus,
  faTasks,
  faUserGraduate,
  faUsersClass,
  faVideoPlus
} from '@fortawesome/pro-duotone-svg-icons';
import ActionBox from '../../../components/dashboard/ActionBox';

const QuickLinks: React.FC = () => {
  const intl = useIntl();

  return (
    <Grid container spacing={1}>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='danger'
          actionUrl='/smartclass/admissionInterviews'
          title={intl.formatMessage({ id: 'admission.add' })}
          icon={faPhonePlus}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='info'
          actionUrl='/smartclass/registration'
          title={intl.formatMessage({ id: 'student.add' })}
          icon={faUserGraduate}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='primary'
          actionUrl='/smartclass/courses'
          title={intl.formatMessage({ id: 'course.add' })}
          icon={faCartPlus}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='success'
          actionUrl='/smartclass/classes'
          title={intl.formatMessage({ id: 'class.add' })}
          icon={faUsersClass}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='info'
          actionUrl='/smartclass/virtualClasses'
          title={intl.formatMessage({ id: 'online.class.add' })}
          icon={faVideoPlus}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='warning'
          actionUrl='/smartclass/meetings'
          title={intl.formatMessage({ id: 'meeting.add' })}
          icon={faCalendarPlus}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='secondary'
          actionUrl='/smartclass/activityLists'
          title={intl.formatMessage({ id: 'event.add' })}
          icon={faAlarmPlus}
        />
      </Grid>
      <Grid item xs={6}>
        <ActionBox
          boxStyle='danger'
          actionUrl='/smartclass/tasks'
          title={intl.formatMessage({ id: 'task.add' })}
          icon={faTasks}
        />
      </Grid>
    </Grid>
  );
};

export default QuickLinks;
