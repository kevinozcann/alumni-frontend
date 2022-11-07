import React from 'react';
import { useIntl } from 'react-intl';
import Highlight from 'react-highlight.js';
import CopyToClipboard from 'react-copy-to-clipboard';
import { Box, IconButton } from '@mui/material';
import CheckIcon from '@mui/icons-material/Check';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';

import 'theme/scss/highlight.css';

type THighlightCodeProps = {
  language?: string;
  textToCopy?: string;
  styleTop?: string;
  children: string;
};

const HighlightCode = (props: THighlightCodeProps) => {
  const { language, textToCopy, styleTop, children } = props;
  const [isCopied, setCopied] = React.useState<boolean>(false);
  const intl = useIntl();

  React.useEffect(() => {
    if (isCopied) {
      const timer = setTimeout(() => {
        setCopied(false);
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isCopied]);

  return (
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ position: 'absolute', right: '20px', top: styleTop || '20px' }}>
        <CopyToClipboard text={textToCopy || children} onCopy={() => setCopied(true)}>
          <IconButton
            size='small'
            aria-label={(isCopied && 'copied') || 'copy'}
            title={intl.formatMessage({ id: (isCopied && 'app.copied') || 'app.copy' })}
          >
            {(isCopied && <CheckIcon />) || <ContentCopyIcon sx={{ cursor: 'pointer' }} />}
          </IconButton>
        </CopyToClipboard>
      </Box>

      <Highlight language={language || 'javascript'}>{children}</Highlight>
    </Box>
  );
};

export default HighlightCode;
