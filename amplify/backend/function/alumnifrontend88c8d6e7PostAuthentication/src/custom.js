const { Sha256 } = require('@aws-crypto/sha256-js');
const { defaultProvider } = require('@aws-sdk/credential-provider-node');
const { SignatureV4 } = require('@aws-sdk/signature-v4');
const { HttpRequest } = require('@aws-sdk/protocol-http');
const { default: fetch, Request } = require('node-fetch');

const GRAPHQL_ENDPOINT = process.env.API_ALUMNIFRONTEND_GRAPHQLAPIENDPOINTOUTPUT;
const AWS_REGION = process.env.REGION || 'us-east-1';

const query = /* GraphQL */ `
  mutation createUser($email: String!, $name: String!, $family_name: String!, $owner: String!) {
    createUser(input: { email: $email, name: $name, family_name: $family_name, owner: $owner }) {
      id
      email
    }
  }
`;

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(`Event: ${JSON.stringify(event)}`);

  const variables = {
    email: event.request.userAttributes.email,
    name: event.request.userAttributes.name,
    family_name: event.request.userAttributes.family_name,
    owner: `${event.request.userAttributes.sub}::${event.userName}`
  };

  const endpoint = new URL(GRAPHQL_ENDPOINT);

  const signer = new SignatureV4({
    credentials: defaultProvider(),
    region: AWS_REGION,
    service: 'appsync',
    sha256: Sha256
  });

  const requestToBeSigned = new HttpRequest({
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      host: endpoint.host
    },
    hostname: endpoint.host,
    body: JSON.stringify({ query, variables, authMode: 'AWS_IAM' }),
    path: endpoint.pathname
  });

  const signed = await signer.sign(requestToBeSigned);
  const request = new Request(endpoint, signed);

  let statusCode = 200;
  let body;
  let response;

  try {
    response = await fetch(request);
    body = await response.json();
    if (body.errors) statusCode = 400;
  } catch (error) {
    statusCode = 500;
    body = {
      errors: [
        {
          message: error.message
        }
      ]
    };
  }

  console.log(`statusCode: ${statusCode}`);
  console.log(`body: ${JSON.stringify(body)}`);

  return {
    statusCode,
    body: JSON.stringify(body)
  };
};
