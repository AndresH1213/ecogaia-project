import { Aws, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Vpc } from 'aws-cdk-lib/aws-ec2';
import { Cluster, ContainerImage } from 'aws-cdk-lib/aws-ecs';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { Certificate } from 'aws-cdk-lib/aws-certificatemanager';
import { resolve } from 'path';

export class ApplicationStack extends Stack {
  fargateService: ApplicationLoadBalancedFargateService;

  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    // VPC Main
    const vpc = new Vpc(this, 'ClusterVpc', {
      maxAzs: 2,
      cidr: '10.0.0.0/16',
      natGateways: 1,
    });

    const cluster = new Cluster(this, 'ClusterApp', {
      vpc,
    });

    const certificate = Certificate.fromCertificateArn(
      this,
      'certificateEcogaia',
      `arn:aws:acm:${Aws.REGION}:${Aws.ACCOUNT_ID}:certificate/010ee357-5cdf-4a18-b80b-9e304122e881`
    );

    this.fargateService = new ApplicationLoadBalancedFargateService(this, 'MyFargateApplication', {
      cluster,
      cpu: 512,
      desiredCount: 2,
      taskImageOptions: {
        image: ContainerImage.fromAsset(resolve(__dirname, '..', '../backend')),
      },
      memoryLimitMiB: 1024,
      publicLoadBalancer: true,
      certificate: certificate,
    });
  }
}
