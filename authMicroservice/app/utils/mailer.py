from fastapi_mail import FastMail, MessageSchema, ConnectionConfig, MessageType
import os
import asyncio

# Read mail settings from environment variables
MAIL_USERNAME = os.getenv("MAIL_USERNAME")
MAIL_PASSWORD = os.getenv("MAIL_PASSWORD")
MAIL_FROM = os.getenv("MAIL_FROM")
MAIL_PORT = int(os.getenv("MAIL_PORT", 587))
MAIL_SERVER = os.getenv("MAIL_SERVER", "smtp.gmail.com")
MAIL_STARTTLS = os.getenv("MAIL_STARTTLS", "true").lower() == "true"
MAIL_SSL_TLS = os.getenv("MAIL_SSL_TLS", "false").lower() == "true"
USE_CREDENTIALS = os.getenv("USE_CREDENTIALS", "true").lower() == "true"
VALIDATE_CERTS = os.getenv("VALIDATE_CERTS", "true").lower() == "true"
LOGIN_URL = os.getenv("UI_LOGIN_URL", "http://localhost/login")


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

fm = FastMail(conf)


async def _send_message(subject: str, recipients: list, html_body: str):
    message = MessageSchema(
        subject=subject,
        recipients=recipients,
        subtype=MessageType.html,
        body=html_body,
    )
    # FastMail.send_message is async
    await fm.send_message(message)


def send_user_created_email(to_email: str, username: str, temp_pass: str, first_name: str = "", last_name: str = "") -> None:
    """Fire-and-forget sending of welcome email. If the event loop is running, schedule a task; otherwise, run in a new loop.

    This function never raises for transient mail errors; errors are logged and swallowed so
    user creation isn't blocked by mail failures. For production you might want to surface
    critical errors to a monitoring system.
    """
    subject = "Welcome to TheBookingBot"
    full_name = (first_name + " " +
                 last_name).strip() if (first_name or last_name) else username
    html_body = f"""
    <html>
        <body style="font-family: Arial, Helvetica, sans-serif; line-height: 1.6; color: #333;">
            <div style="max-width:600px;margin:0 auto;padding:20px;border:1px solid #eaeaea;border-radius:8px;">
                <h2 style="color:#0b5ed7;">Welcome, {full_name}!</h2>
                <p>Thanks for creating an account on TheBookingBot. We're excited to have you on board.</p>

                <h3 style="margin-top:20px;">Your login details</h3>
                <p>Please use the credentials below to sign in for the first time. You will be prompted to change your password after login.</p>
                <table style="width:100%;border-collapse:collapse;margin-top:10px;">
                    <tr>
                        <td style="padding:8px;border:1px solid #eaeaea;background:#f9f9f9;width:30%"><strong>Username</strong></td>
                        <td style="padding:8px;border:1px solid #eaeaea">{username}</td>
                    </tr>
                    <tr>
                        <td style="padding:8px;border:1px solid #eaeaea;background:#f9f9f9"><strong>Temporary password</strong></td>
                        <td style="padding:8px;border:1px solid #eaeaea">{temp_pass}</td>
                    </tr>
                </table>

                <p style="margin-top:18px">Sign in here: <a href="{LOGIN_URL}?next=/admin">Click Here</a></p>

                <p style="margin-top:16px;color:#d9534f"><strong>Security note:</strong> For your safety, change this temporary password after signing in. If you did not expect this email, please contact our support immediately.</p>

                <h3 style="margin-top:20px;">Next steps</h3>
                <ul>
                    <li>Visit your dashboard to manage bookings and settings. <a href="{LOGIN_URL}">Go to dashboard</a></li>
                    <li>Check out the documentation for tips and best practices.</li>
                </ul>

                <p style="margin-top:20px">If you have any questions, reply to this email and our team will help.</p>

                <p style="color:#777;font-size:12px;margin-top:30px">TheBookingBot Team</p>
            </div>
        </body>
    </html>
    """

    async def _runner():
        try:
            await _send_message(subject=subject, recipients=[to_email], html_body=html_body)
        except Exception:
            # In this context we purposely swallow exceptions to avoid breaking user creation
            # In production send errors to monitoring/logging system
            import logging

            logging.exception(
                "Failed to send user created email to %s", to_email)

    try:
        loop = asyncio.get_running_loop()
    except RuntimeError:
        loop = None

    if loop and loop.is_running():
        # schedule task in running loop
        asyncio.create_task(_runner())
    else:
        # run a new event loop for the mail send
        try:
            asyncio.run(_runner())
        except Exception:
            import logging

            logging.exception(
                "Failed to send user created email (sync fallback) to %s", to_email)
