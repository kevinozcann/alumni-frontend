import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import * as numberOfUsers from '../_store/numberOfUsers';
import { NumberOfUsersView } from './NumberOfUsersView';

const mapStateToProps = (state) => ({
  nofUsers: numberOfUsers.nofUsersSelector(state),
  phase: numberOfUsers.phaseSelector(state),
  error: numberOfUsers.errorSelector(state)
});

const mapDispatchToProps = (dispatch) => ({
  pullNumberOfUsers: () => dispatch(numberOfUsers.actions.pullNumberOfUsers())
});

export const NumberOfUsers = injectIntl(
  connect(mapStateToProps, mapDispatchToProps)(NumberOfUsersView)
);
