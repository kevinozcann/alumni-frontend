import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { useIntl } from 'react-intl';

import { AppDispatch, RootState } from 'store/store';
import {
  authUserSelector,
  authActions,
  authPhaseSelector,
  authErrorSelector,
  TUserPassword
} from 'store/auth';
import { userActiveSchoolSelector, userSchoolsSelector } from 'store/user';
import { i18nLangSelector } from 'store/i18n';
import { useSubheader } from 'contexts/SubheaderContext';
import { TLang } from 'utils/shared-types';
import { toAbsoluteUrl } from 'utils/AssetsHelpers';

const mapStateToProps = (state: RootState) => ({});
const mapDispatchToProps = (dispatch: AppDispatch) => ({});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TAccountProps = PropsFromRedux;

const Api = (props: TAccountProps) => {
  const { section } = useParams();
  const [activePage, setActivePage] = React.useState<string>(section);
  const intl = useIntl();
  const navigate = useNavigate();

  return null;
};

// export default connector(Api);
export default Api;
