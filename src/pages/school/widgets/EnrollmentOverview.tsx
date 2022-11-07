import React from 'react';
import useSWR from 'swr';
import { useSelector } from 'react-redux';
import { useIntl } from 'react-intl';
import { Box } from '@mui/material';
import { GridToolbar, LicenseInfo, DataGridPro } from '@mui/x-data-grid-pro';

import { userActiveSchoolSelector, userActiveSeasonSelector } from 'store/user';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'store/auth';
import fetcher from 'utils/fetcher';
import Widget from 'components/dashboard/Widget';
import { SMARTCLASS_LEGACY_URL } from 'pages/smartclass/SmartClass';

LicenseInfo.setLicenseKey(process.env.REACT_APP_MATERIALUI_KEY);

const EnrollmentOverview = () => {
  const lang = useSelector(i18nLangSelector);
  const user = useSelector(authUserSelector);
  const activeSchool = useSelector(userActiveSchoolSelector);
  const activeSeason = useSelector(userActiveSeasonSelector);
  const intl = useIntl();

  const urlParams = `op=dashboard&action=enrollmentOverview&refresh=1&frontend=1&format=json&newlang=${lang}&accessToken=${user?.accessToken}&schoolId=${activeSchool?.id}&seasonId=${activeSeason?.database}`;
  const enrollmentOverviewLegacyUrl =
    process.env.NODE_ENV === 'production'
      ? `https://${SMARTCLASS_LEGACY_URL}/index.php?${urlParams}`
      : `${SMARTCLASS_LEGACY_URL}/index.php?${urlParams}`;

  const { data } = useSWR([enrollmentOverviewLegacyUrl, false], fetcher);

  return (
    <Widget height='auto' title={intl.formatMessage({ id: 'dashboard.enrollment.overview' })}>
      <Box
        sx={{
          height: '100%',
          minHeight: 500,
          width: '100%'
        }}
      >
        {data && (
          <DataGridPro
            autoHeight={true}
            columns={data?.columns || []}
            rows={data?.dataSource || []}
            components={{
              Toolbar: GridToolbar
            }}
            disableColumnMenu
            disableSelectionOnClick
          />
        )}
      </Box>
    </Widget>
  );
};

export default EnrollmentOverview;
