var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(event);

  const environment = process.env.ENV;
  const region = process.env.REGION;
  const apiGraphQLAPIIdOutput = process.env.API_ALUMNIFRONTEND_GRAPHQLAPIIDOUTPUT;
  const userTableName = `User-${apiGraphQLAPIIdOutput}-${environment}`;

  console.log('Region: ', region);
  console.log('Table: ', userTableName);

  AWS.config.update({ region: region });

  const date = new Date();

  if (event.request.userAttributes.sub) {
    const ddbParams = {
      Item: {
        id: { S: event.request.userAttributes.sub },
        __typename: { S: 'User' },
        name: { S: event.request.userAttributes.name },
        family_name: { S: event.request.userAttributes.family_name },
        email: { S: event.request.userAttributes.email },
        createdAt: { S: date.toISOString() },
        updatedAt: { S: date.toISOString() }
      },
      TableName: userTableName
    };

    try {
      await ddb.putItem(ddbParams).promise();
      console.log('Success');
    } catch (err) {
      console.log('Error', err);
    }
  } else {
    console.log('Sub does not exist!');
  }

  return event;
};
