import React from 'react';
import { useDispatch } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  Box,
  Button,
  Divider,
  ListItemIcon,
  ListItemText,
  MenuItem,
  MenuList,
  Popover,
  Typography
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faBuilding,
  faChevronDown,
  faSchool,
  faUniversity
} from '@fortawesome/pro-duotone-svg-icons';
import 'intro.js/introjs.css';

import Scrollbar from 'layout/Scrollbar';
import { authActions } from 'store/auth';
import BasicSearch from 'utils/BasicSearch';
import getFlatSchools from 'utils/getFlatSchools';
import { ISchool, TSchoolType } from 'pages/organization/organization-types';

const schoolIcon = (type: TSchoolType): React.ReactElement => {
  return type === 'headquarters' ? (
    <FontAwesomeIcon icon={faUniversity} />
  ) : type === 'campus' ? (
    <FontAwesomeIcon icon={faBuilding} />
  ) : (
    <FontAwesomeIcon icon={faSchool} />
  );
};

type TSchoolsPopoverParams = {
  headerText?: string;
  align?: 'left' | 'center' | 'right';
  schools: ISchool[];
  activeSchool: ISchool;
  changeSchool?: (school: ISchool) => void;
};

const SchoolsPopover = (props: TSchoolsPopoverParams) => {
  const { schools, activeSchool, headerText, align, changeSchool } = props;
  const anchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [searchKey, setSearchKey] = React.useState<string>();
  const [allSchools, setAllSchools] = React.useState([]);
  const [open, setOpen] = React.useState<boolean>(false);
  const dispatch = useDispatch();
  const intl = useIntl();

  const headerMessage = headerText || intl.formatMessage({ id: 'app.select_school' });

  const handleSearchChange = (searchInput: string) => {
    setSearchKey(searchInput);
  };

  const searchInItem = (searchInput: string, item: ISchool) => {
    return searchInput ? item.title.toLowerCase().includes(searchInput.toLowerCase()) : true;
  };

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleClick = (school: ISchool): void => {
    handleClose();

    if (activeSchool.id !== school.id) {
      changeSchool(school);
    }
  };

  React.useEffect(() => {
    try {
      const flatSchools = getFlatSchools(schools);
      setAllSchools(flatSchools);
    } catch (e) {
      console.log(e);
    }
  }, [schools]);

  return (
    <React.Fragment>
      {/* <Steps
        enabled={
          transfer && localStorage.getItem('teacherTransferSchoolIntro') !== '1' && stepsEnabled
        }
        steps={[
          {
            element: '.schoolPopoverButton',
            intro: intl.formatMessage({ id: 'intro.teacher.transfer_school_change' }),
            position: 'right'
          }
        ]}
        initialStep={0}
        onExit={() => setStepsEnabled(false)}
        onComplete={() => localStorage.setItem('teacherTransferSchoolIntro', '1')}
        options={{
          showBullets: false,
          doneLabel: intl.formatMessage({ id: 'intro.done' })
        }}
      /> */}

      <Box
        onClick={allSchools?.length > 1 ? handleOpen : null}
        ref={anchorRef}
        sx={{
          display: 'flex',
          '& svg': {
            fontSize: '14px !important'
          }
        }}
      >
        <Button
          className='schoolPopoverButton'
          sx={{ textTransform: 'none', whiteSpace: 'nowrap', px: 1 }}
          size='small'
          variant='outlined'
          startIcon={schoolIcon(activeSchool.type)}
          endIcon={allSchools?.length > 1 && <FontAwesomeIcon icon={faChevronDown} />}
        >
          {activeSchool.menuTitle}
        </Button>
      </Box>

      {allSchools?.length > 1 && (
        <Popover
          anchorEl={anchorRef.current}
          anchorOrigin={{
            horizontal: 'right',
            vertical: 'bottom'
          }}
          transformOrigin={{
            vertical: 'top',
            horizontal: align
          }}
          keepMounted
          onClose={handleClose}
          open={open}
          PaperProps={{
            sx: { minWidth: 240, maxWidth: 340 }
          }}
        >
          <Box sx={{ p: 2 }}>
            <Typography color='textPrimary' variant='subtitle2'>
              {headerMessage}
            </Typography>
          </Box>

          <Divider />

          {allSchools.length > 10 && (
            <React.Fragment>
              <Box sx={{ p: 2 }}>
                <BasicSearch onChange={handleSearchChange} />
              </Box>
              <Divider />
            </React.Fragment>
          )}

          <Scrollbar options={{ suppressScrollX: true, wheelSpeed: 2 }}>
            <Box sx={{ height: 'auto', maxHeight: 300 }}>
              <MenuList>
                {allSchools?.map((school: ISchool) => {
                  return searchInItem(searchKey, school) ? (
                    <MenuItem
                      key={school.id}
                      onClick={() => handleClick(school)}
                      sx={{
                        backgroundColor: school.id === activeSchool.id ? 'background.default' : null
                      }}
                    >
                      <ListItemIcon sx={{ marginLeft: school.itemMargin }}>
                        {schoolIcon(school.type)}
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography
                            color={`${school.isActive ? 'textPrimary' : 'GrayText'}`}
                            variant='subtitle2'
                          >
                            {school.title}
                          </Typography>
                        }
                      />
                      {school.id === activeSchool.id && (
                        <ListItemIcon>
                          <CheckCircleIcon color='success' />
                        </ListItemIcon>
                      )}
                    </MenuItem>
                  ) : null;
                })}
              </MenuList>
            </Box>
          </Scrollbar>
        </Popover>
      )}
    </React.Fragment>
  );
};

export default SchoolsPopover;
