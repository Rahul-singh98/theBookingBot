from typing import List
from fastapi_mail import FastMail, MessageSchema, ConnectionConfig
import os

MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", '587'))
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_STARTTLS = bool(int(os.getenv("MAIL_STARTTLS", "1")))
MAIL_SSL_TLS = bool(int(os.getenv("MAIL_SSL_TLS", "0")))
USE_CREDENTIALS = bool(int(os.getenv("USE_CREDENTIALS", "1")))
VALIDATE_CERTS = bool(int(os.getenv("VALIDATE_CERTS", "1")))

conf = None


def get_conf():
    global conf

    if conf is None:
        conf = ConnectionConfig(
            MAIL_USERNAME=MAIL_USERNAME,
            MAIL_PASSWORD=MAIL_PASSWORD,
            MAIL_FROM=MAIL_FROM,
            MAIL_PORT=MAIL_PORT,
            MAIL_SERVER=MAIL_SERVER,
            MAIL_STARTTLS=MAIL_STARTTLS,
            MAIL_SSL_TLS=MAIL_SSL_TLS,
            USE_CREDENTIALS=USE_CREDENTIALS,
            VALIDATE_CERTS=VALIDATE_CERTS,
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
