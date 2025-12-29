import { Amplify } from 'aws-amplify'
import { SignInOutput, fetchAuthSession, signIn} from "@aws-amplify/auth";
import { CognitoIdentityClient } from '@aws-sdk/client-cognito-identity';
import { fromCognitoIdentityPool } from '@aws-sdk/credential-providers';

const awsRegion = 'eu-central-1'

Amplify.configure({
    Auth: {
      Cognito: {
        userPoolId: 'eu-central-1_7d8Q9IRzM',
        userPoolClientId: '27fe79prs7vi04dubpc2k1vlje',
        identityPoolId: 'eu-central-1:a662042a-8e78-4ad9-90c5-7f13d23640bb'
      }
    }
  });

export class AuthService {

    public async login(userName: string, password: string) {
        const signInOutput: SignInOutput = await signIn({
            username: userName,
            password: password,
            options: {
                authFlowType: 'USER_PASSWORD_AUTH'
            }
        });
        return signInOutput;
    }

    /**
     * call only after login
     */
    public async getIdToken(){
        const authSession = await fetchAuthSession();
        return authSession.tokens?.idToken?.toString();
    }

    public async generateTemporaryCredentials(){
        const idToken = await this.getIdToken();
        const cognitoIdentityPool = `cognito-idp.${awsRegion}.amazonaws.com/eu-central-1_7d8Q9IRzM`;
        const cognitoIdentity = new CognitoIdentityClient({
            credentials: fromCognitoIdentityPool({
                identityPoolId: 'eu-central-1:a662042a-8e78-4ad9-90c5-7f13d23640bb',
                logins: {
                    [cognitoIdentityPool]: idToken
                }
        })
        });
        const credentials = await cognitoIdentity.config.credentials();
        return credentials;
    }

}