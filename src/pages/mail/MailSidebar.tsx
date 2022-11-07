import React from 'react';
import { useLocation } from 'react-router-dom';
import { connect, ConnectedProps } from 'react-redux';
import { Box, Button, Divider, Drawer, List } from '@mui/material';
import { styled } from '@mui/material/styles';

import { AppDispatch, RootState } from 'store/store';
import useTranslation from 'hooks/useTranslation';

import { mailActions } from './_store/mailActions';
import { labelsSelector, sidebarSelector } from './_store/selectors';
import MailLabel from './MailLabel';

const MailSidebarDesktop = styled(Drawer)({
  width: 200,
  '& .MuiDrawer-paper': {
    position: 'relative'
  }
});
const MailSidebarMobile = styled(Drawer)({
  '& .MuiBackdrop-root': {
    position: 'absolute'
  },
  '& .MuiDrawer-paper': {
    position: 'relative',
    width: 200
  }
});

const mapStateToProps = (state: RootState) => ({
  labels: labelsSelector(state),
  isSidebarOpen: sidebarSelector(state)
});
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  updateCompose: () => dispatch(mailActions.updateCompose()),
  updateSidebar: () => dispatch(mailActions.updateSidebar())
});
const connector = connect(mapStateToProps, mapDispatchToProps);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TMailSidebarProps = PropsFromRedux & {
  containerRef: React.MutableRefObject<HTMLDivElement>;
};

const MailSidebar = (props: TMailSidebarProps) => {
  const { labels, isSidebarOpen, updateSidebar, updateCompose, containerRef } = props;
  const location = useLocation();
  const intl = useTranslation();

  React.useEffect(() => {
    if (isSidebarOpen) {
      updateSidebar();
    }
  }, [location.pathname]);

  const content = (
    <div>
      <Box sx={{ p: 2, height: 68 }}>
        <Button color='primary' fullWidth onClick={updateCompose} variant='contained'>
          {intl.translate({ id: 'email.compose' })}
        </Button>
      </Box>
      <Divider />
      <Box sx={{ p: 1 }}>
        <List>
          {labels.map((label) => (
            <MailLabel key={label.id} label={label} />
          ))}
        </List>
      </Box>
    </div>
  );

  return (
    <React.Fragment>
      <MailSidebarDesktop sx={{ display: { xs: 'none', md: 'block' } }} variant='permanent'>
        {content}
      </MailSidebarDesktop>

      <MailSidebarMobile
        sx={{ display: { xs: 'block', md: 'none' } }}
        ModalProps={{ container: () => containerRef.current }}
        onClose={updateSidebar}
        open={isSidebarOpen}
        variant='temporary'
      >
        {content}
      </MailSidebarMobile>
    </React.Fragment>
  );
};

export default connector(MailSidebar);
