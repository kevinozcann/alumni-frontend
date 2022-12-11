import * as ATW from 'aws-typescript-wrapper';

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event: any, context: any) => {
  console.log(event);

  const environment = process.env.ENV;
  const region = process.env.REGION;
  const apiGraphQLAPIIdOutput = process.env.API_ALUMNIFRONTEND_GRAPHQLAPIIDOUTPUT;
  const userTableName = `User-${apiGraphQLAPIIdOutput}-${environment}`;

  console.log('Region: ', region);
  console.log('Table: ', userTableName);

  if (event.request.userAttributes.sub) {
    try {
      await ATW.putItem({
        region: region,
        tableName: userTableName,
        item: {
          id: { S: event.request.userAttributes.sub },
          __typename: { S: 'User' },
          name: { S: event.request.userAttributes.name },
          family_name: { S: event.request.userAttributes.family_name }
        }
      });

      console.log('Success');
    } catch (err) {
      console.log('Error', err);
    }
  } else {
    console.log('Sub does not exist!');
  }

  return event;
};
