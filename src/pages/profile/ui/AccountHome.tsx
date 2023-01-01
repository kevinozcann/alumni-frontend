import loadable from '@loadable/component';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';

import NewPost from 'pages/posts/ui/NewPost';

const About = loadable(() => import('./profile/About'));
const Posts = loadable(() => import('pages/posts/ui/Posts'));

const AccountHome = () => {
  return (
    <Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <NewPost />
          <Posts />
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountHome;
