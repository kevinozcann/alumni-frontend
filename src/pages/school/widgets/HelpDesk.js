import { connect } from 'react-redux';
import { injectIntl } from 'react-intl';
import { i18nLangSelector } from '../../../store/i18n';
import { HelpDeskView } from './HelpDeskView';
import { helpdeskIncidentsActions, helpdeskIncidentsSelector } from '../_store/helpdeskIncidents';

const mapStateToProps = (state) => ({
  lang: i18nLangSelector(state),
  helpdeskIncidents: helpdeskIncidentsSelector(state)
});

const mapDispatchToProps = (dispatch) => ({
  pullHelpdeskIncidents: (lang) => dispatch(helpdeskIncidentsActions.pullHelpdeskIncidents(lang))
});

export const HelpDesk = injectIntl(connect(mapStateToProps, mapDispatchToProps)(HelpDeskView));
