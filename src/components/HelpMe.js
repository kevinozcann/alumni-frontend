import React, { lazy, Suspense } from 'react';
import { FormattedMessage } from 'react-intl';
import { Accordion, AccordionSummary, AccordionDetails, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

export const HelpMe = ({ contentFile }) => {
  const Content = lazy(() => import('../pages/' + contentFile));

  return (
    <Suspense fallback={null}>
      <Box mt={2}>
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />} aria-controls='help-content'>
            <Typography>
              <FormattedMessage id='HELP' />
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography>
              <Content />
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>
    </Suspense>
  );
};
