#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { FrontendStack } from '../lib/frontend-stack';
import { ApplicationStack } from '../lib/application-stack';

const app = new cdk.App();

const appStack = new ApplicationStack(app, 'AppStack', {
  /* For more information, see https://docs.aws.amazon.com/cdk/latest/guide/environments.html */
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
  description: 'Application tier services, running on a ECS cluster with Fargate',
});

new FrontendStack(app, 'FrontendStack', {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: 'us-east-1' },
  description: 'Frontend services, includes S3 website an Content Network Delivery',
  serviceApp: appStack.fargateService,
});
