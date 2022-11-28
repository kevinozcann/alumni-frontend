import React from 'react';
import { Link as RouterLink } from 'react-router-dom';
import { useIntl } from 'react-intl';
import { Box, Breadcrumbs, Grid, Link, Typography } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export interface IBreadcrumb {
  url: string;
  title: string;
  original?: boolean;
}

type TBreadcrumbsProps = {
  breadcrumbs: IBreadcrumb[];
};

const BreadCrumbs = (props: TBreadcrumbsProps) => {
  const { breadcrumbs } = props;
  const intl = useIntl();
  const title =
    (breadcrumbs && breadcrumbs.length > 0 && breadcrumbs[breadcrumbs.length - 1]) || null;

  return (
    <Grid container justifyContent='space-between' spacing={3}>
      <Grid item>
        <Box sx={{ display: 'flex' }}>
          <Breadcrumbs
            aria-label='breadcrumb'
            separator={<FontAwesomeIcon icon={['fad', 'angle-right']} color='primary.main' />}
          >
            {!!breadcrumbs &&
              breadcrumbs.map((item) => (
                <Link
                  key={item.title}
                  color='textPrimary'
                  component={RouterLink}
                  to={item.url}
                  variant='subtitle2'
                >
                  {item.original ? item.title : intl.formatMessage({ id: item.title })}
                </Link>
              ))}
          </Breadcrumbs>
        </Box>
      </Grid>
    </Grid>
  );
};

export default BreadCrumbs;
