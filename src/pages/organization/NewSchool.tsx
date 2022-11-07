import React from 'react';
import { useParams } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import { Card, CardHeader, Divider, CardContent } from '@mui/material';

import { RootState } from 'store/store';
import { useSubheader } from 'contexts/SubheaderContext';
import Page from 'layout/Page';

import { schoolSelector } from './_store/school';
import AddSchool from './add/AddSchool';

const mapStateToProps = (state: RootState) => ({
  schoolInfo: schoolSelector(state)
});
// const mapDispatchToProps = (dispatch: AppDispatch) => ({
// });
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TNewSchoolProps = PropsFromRedux;

const NewSchool = (props: TNewSchoolProps) => {
  const { section } = useParams();
  const { schoolInfo } = props;
  const subheader = useSubheader();
  const intl = useIntl();

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'organization', url: '/organization' });
    breadcrumbs.push({
      title: schoolInfo.title,
      url: `/organization/${schoolInfo.id}`,
      original: true
    });
    if (section === 'campuses') {
      breadcrumbs.push({
        title: `campuses`,
        url: `/organization/${schoolInfo.id}/campuses`
      });
      breadcrumbs.push({
        title: `campus.add`,
        url: `/organization/${schoolInfo.id}/campuses/new`
      });
    }
    if (section === 'schools') {
      breadcrumbs.push({
        title: `schools`,
        url: `/organization/${schoolInfo.id}/schools`
      });
      breadcrumbs.push({
        title: `school.add`,
        url: `/organization/${schoolInfo.id}/schools/new`
      });
    }
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page
      title={intl.formatMessage({ id: (section === 'campuses' && 'campus.add') || 'school.add' })}
    >
      <Card sx={{}}>
        <CardHeader
          title={intl.formatMessage({
            id: (section === 'campuses' && 'campus.add') || 'school.add'
          })}
        />

        <Divider />

        <CardContent>
          <AddSchool />
        </CardContent>
      </Card>
    </Page>
  );
};

export default connector(NewSchool);
