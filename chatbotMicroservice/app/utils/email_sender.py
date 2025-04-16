from typing import List
import boto3
import os

AWS_REGION = os.environ.get("AWS_REGION")
AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
AWS_EMAIL_SENDER = os.environ.get('AWS_EMAIL_SENDER')

ses_client = boto3.client(
    "ses",
    region_name=AWS_REGION,
    aws_access_key_id=AWS_ACCESS_KEY,
    aws_secret_access_key=AWS_SECRET_KEY
)


def send_email(recipients: List[str], subject: str, message: str) -> bool:
    try:
        ses_client.send_email(
            Source=AWS_EMAIL_SENDER,
            Destination={
                'ToAddresses': recipients,
            },
            Message={
                'Subject': {'Data': subject},
                'Body': {'Text': {
                    'Data': message
                }}
            }
        )
        return True

    except Exception as e:
        print(f"Error sending email: {e}")
        return False