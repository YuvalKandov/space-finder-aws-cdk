import { ListBucketsCommand, S3Client } from "@aws-sdk/client-s3";
import { AuthService } from "./AuthService";


async function testAuth() {
    const service = new AuthService();
    const loginResult = await service.login(
        'yuvalk',
        '318957990Yk@'
    );
    const idToken = await service.getIdToken();
    const credentials =  await service.generateTemporaryCredentials();
    console.log('Temporary Credentials:', credentials);
    const buckets = await listBuckets(credentials);
    console.log('S3 Buckets:', buckets);
}

async function listBuckets(credentials: any) {
    // Use the temporary credentials to create an S3 client
    const client = new S3Client({
        credentials: credentials
    }); 

    const command = new ListBucketsCommand({});
    const listBucketsResult = await client.send(command);
    return listBucketsResult;
}

testAuth();