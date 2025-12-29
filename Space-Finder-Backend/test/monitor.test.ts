import { SNSEvent } from "aws-lambda";
import { handler } from "../src/Services/Monitor/handler";


const snsEvent: SNSEvent = {
    Records: [{
        Sns: {  
            Message: 'This is a test'
        }
    }]
} as any;

handler(snsEvent, {} as any);