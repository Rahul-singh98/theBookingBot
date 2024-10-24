import os
from app.database import SessionLocal
from app.models import User, Group, UserGroup, Permission, GroupPermission
from app.crud.users import get_user_by_email
from app.utils.hashing import get_password_hash
from sqlalchemy.exc import IntegrityError
import uuid
import logging

logger = logging.getLogger(__name__)


def create_super_admin():
    # Check if we should create a super admin
    create_admin = os.getenv("CREATE_SUPER_ADMIN", "false").lower() == "true"
    print("CreateAdminConfigENV", os.getenv("CREATE_SUPER_ADMIN"))
    print("CreateAdminConfig", create_admin)

    if not create_admin:
        logger.info("Super admin creation is disabled.")
        return

    # Get admin details from environment variables
    admin_email = os.getenv("SUPER_ADMIN_EMAIL", "admin@gmail.com")
    admin_username = os.getenv("SUPER_ADMIN_USERNAME", "super_admin")
    admin_password = os.getenv("SUPER_ADMIN_PASSWORD", "#Admin@1234")
    admin_first_name = os.getenv("SUPER_ADMIN_FIRST_NAME", "Super")
    admin_last_name = os.getenv("SUPER_ADMIN_LAST_NAME", "Admin")

    if not all([admin_email, admin_username, admin_password]):
        logger.info(
            "Missing required environment variables for super admin creation.")
        return

    db = SessionLocal()

    try:
        super_admin = get_user_by_email(db, admin_email)

        if super_admin:
            raise Exception("User with same email already exists.")

        # Create super admin user
        super_admin = User(
            id=str(uuid.uuid4()),
            email=admin_email,
            username=admin_username,
            first_name=admin_first_name,
            last_name=admin_last_name,
            hashed_password=get_password_hash(admin_password),
            status="active"
        )
        db.add(super_admin)
        db.flush()

        # Create 'SuperAdmin' group
        super_admin_group = Group(
            id=str(uuid.uuid4()),
            name="SuperAdmin",
            description="Group with all permissions"
        )
        db.add(super_admin_group)
        db.flush()

        # Associate user with the SuperAdmin group
        user_group = UserGroup(
            user_id=super_admin.id,
            group_id=super_admin_group.id
        )
        db.add(user_group)

        # Create all permissions and associate them with the SuperAdmin group
        all_permissions = [
            "*:*:*",
        ]

        for perm_name in all_permissions:
            permission = Permission(
                id=str(uuid.uuid4()),
                name=perm_name,
                scope="global",
                description=f"Permission to {perm_name.split(':')[1]} {perm_name.split(':')[0]} {perm_name.split(':')[2]}"
            )
            db.add(permission)
            db.flush()

            group_permission = GroupPermission(
                group_id=super_admin_group.id,
                permission_id=permission.id
            )
            db.add(group_permission)

        db.commit()
        logger.info("Super admin user created successfully.")

    except IntegrityError:
        db.rollback()
        logger.error("Super admin user already exists.")
    except Exception as e:
        db.rollback()
        logger.error(f"An error occurred while creating super admin: {str(e)}")
    finally:
        db.close()
