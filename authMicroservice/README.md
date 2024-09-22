# Authentication and Authorization API Endpoints

## User Management

1. **Register User**

   - Endpoint: `POST /api/auth/register`
   - Description: Create a new user account

2. **Get User Profile**

   - Endpoint: `GET /api/auth/users/me`
   - Description: Retrieve the profile of the currently authenticated user

3. **Update User Profile**

   - Endpoint: `PUT /api/auth/users/me`
   - Description: Update the profile of the currently authenticated user

4. **Delete User**

   - Endpoint: `DELETE /api/auth/users/me`
   - Description: Delete the current user's account

5. **List Users** (Admin only)

   - Endpoint: `GET /api/auth/users`
   - Description: Retrieve a list of all users

6. **Get User by ID** (Admin only)

   - Endpoint: `GET /api/auth/users/{user_id}`
   - Description: Retrieve a specific user's details

7. **Update User by ID** (Admin only)

   - Endpoint: `PUT /api/auth/users/{user_id}`
   - Description: Update a specific user's details

8. **Delete User by ID** (Admin only)
   - Endpoint: `DELETE /api/auth/users/{user_id}`
   - Description: Delete a specific user's account

## Authentication

9. **Login**

   - Endpoint: `POST /api/auth/login`
   - Description: Authenticate a user and return a token

10. **Logout**

    - Endpoint: `POST /api/auth/logout`
    - Description: Invalidate the current session or token

11. **Refresh Token**

    - Endpoint: `POST /api/auth/token/refresh`
    - Description: Get a new access token using a refresh token

12. **Verify Token**

    - Endpoint: `POST /api/auth/token/verify`
    - Description: Verify the validity of an access token

13. **Change Password**

    - Endpoint: `POST /api/auth/password/change`
    - Description: Change the password for the authenticated user

14. **Forgot Password**

    - Endpoint: `POST /api/auth/password/forgot`
    - Description: Initiate the password reset process

15. **Reset Password**
    - Endpoint: `POST /api/auth/password/reset`
    - Description: Reset the password using a reset token

## Authorization

16. **List User Permissions**

    - Endpoint: `GET /api/auth/users/me/permissions`
    - Description: Retrieve permissions for the current user

17. **Check User Permission**

    - Endpoint: `POST /api/auth/users/me/check-permission`
    - Description: Check if the current user has a specific permission

18. **List User Groups**

    - Endpoint: `GET /api/auth/users/me/groups`
    - Description: Retrieve groups the current user belongs to

19. **Add User to Group**

    - Endpoint: `POST /api/auth/users/{user_id}/groups`
    - Description: Add a user to a group (Admin only)

20. **Remove User from Group**
    - Endpoint: `DELETE /api/auth/users/{user_id}/groups/{group_id}`
    - Description: Remove a user from a group (Admin only)

## Group Management

21. **Create Group**

    - Endpoint: `POST /api/auth/groups`
    - Description: Create a new group (Admin only)

22. **List Groups**

    - Endpoint: `GET /api/auth/groups`
    - Description: Retrieve a list of all groups

23. **Get Group Details**

    - Endpoint: `GET /api/auth/groups/{group_id}`
    - Description: Retrieve details of a specific group

24. **Update Group**

    - Endpoint: `PUT /api/auth/groups/{group_id}`
    - Description: Update a group's details (Admin only)

25. **Delete Group**

    - Endpoint: `DELETE /api/auth/groups/{group_id}`
    - Description: Delete a group (Admin only)

26. **List Group Permissions**

    - Endpoint: `GET /api/auth/groups/{group_id}/permissions`
    - Description: Retrieve permissions assigned to a group

27. **Add Permission to Group**

    - Endpoint: `POST /api/auth/groups/{group_id}/permissions`
    - Description: Assign a permission to a group (Admin only)

28. **Remove Permission from Group**
    - Endpoint: `DELETE /api/auth/groups/{group_id}/permissions/{permission_id}`
    - Description: Remove a permission from a group (Admin only)

## Additional Features

29. **Two-Factor Authentication Setup**

    - Endpoint: `POST /api/auth/2fa/setup`
    - Description: Set up two-factor authentication for a user

30. **Two-Factor Authentication Verify**

    - Endpoint: `POST /api/auth/2fa/verify`
    - Description: Verify a two-factor authentication code

31. **List Active Sessions**

    - Endpoint: `GET /api/auth/sessions`
    - Description: List all active sessions for the current user

32. **Revoke Session**

    - Endpoint: `DELETE /api/auth/sessions/{session_id}`
    - Description: Revoke a specific session

33. **Get Authentication Logs**
    - Endpoint: `GET /api/auth/logs`
    - Description: Retrieve authentication logs for the current user
