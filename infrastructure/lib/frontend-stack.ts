import { Duration, Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { Bucket } from 'aws-cdk-lib/aws-s3';
import { BucketDeployment, Source as S3Source } from 'aws-cdk-lib/aws-s3-deployment';
import { ARecord, HostedZone, RecordTarget } from 'aws-cdk-lib/aws-route53';
import {
  Distribution,
  OriginAccessIdentity,
  OriginRequestPolicy,
  PriceClass,
} from 'aws-cdk-lib/aws-cloudfront';
import { resolve } from 'path';
import { ApplicationLoadBalancedFargateService } from 'aws-cdk-lib/aws-ecs-patterns';
import { DnsValidatedCertificate } from 'aws-cdk-lib/aws-certificatemanager';
import { CanonicalUserPrincipal, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { CloudFrontTarget } from 'aws-cdk-lib/aws-route53-targets';
import { S3Origin } from 'aws-cdk-lib/aws-cloudfront-origins';

interface FrontendStackProps extends StackProps {
  serviceApp: ApplicationLoadBalancedFargateService;
}

export class FrontendStack extends Stack {
  loadBalancerUrl?: string;

  constructor(scope: Construct, id: string, props?: FrontendStackProps) {
    super(scope, id, props);
    this.loadBalancerUrl = props?.serviceApp.loadBalancer.loadBalancerDnsName;
    // S3 Resource
    const bucket = new Bucket(this, 'ecogaiaFrontendBucket', {
      bucketName: 'ecogaia-frontend-bucket',
      websiteIndexDocument: 'index.html',
      websiteErrorDocument: 'index.html',
    });

    // Deployment
    new BucketDeployment(this, 'frontendDeploymentBucket', {
      sources: [S3Source.asset(resolve(__dirname, '..', '..', 'frontend', 'dist', 'EcogaiaShop'))],
      destinationBucket: bucket,
    });

    // HostedZone
    const domainName = 'ecogaiashop.site';
    const subdomainName = '';
    const zone = HostedZone.fromLookup(this, 'ecogaiaZone', {
      domainName,
    });

    // Certificate SSL
    const certificateArn = new DnsValidatedCertificate(this, 'ecogaiaCert', {
      domainName,
      hostedZone: zone,
      region: props?.env?.region,
    });

    // Origin Access Identity
    const identity = new OriginAccessIdentity(this, 'ecogaiaOAI');

    bucket.addToResourcePolicy(
      new PolicyStatement({
        actions: ['s3:GetObject'],
        resources: [bucket.arnForObjects('*')],
        principals: [
          new CanonicalUserPrincipal(identity.cloudFrontOriginAccessIdentityS3CanonicalUserId),
        ],
      })
    );

    // CloudFront
    const distribution = new Distribution(this, 'CFWebDistribution', {
      defaultBehavior: {
        origin: new S3Origin(bucket),
        originRequestPolicy: OriginRequestPolicy.CORS_S3_ORIGIN,
      },
      domainNames: ['ecogaiashop.site'],
      defaultRootObject: 'index.html',
      errorResponses: [
        {
          responsePagePath: '/index.html',
          httpStatus: 404,
          responseHttpStatus: 200,
          ttl: Duration.seconds(10),
        },
      ],
      certificate: certificateArn,
      priceClass: PriceClass.PRICE_CLASS_100,
    });

    // Mapping domain name to cloudfront
    new ARecord(this, 'ecogaiaCDNDomainRecord', {
      recordName: subdomainName,
      zone,
      target: RecordTarget.fromAlias(new CloudFrontTarget(distribution)),
    });
  }
}
