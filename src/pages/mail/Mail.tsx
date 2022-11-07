import React from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';
import { Box } from '@mui/material';

import Page from 'layout/Page';
import { authUserSelector } from 'store/auth';
import useSettings from 'hooks/useSettings';
import useTranslation from 'hooks/useTranslation';
import { useSubheader } from 'contexts/SubheaderContext';
import { TActionType } from 'utils/shared-types';
import { IUser } from 'pages/account/account-types';

import { mailActions } from './_store';
import { composeSelector, mailsPhaseSelector, mailsSelector } from './_store/selectors';
import { IMail, IUserMail } from './mail-types';

const MailSidebar = loadable(() => import('./MailSidebar'));
const MailList = loadable(() => import('./MailList'));
const MailContent = loadable(() => import('./MailContent'));
const MailComposer = loadable(() => import('./MailComposer'));

const Mail = () => {
  const { section, label, id } = useParams();
  const [mails, setMails] = React.useState<IUserMail[]>([]);
  const rootRef = React.useRef<HTMLDivElement | null>(null);
  const dispatch = useDispatch();
  const intl = useTranslation();
  const navigate = useNavigate();
  const { settings } = useSettings();
  const subheader = useSubheader();

  // Selectors
  const user = useSelector(authUserSelector);
  const allMails = useSelector(mailsSelector);
  const mailsPhase = useSelector(mailsPhaseSelector);
  const isComposeOpen = useSelector(composeSelector);

  // Dispatches
  const pullMails = (user: IUser) => dispatch(mailActions.pullMails(user));
  const updateMail = (mailId: number, mailInfo: Partial<IUserMail>, actionType: TActionType) =>
    dispatch(mailActions.updateMail(mailId, mailInfo, actionType));

  const handleStarClick = React.useCallback(
    (mailId: number, starred: boolean) => {
      updateMail(mailId, { isStarred: starred }, 'update');
    },
    [updateMail]
  );

  const handleForwardClick = React.useCallback(
    (email: IMail) => {
      if (!isComposeOpen) dispatch(mailActions.updateCompose());
      dispatch(mailActions.updateDraft(email));
    },
    [updateMail]
  );

  React.useEffect(() => {
    const filteredMails = () => {
      if (id) {
        return allMails?.filter((mail: Partial<IUserMail>) => mail.id === parseInt(id));
      } else if (section === 'trash') {
        return allMails?.filter((mail: Partial<IUserMail>) => mail.isTrashed);
      } else if (section === 'drafts') {
        return allMails?.filter((mail: Partial<IUserMail>) => mail.isDraft && !mail.isTrashed);
      } else if (section === 'sent') {
        return allMails?.filter(
          (mail: Partial<IUserMail>) => mail.isSender && !mail.isTrashed && !mail.isDraft
        );
      } else if (section === 'starred') {
        return allMails?.filter((mail: Partial<IUserMail>) => mail.isStarred && !mail.isTrashed);
      } else {
        return allMails?.filter(
          (mail) => (mail.isTo || mail.isCc || mail.isBcc) && !mail.isTrashed && !mail.isDraft
        );
      }
    };

    if (!allMails || allMails.length === 0) {
      setMails([]);
    }

    setMails(filteredMails());
  }, [allMails, section, id]);

  React.useEffect(() => {
    pullMails(user);
  }, []);

  React.useEffect(() => {
    if (!section && !label) {
      navigate('/mail/inbox');
    }
  }, [section, label, navigate]);

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'email.email', url: '/mail' });
    if (section) {
      breadcrumbs.push({
        title: intl.formatMessage({ id: `email.${section}` }),
        url: `/mail/${section}`,
        original: true
      });
    }
    if (label) {
      breadcrumbs.push({
        title: label,
        url: `/mail/label/${label}`,
        original: true
      });
    }
    subheader.setBreadcrumbs(breadcrumbs);
  }, [section, label]);

  return (
    <Page title={intl.translate({ id: 'email.email' })}>
      <Box
        ref={rootRef}
        sx={{
          display: 'flex',
          height: `calc(100vh - ${settings.mainHeightGutter}px)`,
          overflow: 'hidden',
          position: 'relative'
        }}
      >
        <MailSidebar containerRef={rootRef} />
        {(id && (
          <MailContent
            mail={mails && mails[0]}
            section={section}
            label={label}
            handleStarClick={handleStarClick}
          />
        )) || (
          <MailList
            mails={mails}
            section={section}
            phase={mailsPhase}
            handleStarClick={handleStarClick}
            handleForwardClick={handleForwardClick}
          />
        )}
        <MailComposer />
      </Box>
    </Page>
  );
};

export default Mail;
