import { handler } from '../src/Services/spaces/handler';

process.env.SPACES_TABLE_NAME = 'SpacesTable-06fb5689b4d3';
process.env.AWS_REGION = 'eu-central-1';

handler({
    httpMethod: 'POST',
    // queryStringParameters: {
    //     id: '1f0cc5eb-31d0-6120-bfa7-4ca8fbcb83aa'
    // },
    body: JSON.stringify({
        location: "New York",
    })
} as any, {} as any).then(response => {
    console.log('Lambda response:', response);
})
