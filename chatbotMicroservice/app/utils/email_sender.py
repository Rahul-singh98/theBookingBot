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


async def send_email(recipients: List[str], subject: str, message: str, subtype="plain") -> bool:
    conf = get_conf()
    try:
        email_message = MessageSchema(
            subject=subject,
            recipients=recipients,
            body=message,
            subtype=subtype
        )

        fm = FastMail(conf)
        await fm.send_message(email_message)
        return True

    except Exception as e:
        print(f"Error sending email: {e}")
        return False


async def send_quote_thankyou_email(
    recipients: List[str],
    customer_name: str = "",
    subject: str = "Thank You for Your Quote Request"
) -> bool:
    """
    Sends a thank-you email after receiving a quote request.
    """
    print("Sending quote thank you email to:", recipients)
    # --- Optional personalization ---
    greeting = f"Dear {customer_name}," if customer_name else "Hello,"

    # --- Email HTML body ---
    html_message = f"""
    <html>
    <body style="font-family: Arial, sans-serif; background-color: #f9f9f9; padding: 20px;">
        <div style="max-width: 600px; margin: auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
            <h2 style="color: #2c3e50;">Thank You for Your Quote Request</h2>
            <p style="font-size: 15px; color: #333;">{greeting}</p>
            <p style="font-size: 15px; color: #333;">
                Thank you for reaching out to us for a quote. Our team has received your request 
                and will contact you shortly to discuss the details.
            </p>
            <p style="font-size: 15px; color: #333;">We appreciate your interest and look forward to working with you.</p>
            <br>
            <p style="font-size: 14px; color: #555;">Best regards,<br><strong>Way2goluxuryShuttle</strong><br>Customer Support Team</p>
        </div>
    </body>
    </html>
    """

    # --- Send Email ---
    return await send_email(
        recipients=recipients,
        subject=subject,
        message=html_message,
        subtype="html"
    )


async def send_book_now_email(json_list, recipient_email, subject="Book Now"):
    """
    Sends an email with a table of questions and answers.

    Parameters:
        json_list (list): List of dicts containing question data.
        recipient_email (str): Email address to send to.
    """
    # --- Create HTML table ---
    table_rows = ""
    for item in json_list:
        variable = item.get("variable", "")
        question = item.get("question", "")
        answer = item.get("answer", "")
        table_rows += f"""
        <tr>
            <td>{variable}</td>
            <td>{question}</td>
            <td>{answer}</td>
        </tr>
        """

    html_content = f"""
    <html>
    <body>
        <h2>Book Now</h2>
        <table border="1" cellpadding="6" cellspacing="0" style="border-collapse: collapse; width: 100%;">
            <thead style="background-color: #f2f2f2;">
                <tr>
                    <th>Variable</th>
                    <th>Question</th>
                    <th>Answer</th>
                </tr>
            </thead>
            <tbody>
                {table_rows}
            </tbody>
        </table>
    </body>
    </html>
    """

    return await send_email(recipient_email, subject, html_content, "html")

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
