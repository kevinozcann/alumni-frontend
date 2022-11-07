import * as React from 'react';
import {
  MenuList,
  Box,
  MenuItem,
  Popper,
  Paper,
  ClickAwayListener,
  Grow,
  Button,
  ButtonGroup
} from '@mui/material';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';

interface ButtonOption {
  id: string | number;
  title: string;
  icon?: React.ReactElement;
  handleOptionClick?: () => void;
}

type TSplitButtonProps = {
  title: string;
  variant?: 'contained' | 'outlined' | 'text';
  options: ButtonOption[];
};

const SplitButton = (props: TSplitButtonProps) => {
  const { title, variant, options } = props;
  const [open, setOpen] = React.useState<boolean>(false);
  const [selectedIndex, setSelectedIndex] = React.useState<number>(0);
  const anchorRef = React.useRef<HTMLDivElement>(null);

  const handleClick = () => {
    options[selectedIndex].handleOptionClick();
  };

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    index: number,
    handleOptionClick?: () => void
  ) => {
    setSelectedIndex(index);
    setOpen(false);
    if (handleOptionClick) {
      handleOptionClick();
    }
  };

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen);
  };

  const handleClose = (event: Event) => {
    if (anchorRef.current && anchorRef.current.contains(event.target as HTMLElement)) {
      return;
    }

    setOpen(false);
  };

  return (
    <React.Fragment>
      <ButtonGroup variant={variant || 'outlined'} ref={anchorRef} aria-label={`${title} button`}>
        <Button
          sx={{ border: '0 !important' }}
          startIcon={(options[selectedIndex].icon && options[selectedIndex].icon) || null}
          onClick={handleClick}
        >
          {options[selectedIndex].title}
        </Button>
        <Button
          aria-controls={open ? `${title} button` : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label={options[selectedIndex].title}
          aria-haspopup='menu'
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper open={open} anchorEl={anchorRef.current} role={undefined} transition disablePortal>
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin: placement === 'bottom' ? 'center top' : 'center bottom'
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id={`${title}-button-menu`}>
                  {options.map((option, index) => {
                    const { id, title, icon, handleOptionClick } = option;
                    return (
                      <MenuItem
                        key={id}
                        selected={index === selectedIndex}
                        onClick={(event) => handleMenuItemClick(event, index, handleOptionClick)}
                      >
                        {(icon && (
                          <>
                            {icon}
                            <Box sx={{ width: '8px' }}></Box>
                          </>
                        )) ||
                          ''}
                        {title}
                      </MenuItem>
                    );
                  })}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </React.Fragment>
  );
};

export default SplitButton;
