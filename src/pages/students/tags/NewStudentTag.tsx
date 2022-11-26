import React from 'react';
import { useNavigate } from 'react-router';
import { Box, Card, CardContent, CardHeader, Divider } from '@mui/material';

import { Page } from 'layout/Page';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';

import StudentTagsForm from './StudentTagsForm';
import { IBreadcrumb } from 'pages/admin/menu-types';

const NewStudentTag = () => {
  const intl = useTranslation();
  const navigate = useNavigate();
  const subheader = useSubheader();

  const transStudentTag = intl.translate({ id: 'student.tag' });
  const transStudentTags = intl.translate({ id: 'student.tags' });
  const transNewStudentTag = intl.translate(
    { id: 'app.add.something' },
    { something: transStudentTag }
  );

  React.useEffect(() => {
    const breadcrumbs: IBreadcrumb[] = [];
    breadcrumbs.push({ title: transStudentTags, url: '/student/tags', original: true });
    breadcrumbs.push({ title: transNewStudentTag, url: '/student/tags/new', original: true });
    subheader.setBreadcrumbs(breadcrumbs);
  }, []);

  return (
    <Page title={transNewStudentTag}>
      <Box
        sx={{
          display: 'flex',
          height: '100%',
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <Card sx={{ width: '100%' }}>
          <CardHeader title={transNewStudentTag} />
          <Divider />
          <CardContent>
            <StudentTagsForm actionType='add' handleClose={() => navigate('/student/tags')} />
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default NewStudentTag;
