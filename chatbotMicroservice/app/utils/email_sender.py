from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os

MAIL_USERNAME = os.environ.get('MAIL_USERNAME')
MAIL_PASSWORD = os.environ.get('MAIL_PASSWORD')
MAIL_APP_NAME = os.environ.get('MAIL_APP_NAME')
MAIL_SERVER = os.environ.get('MAIL_SERVER', 'smtpout.secureserver.net')
MAIL_PORT = int(os.environ.get('MAIL_PORT', '587'))
MAIL_TLS = bool(int(os.environ.get('MAIL_TLS', '0')))
MAIL_SSL = bool(int(os.environ.get('MAIL_SSL', '0')))

conf = None

def get_conf():
    global conf

    if conf is None:
        conf = ConnectionConfig(
            MAIL_USERNAME=MAIL_USERNAME,
            MAIL_PASSWORD=MAIL_PASSWORD,
            MAIL_FROM=MAIL_USERNAME,
            MAIL_PORT=MAIL_PORT,
            MAIL_SERVER=MAIL_SERVER,
            MAIL_TLS=MAIL_TLS,
            MAIL_SSL=MAIL_SSL,
            MAIL_FROM_NAME=MAIL_APP_NAME
        )

    return conf


async def send_email(recipients: List[str], subject: str, message: str) -> bool:
    conf = get_conf()
    try:
        email_message = MessageSchema(
            subject=subject,
            recipients=recipients,
            body=message,
            subtype="plain"
        )

        fm = FastMail(conf)
        await fm.send_message(email_message)
        return True

    except Exception as e:
        print(f"Error sending email: {e}")
        return False

# AWS_REGION = os.environ.get("AWS_REGION")
# AWS_ACCESS_KEY = os.environ.get('AWS_ACCESS_KEY')
# AWS_SECRET_KEY = os.environ.get('AWS_SECRET_KEY')
# AWS_EMAIL_SENDER = os.environ.get('AWS_EMAIL_SENDER')

# ses_client = boto3.client(
#     "ses",
#     region_name=AWS_REGION,
#     aws_access_key_id=AWS_ACCESS_KEY,
#     aws_secret_access_key=AWS_SECRET_KEY
# )


# def send_email(recipients: List[str], subject: str, message: str) -> bool:
#     try:
#         ses_client.send_email(
#             Source=AWS_EMAIL_SENDER,
#             Destination={
#                 'ToAddresses': recipients,
#             },
#             Message={
#                 'Subject': {'Data': subject},
#                 'Body': {'Text': {
#                     'Data': message
#                 }}
#             }
#         )
#         return True

#     except Exception as e:
#         print(f"Error sending email: {e}")
#         return False