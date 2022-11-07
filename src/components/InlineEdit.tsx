import React from 'react';
import { Box, TextField } from '@mui/material';
import useKeypress from '../hooks/useKeypress';
import useOnClickOutside from '../hooks/useOnClickOutside';
import DOMPurify from 'dompurify';

type TInlineEditProps = {
  text: string;
  onSetText: (value: string) => void;
};

const InlineEdit: React.FC<TInlineEditProps> = (props) => {
  const { text, onSetText } = props;
  const [isInputActive, setIsInputActive] = React.useState(false);
  const [inputValue, setInputValue] = React.useState(text);

  const wrapperRef = React.useRef(null);
  const textRef = React.useRef(null);
  const inputRef = React.useRef(null);

  const enter = useKeypress('Enter');
  const esc = useKeypress('Escape');

  // check to see if the user clicked outside of this component
  useOnClickOutside(wrapperRef, () => {
    if (isInputActive) {
      onSetText(inputValue);
      setIsInputActive(false);
    }
  });

  const onEnter = React.useCallback(() => {
    if (enter) {
      onSetText(inputValue);
      setIsInputActive(false);
    }
  }, [enter, inputValue, onSetText]);

  const onEsc = React.useCallback(() => {
    if (esc) {
      setInputValue(text);
      setIsInputActive(false);
    }
  }, [esc, text]);

  // focus the cursor in the input field on edit start
  React.useEffect(() => {
    if (isInputActive) {
      inputRef.current.focus();
    }
  }, [isInputActive]);

  React.useEffect(() => {
    if (isInputActive) {
      // if Enter is pressed, save the text and close the editor
      onEnter();
      // if Escape is pressed, revert the text and close the editor
      onEsc();
    }
  }, [onEnter, onEsc, isInputActive]); // watch the Enter and Escape key presses

  const handleInputChange = React.useCallback(
    (event) => {
      // sanitize the input a little
      setInputValue(DOMPurify.sanitize(event.target.value));
    },
    [setInputValue]
  );

  const handleSpanClick = React.useCallback(() => setIsInputActive(true), [setIsInputActive]);

  return (
    <Box sx={{ width: '100%' }} className='inline-text' ref={wrapperRef}>
      <Box
        ref={textRef}
        onClick={handleSpanClick}
        className={`inline-text_copy inline-text_copy--${!isInputActive ? 'active' : 'hidden'}`}
      >
        {props.text}
      </Box>
      <TextField
        sx={{ padding: 0 }}
        ref={inputRef}
        multiline={true}
        fullWidth={true}
        value={inputValue}
        onChange={handleInputChange}
        className={`inline-text_input inline-text_input--${isInputActive ? 'active' : 'hidden'}`}
      />
    </Box>
  );
};

export default InlineEdit;
