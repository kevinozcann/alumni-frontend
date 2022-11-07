import React from 'react';
import loadable from '@loadable/component';
import { useDispatch, useSelector } from 'react-redux';
import { Box, Divider, Skeleton } from '@mui/material';

import Scrollbar from 'layout/Scrollbar';

import { mailActions } from './_store';
import { labelsSelector } from './_store/selectors';
import { IMail, IUserMail } from './mail-types';

const MailListToolbar = loadable(() => import('./MailListToolbar'));
const MailItem = loadable(() => import('./MailItem'));

type TMailListProps = {
  mails: IUserMail[];
  section: string;
  phase: string;
  handleStarClick: (mailId: number, starred: boolean) => void;
  handleForwardClick: (email: IMail) => void;
};

const MailList = (props: TMailListProps) => {
  const { mails, section, phase, handleStarClick, handleForwardClick } = props;
  const [searchMails, setSearchMails] = React.useState<IUserMail[]>([]);
  const labels = useSelector(labelsSelector);
  const dispatch = useDispatch();

  // Local states
  const [selectedMails, setSelectedMails] = React.useState<number[]>([]);

  // Mail phase dispatcher
  const setMailPhase = (phase: string) => dispatch(mailActions.setPhase(phase));

  const handleSelectAllMails = () => {
    setSelectedMails(mails.map((mail) => mail.id));
  };

  const handleDeselectAllMails = () => {
    setSelectedMails([]);
  };

  const handleSelectOneMail = (mailId: number) => {
    setSelectedMails((prevSelectedMails) => {
      if (!prevSelectedMails.includes(mailId)) {
        return [...prevSelectedMails, mailId];
      }

      return prevSelectedMails;
    });
  };

  const handleDeselectOneMail = (mailId: number) => {
    setSelectedMails((prevSelectedMails) => prevSelectedMails.filter((id) => id !== mailId));
  };

  React.useEffect(() => {
    setMailPhase(null);
    setSearchMails(mails);
  }, [mails]);

  return (
    <Box
      sx={{
        backgroundColor: 'background.default',
        flexGrow: 1,
        overflow: 'hidden'
      }}
    >
      <MailListToolbar
        mails={mails}
        section={section}
        onDeselectAll={handleDeselectAllMails}
        onSelectAll={handleSelectAllMails}
        phase={phase}
        selectedMails={selectedMails}
        setSearchMails={setSearchMails}
      />
      <Divider />

      <Scrollbar
        style={{ paddingBottom: 70 }}
        options={{ suppressScrollX: true, wheelSpeed: 2, wheelPropagation: false }}
      >
        {searchMails?.map((mail) => (
          <MailItem
            handleStarClick={handleStarClick}
            handleForwardClick={handleForwardClick}
            key={mail.id}
            labels={labels}
            mail={mail}
            onDeselect={() => handleDeselectOneMail(mail.id)}
            onSelect={() => handleSelectOneMail(mail.id)}
            selected={selectedMails.includes(mail.id)}
          />
        )) || (
          <React.Fragment>
            {[1, 2, 3, 4, 5, 6, 7].map((key) => (
              <Skeleton
                key={key}
                sx={{
                  backgroundColor: 'background.paper',
                  borderBottom: (theme) => ` 1px solid ${theme.palette.divider}`
                }}
                variant='rectangular'
                height={75}
              />
            ))}
          </React.Fragment>
        )}
      </Scrollbar>
    </Box>
  );
};

export default MailList;
