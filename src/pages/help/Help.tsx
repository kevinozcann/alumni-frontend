import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useLocation } from 'react-router-dom';
import { Bitbucket } from 'bitbucket';
import ReactMarkdown from 'react-markdown';
import { Accordion, AccordionDetails, AccordionSummary, Box, Typography } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import Scrollbar from 'layout/Scrollbar';
import { RootState } from 'store/store';
import { i18nLangSelector } from 'store/i18n';
import { authUserSelector } from 'store/auth';
import useTranslation from 'hooks/useTranslation';

import MarkdownWrapper from './MarkdownWrapper';

const mapStateToProps = (state: RootState) => ({
  lang: i18nLangSelector(state),
  user: authUserSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type THelpParams = PropsFromRedux;

const Help = (props: THelpParams) => {
  const { lang, user } = props;
  const [expanded, setExpanded] = React.useState<boolean>(false);
  const [showHelp] = React.useState<boolean>(false);
  const [markdownData, setMarkdownData] = React.useState<any>(null);
  const location = useLocation();
  const intl = useTranslation();
  const { superAdmin } = user;
  const { REACT_APP_BITBUCKET_API_USERNAME, REACT_APP_BITBUCKET_API_TOKEN } = process.env;
  const repoConfig = {
    workspace: 'smartclasssims',
    repo_slug: 'docs'
  };
  const clientOptions = {
    baseUrl: 'https://api.bitbucket.org/2.0',
    auth: {
      username: REACT_APP_BITBUCKET_API_USERNAME,
      password: REACT_APP_BITBUCKET_API_TOKEN
    },
    request: {
      timeout: 10
    }
  };

  React.useEffect(() => {
    if (showHelp) {
      const helpFilePath = location?.pathname.replace(/[0-9]/g, '').replace('//', '/');
      const filePath = `${helpFilePath}.md`;

      const bitbucket = new Bitbucket(clientOptions);
      bitbucket.commits
        .list({
          workspace: repoConfig.workspace,
          repo_slug: repoConfig.repo_slug,
          page: '1',
          pagelen: 1
        })
        .then(({ data }) => {
          const commits = data?.values || [];

          if (commits?.length > 0) {
            const commitHash = commits[0].hash;

            bitbucket.source
              .read({
                workspace: repoConfig.workspace,
                repo_slug: repoConfig.repo_slug,
                path: `schoost/${lang}${filePath}`,
                commit: commitHash
              })
              .then(({ data }) => setMarkdownData(data))
              .catch(() => setMarkdownData(null));
          }
        })
        .catch(() => setMarkdownData(null));
    }
  }, [location, showHelp]);

  return (
    (markdownData && superAdmin && (
      <Box sx={{ my: 2 }}>
        <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls='help-content'
            id='help-header'
          >
            <Typography>{intl.translate({ id: 'help' })}</Typography>
          </AccordionSummary>

          <Scrollbar
            options={{ suppressScrollX: true, wheelSpeed: 2 }}
            style={{ marginBottom: '16px' }}
          >
            <AccordionDetails sx={{ height: 'auto', maxHeight: 400 }}>
              <MarkdownWrapper>
                <ReactMarkdown>{markdownData}</ReactMarkdown>
              </MarkdownWrapper>
              <Box sx={{ height: '16px' }} />
            </AccordionDetails>
          </Scrollbar>
        </Accordion>
      </Box>
    )) ||
    null
  );
};

export default connector(Help);
