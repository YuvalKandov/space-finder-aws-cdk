# Space Finder – Serverless Cloud Application

Space Finder is a full-stack serverless application built on AWS using CDK.
The project demonstrates infrastructure-as-code, authentication, monitoring,
testing, and a React frontend integrated with AWS services.

## Architecture Overview

Frontend:
- React + TypeScript (Vite)
- Hosted on S3 and served via CloudFront
- Authenticated with Amazon Cognito

Backend:
- AWS CDK (TypeScript)
- API Gateway + Lambda
- DynamoDB
- S3 (image uploads)
- Cognito User Pool & Identity Pool
- CloudWatch + SNS monitoring
- Slack alerting via webhook Lambda

## Repository Structure

frontend/  – React application  
backend/   – AWS CDK infrastructure & Lambda functions  

## Key Features

- Serverless REST API
- JWT-based authentication with Cognito
- Role-based authorization (admin vs user)
- Secure S3 uploads using temporary credentials
- CloudWatch alarms with SNS notifications
- Slack integration for API monitoring
- Infrastructure tests with CDK assertions
- Lambda unit tests using Jest & mocks

## Local Development

### Backend
* cd backend
* npm install
* npm run deploy

### Frontend
* cd frontend
* npm install
* npm run dev

## Testing

Backend includes:
- CDK infrastructure tests
- Lambda unit tests
- AWS SDK mocking with Jest

## Notes

Secrets (Slack webhook, credentials) are managed via environment variables
and are intentionally excluded from the repository.
