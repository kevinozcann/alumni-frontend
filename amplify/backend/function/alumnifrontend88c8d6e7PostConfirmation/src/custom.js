var aws = require('aws-sdk');
var ddb = new aws.DynamoDB({ apiVersion: '2012-10-08' });

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

  aws.config.update({ region: region });

  if (event.request.userAttributes.sub) {
    const ddbParams = {
      Item: {
        id: { S: event.request.userAttributes.sub },
        __typename: { S: 'User' },
        name: { S: event.request.userAttributes.name },
        family_name: { S: event.request.userAttributes.family_name }
      },
      TableName: userTableName
    };

    try {
      await ddb.putItem(ddbParams).promise();
      console.log('Success');
    } catch (err) {
      console.log('Error', err);
    }

    console.log('Success: Everything executed correctly');
    context.done(null, event);
  } else {
    // Nothing to do, the user's email ID is unknown
    console.log('Error: Nothing was written to DDB');
    context.done(null, event);
  }

  return event;
};
