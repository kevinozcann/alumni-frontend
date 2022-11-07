import React from 'react';
import { useIntl } from 'react-intl';
import {
  Avatar,
  Box,
  Button,
  Divider,
  ListItemIcon,
  MenuItem,
  MenuList,
  Popover,
  Skeleton,
  Typography
} from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faChevronDown, faChevronUp } from '@fortawesome/pro-duotone-svg-icons';

import { IStudent } from 'pages/students/_store/types';
import StudentAvatar from './StudentAvatar';

type TStudentsPopoverParams = {
  parentStudents: IStudent[];
  activeStudent: IStudent;
  parentStudentsPhase: string;
  changeStudent?: (student: IStudent) => any;
};

const StudentsPopover = ({
  parentStudents,
  parentStudentsPhase,
  activeStudent,
  changeStudent
}: TStudentsPopoverParams) => {
  const stdAnchorRef = React.useRef<HTMLButtonElement | null>(null);
  const [open, setOpen] = React.useState<boolean>(false);
  const intl = useIntl();

  const handleOpen = (): void => {
    setOpen(true);
  };

  const handleClose = (): void => {
    setOpen(false);
  };

  const handleClick = (student: IStudent) => {
    handleClose();

    changeStudent(student);
  };

  React.useEffect(() => {
    // Update the current student
    if (!activeStudent) {
      changeStudent(parentStudents[0]);
    }
  }, [parentStudents]);

  return (
    (parentStudents.length > 0 && (
      <Box
        sx={{
          alignItems: 'center',
          borderRadius: 1,
          display: 'flex',
          overflow: 'hidden',
          p: 2
        }}
      >
        {(parentStudentsPhase?.includes('ing') && (
          <Skeleton variant='rectangular' height={40} />
        )) || (
          <React.Fragment>
            <Box
              onClick={handleOpen}
              ref={stdAnchorRef}
              sx={{
                display: 'flex',
                width: '100%'
              }}
            >
              <Button
                sx={{
                  textTransform: 'none',
                  whiteSpace: 'nowrap',
                  py: 1,
                  px: 1.5,
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'flex-start'
                }}
                size='small'
                variant='outlined'
                startIcon={
                  <Avatar
                    src={activeStudent?.photo}
                    sx={{
                      cursor: 'pointer',
                      height: 36,
                      width: 36
                    }}
                  />
                }
                endIcon={
                  parentStudents?.length > 1 &&
                  ((!open && <FontAwesomeIcon icon={faChevronDown} />) || (
                    <FontAwesomeIcon icon={faChevronUp} />
                  ))
                }
              >
                <Box
                  sx={{
                    display: 'flex',
                    flexGrow: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'self-start'
                  }}
                >
                  {/* Student Name */}
                  <Typography color='textPrimary' variant='subtitle2'>
                    {activeStudent?.fullName}
                  </Typography>
                  {/* <Typography color='textSecondary' variant='body2'>
                  6-A
                </Typography> */}
                </Box>
              </Button>
            </Box>

            {parentStudents && parentStudents?.length > 1 && (
              <Popover
                anchorEl={stdAnchorRef.current}
                anchorOrigin={{
                  horizontal: 'left',
                  vertical: 'bottom'
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'left'
                }}
                keepMounted
                onClose={handleClose}
                open={open}
                PaperProps={{
                  sx: { minWidth: 200, maxWidth: 230 }
                }}
              >
                <Box sx={{ p: 1 }}>
                  <Typography color='textPrimary' variant='subtitle2'>
                    {intl.formatMessage({ id: 'app.select.student' })}
                  </Typography>

                  <Divider sx={{ mt: 1 }} />

                  <MenuList>
                    {parentStudents?.map((std) => {
                      return (
                        <MenuItem key={std.id} sx={{ p: 0 }} onClick={() => handleClick(std)}>
                          <ListItemIcon>
                            <StudentAvatar student={std} />
                          </ListItemIcon>
                        </MenuItem>
                      );
                    })}
                  </MenuList>
                </Box>
              </Popover>
            )}
          </React.Fragment>
        )}
      </Box>
    )) ||
    null
  );
};

export default StudentsPopover;
