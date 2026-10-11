import { CloudWatchLog, LocationCoordinates, AwsCloudFrontGeo, AwsLocationPlace } from '../types';

export const AWS_REGIONS = [
  { id: 'us-east-1', name: 'US East (N. Virginia)', flag: '🇺🇸' },
  { id: 'us-west-2', name: 'US West (Oregon)', flag: '🇺🇸' },
  { id: 'eu-west-1', name: 'EU (Ireland)', flag: '🇪🇺' },
  { id: 'eu-central-1', name: 'EU (Frankfurt)', flag: '🇩🇪' },
  { id: 'ap-southeast-1', name: 'Asia Pacific (Singapore)', flag: '🇸🇬' },
  { id: 'ap-south-1', name: 'Asia Pacific (Mumbai)', flag: '🇮🇳' },
  { id: 'ap-northeast-1', name: 'Asia Pacific (Tokyo)', flag: '🇯🇵' },
];

export const AWS_SAM_TEMPLATE = `AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  thelight-backend
  Serverless personal safety and high-accuracy area locator stack powered by
  Amazon Location Service, CloudFront Edge Geolocation, Lambda, DynamoDB, and SNS.

Parameters:
  Environment:
    Type: String
    Default: prod
    AllowedValues: [dev, stage, prod]

Globals:
  Function:
    Timeout: 10
    MemorySize: 256
    Runtime: python3.11
    Tracing: Active
    Environment:
      Variables:
        LOCATION_PLACE_INDEX: !Ref SafetyPlaceIndex
        LOCATION_TRACKER: !Ref DeviceTracker
        DYNAMODB_TABLE: !Ref IncidentsTable
        SNS_TOPIC_ARN: !Ref DistressTopic

Resources:
  # 1. AWS Location Service - Place Index for Geocoding & Reverse Geocoding
  SafetyPlaceIndex:
    Type: AWS::Location::PlaceIndex
    Properties:
      IndexName: thelight-place-index
      DataSource: Esri
      DataSourceConfiguration:
        IntendedUse: SingleUse
      Description: Reverse geocodes device coordinates to municipal street, lighting zone, and safety precinct.

  # 2. AWS Location Service - Tracker for Real-Time Device Telemetry
  DeviceTracker:
    Type: AWS::Location::Tracker
    Properties:
      TrackerName: thelight-device-tracker
      PositionFiltering: AccuracyBased
      Description: Continuous high-accuracy device locator for laptops and mobile devices.

  # 3. AWS Location Service - Geofence Collection for Safe Havens
  SafeHavenGeofenceCollection:
    Type: AWS::Location::GeofenceCollection
    Properties:
      CollectionName: thelight-safe-havens
      Description: Monitors perimeter entry/exit around police precincts, 24/7 hospitals, and lit transit corridors.

  # 4. Lambda Function: User Area Locator & Reverse Geocode Resolver
  LocateFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: locate/
      Handler: app.lambda_handler
      Policies:
        - Version: '2012-10-17'
          Statement:
            - Effect: Allow
              Action:
                - geo:SearchPlaceIndexForPosition
                - geo:SearchPlaceIndexForText
                - geo:BatchUpdateDevicePosition
                - geo:GetDevicePosition
              Resource: '*'
        - DynamoDBCrudPolicy:
            TableName: !Ref IncidentsTable
      Events:
        LocateApi:
          Type: Api
          Properties:
            Path: /locate
            Method: post
            Cors:
              AllowMethods: "'POST, OPTIONS'"
              AllowHeaders: "'Content-Type, X-Amz-Date, Authorization, X-Api-Key'"
              AllowOrigin: "'*'"

  # 5. Lambda Function: Emergency SOS Dispatcher
  SosDispatcherFunction:
    Type: AWS::Serverless::Function
    Properties:
      CodeUri: locate/
      Handler: app.sos_dispatch_handler
      Policies:
        - SNSPublishMessagePolicy:
            TopicName: !GetAtt DistressTopic.TopicName
        - DynamoDBCrudPolicy:
            TableName: !Ref IncidentsTable
      Events:
        SosApi:
          Type: Api
          Properties:
            Path: /alert
            Method: post

  # 6. Amazon DynamoDB Table: Telemetry & Distress Incident Logs
  IncidentsTable:
    Type: AWS::DynamoDB::Table
    Properties:
      TableName: thelight-incidents
      BillingMode: PAY_PER_REQUEST
      AttributeDefinitions:
        - AttributeName: deviceId
          AttributeType: S
        - AttributeName: timestamp
          AttributeType: S
      KeySchema:
        - AttributeName: deviceId
          KeyType: HASH
        - AttributeName: timestamp
          KeyType: RANGE
      TimeToLiveSpecification:
        AttributeName: ttl
        Enabled: true

  # 7. Amazon SNS Topic: Emergency Broadcast
  DistressTopic:
    Type: AWS::SNS::Topic
    Properties:
      TopicName: thelight-distress-broadcast
      DisplayName: The Light Emergency SOS Dispatch

Outputs:
  ApiEndpoint:
    Description: API Gateway endpoint URL for Prod stage
    Value: !Sub "https://\${ServerlessRestApi}.execute-api.\${AWS::Region}.amazonaws.com/Prod/locate"
  TrackerArn:
    Description: Amazon Location Tracker ARN
    Value: !GetAtt DeviceTracker.Arn
  PlaceIndexArn:
    Description: Amazon Location Place Index ARN
    Value: !GetAtt SafetyPlaceIndex.Arn`;

export const AWS_LAMBDA_PYTHON_CODE = `import json
import os
import boto3
from datetime import datetime

# Initialize AWS clients
location_client = boto3.client('location')
dynamodb = boto3.resource('dynamodb')
sns_client = boto3.client('sns')

PLACE_INDEX_NAME = os.environ.get('LOCATION_PLACE_INDEX', 'thelight-place-index')
TRACKER_NAME = os.environ.get('LOCATION_TRACKER', 'thelight-device-tracker')
TABLE_NAME = os.environ.get('DYNAMODB_TABLE', 'thelight-incidents')
SNS_TOPIC_ARN = os.environ.get('SNS_TOPIC_ARN', '')

def lambda_handler(event, context):
    """
    AWS Lambda entrypoint to locate user's area and enrich telemetry.
    Supports laptop IP headers, CloudFront Geo headers, or browser GPS coordinates.
    """
    try:
        body = json.loads(event.get('body', '{}')) if isinstance(event.get('body'), str) else event.get('body', {})
        
        # 1. Extract coordinates or fallback to CloudFront headers
        headers = event.get('headers', {})
        lat = body.get('latitude')
        lon = body.get('longitude')
        accuracy = body.get('accuracy', 50)
        device_id = body.get('deviceId', 'laptop-node-001')
        
        if lat is None or lon is None:
            # Fallback to CloudFront viewer location headers
            cf_lat = headers.get('CloudFront-Viewer-Latitude')
            cf_lon = headers.get('CloudFront-Viewer-Longitude')
            if cf_lat and cf_lon:
                lat = float(cf_lat)
                lon = float(cf_lon)
            else:
                lat, lon = 47.6062, -122.3321  # Default Seattle AWS Hub

        # 2. Call Amazon Location Service to reverse geocode position
        response = location_client.search_place_index_for_position(
            IndexName=PLACE_INDEX_NAME,
            Position=[lon, lat],  # Amazon Location uses [Longitude, Latitude]
            MaxResults=1,
            Language='en'
        )
        
        place_data = {}
        if response.get('Results'):
            place = response['Results'][0].get('Place', {})
            place_data = {
                'label': place.get('Label'),
                'addressNumber': place.get('AddressNumber'),
                'street': place.get('Street'),
                'neighborhood': place.get('Neighborhood'),
                'municipality': place.get('Municipality'),
                'subRegion': place.get('SubRegion'),
                'region': place.get('Region'),
                'country': place.get('Country'),
                'countryCode': place.get('CountryCode', 'US'),
                'postalCode': place.get('PostalCode')
            }
            
        # 3. Update device position in Amazon Location Tracker
        now_iso = datetime.utcnow().isoformat() + 'Z'
        location_client.batch_update_device_position(
            TrackerName=TRACKER_NAME,
            Updates=[
                {
                    'DeviceId': device_id,
                    'Position': [lon, lat],
                    'SampleTime': now_iso,
                    'Accuracy': {'Horizontal': float(accuracy)},
                    'PositionProperties': {
                        'platform': 'laptop-web',
                        'safety_mode': body.get('safety_mode', 'standard')
                    }
                }
            ]
        )

        return {
            'statusCode': 200,
            'headers': {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            'body': json.dumps({
                'status': 'success',
                'service': 'aws-location-service',
                'coordinates': {'latitude': lat, 'longitude': lon, 'accuracy': accuracy},
                'place': place_data,
                'cf_edge': {
                    'city': headers.get('CloudFront-Viewer-City', 'Edge Pop'),
                    'country': headers.get('CloudFront-Viewer-Country-Name', 'Global'),
                    'ip': event.get('requestContext', {}).get('identity', {}).get('sourceIp', '127.0.0.1')
                },
                'timestamp': now_iso
            })
        }
    except Exception as e:
        return {
            'statusCode': 500,
            'headers': {'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*'},
            'body': json.dumps({'error': str(e)})
        }
`;

export interface LambdaInvocationResult {
  statusCode: number;
  latencyMs: number;
  requestId: string;
  responsePayload: Record<string, unknown>;
  logs: string[];
}

export async function simulateAwsLambdaLocate(
  coords: LocationCoordinates,
  edgeGeo: AwsCloudFrontGeo,
  place: AwsLocationPlace,
  region = 'us-west-2'
): Promise<LambdaInvocationResult> {
  const startTime = performance.now();
  const requestId = 'aws-req-' + Math.random().toString(36).substring(2, 10) + '-' + Date.now().toString(36);

  // Artificial short realistic AWS network latency (40ms - 90ms)
  await new Promise((r) => setTimeout(r, 65));

  const latencyMs = Math.round(performance.now() - startTime);

  const logs = [
    `START RequestId: ${requestId} Version: $LATEST (Region: ${region})`,
    `[INFO] Ingesting telemetry from laptop device client (Accuracy: ±${coords.accuracy}m)`,
    `[INFO] CloudFront Viewer Headers: Country=${edgeGeo.viewerCountry}, City=${edgeGeo.viewerCity}, IP=${edgeGeo.viewerIp}`,
    `[INFO] Calling Amazon Location Service: search_place_index_for_position([${coords.longitude.toFixed(5)}, ${coords.latitude.toFixed(5)}])`,
    `[INFO] Resolved Place: ${place.label}`,
    `[INFO] Updating Tracker thelight-device-tracker for deviceId: laptop-${edgeGeo.viewerIp.replace(/\\./g, '')}`,
    `END RequestId: ${requestId}`,
    `REPORT RequestId: ${requestId} Duration: ${latencyMs} ms Billed Duration: 100 ms Memory Size: 256 MB Max Memory Used: 78 MB`,
  ];

  return {
    statusCode: 200,
    latencyMs,
    requestId,
    logs,
    responsePayload: {
      status: 'success',
      awsRegion: region,
      service: 'Amazon Location Service + CloudFront Edge',
      trackerId: 'thelight-device-tracker',
      coordinates: {
        latitude: coords.latitude,
        longitude: coords.longitude,
        accuracyMeters: coords.accuracy,
      },
      placeDetails: {
        label: place.label,
        municipality: place.municipality,
        region: place.region,
        country: place.country,
        countryCode: place.countryCode,
        postalCode: place.postalCode,
      },
      cloudFrontEdge: {
        city: edgeGeo.viewerCity,
        country: edgeGeo.viewerCountryName,
        isp: edgeGeo.viewerIsp,
        timeZone: edgeGeo.viewerTimeZone,
      },
      timestamp: new Date().toISOString(),
    },
  };
}

export async function simulateAwsSnsAlertBroadcast(
  coords: LocationCoordinates,
  place: AwsLocationPlace,
  contactsCount: number,
  batteryLevel?: number | null
): Promise<{ success: boolean; messageId: string; timestamp: string }> {
  await new Promise((r) => setTimeout(r, 80));
  const messageId = 'sns-msg-' + Math.random().toString(36).substring(2, 12);
  const now = new Date().toISOString();

  return {
    success: true,
    messageId,
    timestamp: now,
  };
}
