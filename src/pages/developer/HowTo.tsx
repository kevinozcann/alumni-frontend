import React from 'react';
import { connect, ConnectedProps } from 'react-redux';
import { useIntl } from 'react-intl';
import {
  Box,
  Divider,
  Card,
  CardHeader,
  CardContent,
  Typography,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Tabs,
  Tab
} from '@mui/material';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';

import Page from 'layout/Page';
import { RootState } from 'store/store';
import { authUserSelector } from 'pages/auth/services/store/auth';
import { userActiveSchoolSelector, userActiveSeasonSelector } from 'pages/profile/services/user';
import { apiBaseUrl } from 'store/ApiUrls';
import { useSubheader } from 'contexts/SubheaderContext';
import HighlightCode from 'components/HighlightCode';
import { IPageTab } from 'utils/shared-types';

const mapStateToProps = (state: RootState) => ({
  user: authUserSelector(state),
  activeSchool: userActiveSchoolSelector(state),
  activeSeason: userActiveSeasonSelector(state)
});
const connector = connect(mapStateToProps, null);
type PropsFromRedux = ConnectedProps<typeof connector>;
type TApiKeyProps = PropsFromRedux;

const ApiKey = (props: TApiKeyProps) => {
  const { user, activeSchool, activeSeason } = props;
  const [codeTab, setCodeTab] = React.useState<string>('curl');
  const intl = useIntl();
  const subheader = useSubheader();
  const truncatedToken = `${user?.accessToken?.substring(0, 7)}.......`;

  const codeTabs: IPageTab[] = [
    {
      value: 'curl',
      label: 'cURL'
    },
    {
      value: 'nodejs',
      label: 'Node.js'
    },
    {
      value: 'jquery',
      label: 'jQuery'
    },
    {
      value: 'php',
      label: 'PHP'
    },
    {
      value: 'ruby',
      label: 'Ruby'
    },
    {
      value: 'python',
      label: 'Python'
    },
    {
      value: 'csharp',
      label: 'C#'
    }
  ];

  const handleCodeTabChange = (_event: React.SyntheticEvent<Element, Event>, newValue: string) => {
    setCodeTab(newValue);
  };

  React.useEffect(() => {
    const breadcrumbs = [];
    breadcrumbs.push({ title: 'developer', url: '/developer' });
    breadcrumbs.push({ title: 'developer.howto', url: '/developer/howto' });
    subheader.setBreadcrumbs(breadcrumbs);
  }, [activeSchool, activeSeason]);

  return (
    <Page title={intl.formatMessage({ id: 'developer.howto' })}>
      <Box>
        <Card>
          <CardHeader
            title={intl.formatMessage({ id: 'developer.howto.apiurl' })}
            subheader='All requests should be sent to the API endpoints under the following url'
          />
          <Divider />
          <CardContent>
            <Typography variant='h6'>{apiBaseUrl}</Typography>
          </CardContent>
        </Card>

        <Card sx={{ mt: 3 }}>
          <CardHeader
            title='Headers'
            subheader='All requests should include the following headers'
          />
          <Divider />
          <CardContent>
            <List>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary='Authorization'
                  secondary={`We are using Bearer Authentication so Authorization header should be like this "Bearer ${truncatedToken}"`}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary='schoolId'
                  secondary={`This should be the ID of the school you are requesting data for. The schoolId for the active school you are using now is ${activeSchool?.id}`}
                />
              </ListItem>
              <ListItem disablePadding>
                <ListItemIcon>
                  <ArrowRightIcon />
                </ListItemIcon>
                <ListItemText
                  primary='seasonId'
                  secondary={`This should be the ID of the season you are requesting data for. The seasonId for the active season you are using now is ${activeSeason.database}`}
                />
              </ListItem>
            </List>

            <Box sx={{ my: 2 }}>
              <Tabs
                value={codeTab}
                onChange={handleCodeTabChange}
                indicatorColor='primary'
                textColor='primary'
                scrollButtons='auto'
                variant='scrollable'
                aria-label='page tabs'
              >
                {codeTabs.map((tab: IPageTab) => (
                  <Tab key={tab.value} label={tab.label} value={tab.value} />
                ))}
              </Tabs>

              {codeTab === 'curl' && (
                <HighlightCode language='javascript'>
                  {`curl -X 'GET' \\
  '${apiBaseUrl}/batches?page=1' \\
  -H 'accept: application/json' \\
  -H 'Authorization: Bearer ${truncatedToken}' \\
  -H 'schoolId: ${activeSchool.id}' \\
  -H 'seasonId: ${activeSeason.database}'`}
                </HighlightCode>
              )}
              {codeTab === 'nodejs' && (
                <HighlightCode language='javascript'>
                  {`var http = require("https");

var options = {
  "method": "GET",
  "hostname": "${apiBaseUrl}",
  "path": "/batches?page=1",
  "headers": {
    "Accept": "application/json",
    "Authorization": "Bearer ${truncatedToken}",
    "schoolId": "${activeSchool.id}",
    "seasonId": "${activeSeason.database}"
  }
};

var req = http.request(options, function (res) {
  var chunks = [];

  res.on("data", function (chunk) {
    chunks.push(chunk);
  });

  res.on("end", function () {
    var body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});

req.end();`}
                </HighlightCode>
              )}
              {codeTab === 'jquery' && (
                <HighlightCode language='javascript'>
                  {`var settings = {
  "url": "${apiBaseUrl}/batches?page=1",
  "method": "GET",
  "headers": {
    "Accept": "application/json",
    "Authorization": "Bearer ${truncatedToken}",
    "schoolId": "${activeSchool.id}",
    "seasonId": "${activeSeason.database}"
  }
}

$.ajax(settings).done(function (response) {
  console.log(response);
});`}
                </HighlightCode>
              )}
              {codeTab === 'php' && (
                <HighlightCode language='php'>
                  {`<?php

$curl = curl_init();

curl_setopt_array($curl, array(
  CURLOPT_URL => "${apiBaseUrl}/batches?page=1",
  CURLOPT_RETURNTRANSFER => true,
  CURLOPT_ENCODING => "",
  CURLOPT_MAXREDIRS => 10,
  CURLOPT_TIMEOUT => 30,
  CURLOPT_HTTP_VERSION => CURL_HTTP_VERSION_1_1,
  CURLOPT_CUSTOMREQUEST => "GET",
  CURLOPT_HTTPHEADER => array(
    "Accept: application/json",
    "Authorization: Bearer ${truncatedToken}",
    "schoolId": "${activeSchool.id}",
    "seasonId": "${activeSeason.database}"
  ),
));

$response = curl_exec($curl);
$err = curl_error($curl);

curl_close($curl);

if ($err) {
  echo "cURL Error #:" . $err;
} else {
  echo $response;
}`}
                </HighlightCode>
              )}
              {codeTab === 'ruby' && (
                <HighlightCode language='ruby'>
                  {`require 'uri'
require 'net/http'

url = URI("${apiBaseUrl}/batches?page=1")

http = Net::HTTP.new(url.host, url.port)

request = Net::HTTP::Get.new(url)
request["Accept"] = 'application/json'
request["Authorization"] = 'Bearer ${truncatedToken}'
request["schoolId"] = '${activeSchool.id}'
request["seasonId"] = '${activeSeason.database}'

response = http.request(request)
puts response.read_body`}
                </HighlightCode>
              )}
              {codeTab === 'python' && (
                <HighlightCode language='phthon'>
                  {`import requests

url = "${apiBaseUrl}/batches"

querystring = {"page": "1"}

headers = {
  'Accept': "application/json",
  'Authorization': "Bearer ${truncatedToken}",
  'schoolId': "${activeSchool.id}",
  'seasonId': "${activeSeason.database}"
}

response = requests.request("GET", url, headers=headers, params=querystring)

print(response.text)`}
                </HighlightCode>
              )}
              {codeTab === 'csharp' && (
                <HighlightCode language='csharp'>
                  {`var client = new RestClient("${apiBaseUrl}/batches?page=1");
var request = new RestRequest(Method.GET);

request.AddHeader("Accept", "application/json");
request.AddHeader("Authorization", "Bearer ${truncatedToken}");
request.AddHeader("schoolId", "${activeSchool.id}");
request.AddHeader("seasonId", "${activeSeason.database}");

IRestResponse response = client.Execute(request);`}
                </HighlightCode>
              )}
            </Box>
          </CardContent>
        </Card>
      </Box>
    </Page>
  );
};

export default connector(ApiKey);
