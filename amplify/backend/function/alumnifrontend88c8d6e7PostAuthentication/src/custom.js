var AWS = require('aws-sdk');
var ddb = new AWS.DynamoDB({ apiVersion: '2012-10-08' });

/**
 * @type {import('@types/aws-lambda').APIGatewayProxyHandler}
 */
exports.handler = async (event, context) => {
  console.log(event);

  const region = process.env.REGION;
  const bucketName = process.env.STORAGE_STORAGE_BUCKETNAME;
  const userTableName = process.env.API_ALUMNIFRONTEND_USERTABLE_NAME;

  console.log('Region: ', region);
  console.log('Table: ', userTableName);
  console.log('Bucket: ', bucketName);

  // AWS.config.update({ region: region });

  // const identityCreds = new AWS.CognitoIdentityCredentials({
  //   IdentityPoolId: event.userPoolId
  // });

  // AWS.config.credentials = identityCreds;

  // console.log('creds', identityCreds);

  // var s3 = new AWS.S3({
  //   apiVersion: '2006-03-01'
  // });

  // if (event.request.userAttributes.sub && event.request.userAttributes['custom:picture']) {
  //   const picture = event.request.userAttributes['custom:picture'];

  //   try {
  //     const pictureUrl = await s3.getSignedUrl('getObject', {
  //       Bucket: bucketName + '/private/' + region + ':',
  //       Key: picture,
  //       Acl: 'private',
  //       Expires: 24 * 60 * 60 // a day
  //     });

  //     console.log('pictureUrl:', pictureUrl);

  //     if (pictureUrl) {
  //       const ddbParams = {
  //         ExpressionAttributeNames: {
  //           '#p': 'picture'
  //         },
  //         ExpressionAttributeValues: {
  //           ':t': {
  //             S: pictureUrl
  //           }
  //         },
  //         Key: {
  //           id: {
  //             S: event.userName
  //           }
  //         },
  //         UpdateExpression: 'SET #p = :t',
  //         ReturnValues: 'ALL_NEW',
  //         TableName: userTableName
  //       };

  //       try {
  //         await ddb.updateItem(ddbParams).promise();
  //         console.log('Success');
  //       } catch (err) {
  //         console.log('Error', err);
  //       }
  //     }
  //   } catch (err) {
  //     console.log('Error', err);
  //   }
  // }

  return event;
};
