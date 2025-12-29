# Space Finder – Serverless AWS Application (CDK)

Space Finder is a full-stack **serverless cloud application** built on AWS using
**Infrastructure as Code (AWS CDK)**.
The project demonstrates how to design, deploy, secure, monitor, and test a
production-style serverless system.

The application allows authenticated users to browse spaces, while privileged
(admin) users can create new spaces and upload images securely to S3.

---

## Architecture Overview

### Frontend
- React + TypeScript (Vite)
- Hosted on Amazon S3 and served via CloudFront
- Authentication via Amazon Cognito (User Pool)
- Communicates with backend using JWT-secured REST API

### Backend
- AWS CDK (TypeScript)
- API Gateway + AWS Lambda
- DynamoDB for data persistence
- S3 for image storage
- Cognito User Pool & Identity Pool
- CloudWatch metrics and alarms
- SNS notifications with Slack webhook integration

---

## Repository Structure
```
/
├── ☁️ Space-Finder-Backend/     # AWS CDK stacks, Lambda functions, and API Gateway logic
├── ⚛️ Space-Finder-Frontend/    # React frontend application
├── 📄 README.md                 # Project documentation
└── 🔧 .gitignore                # Git configuration
```
---

## Key Features

- Serverless REST API built with API Gateway and Lambda
- JWT-based authentication using Amazon Cognito
- Role-based authorization (admin vs regular users)
- Secure S3 uploads using temporary IAM credentials
- Infrastructure monitoring with CloudWatch Alarms
- SNS-based alerting with Slack integration
- Infrastructure tests using CDK assertions
- Lambda unit tests using Jest with AWS SDK mocks

---

## Local Development

### Backend
```bash
cd Space-Finder-Backend
npm install
npm run deploy
```

Deployment is fully managed via AWS CDK.

### Frontend
```bash
cd Space-Finder-Frontend
npm install
npm run dev
```
---

## Testing

The backend includes:
- CDK infrastructure tests (CloudFormation assertions)
- Lambda unit tests
- AWS SDK mocking with Jest (no real AWS calls)

---

## Security & Secrets

Sensitive values (Slack webhook URL, AWS credentials, deployment outputs)
are managed via environment variables and are intentionally excluded from Git.

---

## Why This Project

This project was built to practice and demonstrate:
- Real-world AWS serverless architecture
- Infrastructure as Code with AWS CDK
- Secure authentication & authorization flows
- Observability and alerting in cloud systems
- Testing AWS infrastructure and Lambda logic

