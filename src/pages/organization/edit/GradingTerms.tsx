import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { Link as RouterLink, useParams, useNavigate } from 'react-router-dom';
import loadable, { lazy } from '@loadable/component';
import {
  Box,
  Card,
  CardHeader,
  Divider,
  CardContent,
  Grid,
  CardActions,
  Button
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGraduationCap, faPlus } from '@fortawesome/pro-duotone-svg-icons';
import { format } from 'date-fns';

import { Loadable } from 'layout';
import { AppDispatch, RootState } from 'store/store';
import { authUserSelector } from 'pages/auth/services/auth';
import { i18nLangSelector } from 'store/i18n';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'pages/profile/services/user';
import { configActions, configPhaseSelector } from 'store/config';
import useTranslation from 'hooks/useTranslation';
import { TLang } from 'utils/shared-types';
import ResponsiveActions from 'components/ResponsiveActions';
import { IUser } from 'pages/auth/data/account-types';
import ConfirmDialog from 'components/ConfirmDialog';

const SchoostDialog = loadable(() => import('components/SchoostDialog'));
const GradingTermForm = Loadable(lazy(() => import('pages/organization/add/GradingTermForm')));

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state),
  configPhase: configPhaseSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  deleteGradingTerm: (lang: TLang, user: IUser, gradingTermId: number) =>
    dispatch(configActions.deleteGradingTerm(lang, user, gradingTermId)),
  resetPhase: () => dispatch(configActions.setPhase(null))
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TGradingTermsProps = PropsFromRedux;

const GradingTerms = (props: TGradingTermsProps) => {
  const { lang, user, configPhase, activeSchool, activeSeason, deleteGradingTerm, resetPhase } =
    props;
  const { subsection, subaction, gid } = useParams();
  const gradingTerms = activeSeason?.gradingTerms || [];
  const [isDeleted, setDeleted] = React.useState<boolean>(false);
  const navigate = useNavigate();
  const intl = useTranslation();

  const transGradingTerm = intl.translate({ id: 'gradings.term' });
  const transSeasonGradingTerms = intl.translate(
    { id: 'gradings.terms.w.season' },
    { season: activeSeason?.title || '' }
  );

  const handleDeleteConfirm = () => {
    setDeleted(true);
    deleteGradingTerm(lang, user.attributes, parseInt(gid));
  };

  const handleDialogClose = () => {
    navigate(`/organization/${activeSchool.id}/seasons`);
  };

  React.useEffect(() => {
    if (gid && isDeleted && configPhase === 'success') {
      handleDialogClose();
    }
  }, [gid, configPhase]);

  React.useEffect(() => {
    resetPhase();
  }, []);

  return (
    <Box>
      <Card>
        <CardHeader
          title={transSeasonGradingTerms}
          subheader={intl.translate({ id: 'gradings.terms.season_change' })}
          action={
            <ResponsiveActions
              actions={[
                {
                  key: 'add',
                  title: intl.translate(
                    { id: 'app.add.something' },
                    { something: transGradingTerm }
                  ),
                  startIcon: <FontAwesomeIcon icon={faPlus} />,
                  navigate: `/organization/${activeSchool.id}/seasons/view/grading-terms/new`
                }
              ]}
            />
          }
        />
        <Divider />

        <CardContent>
          <Grid container spacing={2}>
            {gradingTerms?.map((term) => {
              const startsAt = new Date(term.startDate);
              const endsAt = new Date(term.endDate);

              return (
                <Grid key={term.id} item xs={12} md={6}>
                  <Card>
                    <CardHeader
                      avatar={<FontAwesomeIcon icon={faGraduationCap} />}
                      title={term.title}
                      subheader={`${format(startsAt, 'P')} - ${format(endsAt, 'P')}`}
                    />
                    <CardActions>
                      <Box sx={{ flexGrow: 1 }} />
                      <Button
                        component={RouterLink}
                        to={`/organization/${activeSchool.id}/seasons/view/grading-terms/edit/${term.id}`}
                        aria-label='edit'
                        color='primary'
                      >
                        {intl.translate({ id: 'app.edit' })}
                      </Button>
                      <Button
                        component={RouterLink}
                        to={`/organization/${activeSchool.id}/seasons/view/grading-terms/delete/${term.id}`}
                        aria-label='delete'
                        color='secondary'
                      >
                        {intl.translate({ id: 'app.delete' })}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </CardContent>
      </Card>

      {/* Add grading term */}
      {subsection === 'grading-terms' && subaction === 'new' && (
        <SchoostDialog
          title={intl.translate({ id: 'app.add.something' }, { something: transGradingTerm })}
          isOpen={subsection === 'grading-terms' && subaction === 'new'}
          dividers={true}
          handleClose={handleDialogClose}
        >
          <GradingTermForm handleClose={handleDialogClose} />
        </SchoostDialog>
      )}

      {/* Edit grading term */}
      {subsection === 'grading-terms' && subaction === 'edit' && (
        <SchoostDialog
          title={intl.translate({ id: 'app.edit.something' }, { something: transGradingTerm })}
          isOpen={subsection === 'grading-terms' && subaction === 'edit'}
          dividers={true}
          handleClose={handleDialogClose}
        >
          <GradingTermForm gradingTerms={gradingTerms} handleClose={handleDialogClose} />
        </SchoostDialog>
      )}

      {/* Delete Confirm */}
      {subsection === 'grading-terms' && subaction === 'delete' && (
        <ConfirmDialog
          handleClose={handleDialogClose}
          handleConfirm={handleDeleteConfirm}
          isOpen={subsection === 'grading-terms' && subaction === 'delete'}
          phase={configPhase}
        />
      )}
    </Box>
  );
};

export default connector(GradingTerms);
