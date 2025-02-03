import React, { useState } from "react";
import { Mail, User, Key, Camera } from "lucide-react";
import UserOne from "@/images/user/user-00.png";
import { useAuth } from "@/hooks/useAuth";
import { uploadImage } from "@/api/upload";

const Profile = () => {
  const { user } = useAuth();
  const [profilePhoto, setProfilePhoto] = useState(
    user.profile_photo || UserOne
  );

  const handleProfilePhotoChange = async (e, name) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);

      try {
        // Upload the image to the backend
        const data = await uploadImage(formData);
        const fileUrl = data.file_url;

        user.profile_photo = fileUrl;
        profilePhoto = fileUrl;
      } catch (err) {
        console.error("Error uploading image:", err);
      }
    } else {
      console.log("No file found...");
    }
  };

  const handleResetPassword = () => {
    console.log("Reset password clicked");
  };

  return (
    <div className="bg-gray-50/50 dark:bg-gray-900/50 p-4">
      <div className="h-full bg-white/90 dark:bg-boxdark shadow-xl rounded-lg">
        <div className="p-8 md:p-12">
          {/* Profile Header */}
          <div className="flex flex-col items-center mb-12">
            <div className="relative group">
              <div className="relative h-40 w-40">
                <img
                  src={profilePhoto}
                  alt="Profile"
                  className="rounded-full object-cover ring-4 ring-white dark:ring-gray-800 shadow-lg"
                />
                <label
                  htmlFor="profile-photo"
                  className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                >
                  <Camera className="w-10 h-10 text-white" />
                  <input
                    type="file"
                    id="profile-photo"
                    className="sr-only"
                    accept="image/*"
                    onChange={handleProfilePhotoChange}
                  />
                </label>
              </div>
            </div>
            <h2 className="mt-6 text-3xl font-semibold text-gray-800 dark:text-white">
              {(user.first_name || "") +
                " " +
                (user.last_name || "")}
            </h2>
            <p className="text-lg text-gray-500 dark:text-gray-400">
              Update your profile information
            </p>
          </div>

          <div className="h-px bg-gray-200 dark:bg-gray-700 my-8" />

          {/* Profile Information */}
          <div className="max-w-5xl mx-auto space-y-8">
            <div className="grid gap-8 md:grid-cols-2">
              {/* Username */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <User className="w-5 h-5 mr-2" />
                  <label className="text-base font-medium">Username</label>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-200 text-lg">
                  {user.username}
                </div>
              </div>

              {/* Email */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <Mail className="w-5 h-5 mr-2" />
                  <label className="text-base font-medium">Email</label>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-200 text-lg">
                  {user.email}
                </div>
              </div>

              {/* First Name */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <User className="w-5 h-5 mr-2" />
                  <label className="text-base font-medium">First Name</label>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-200 text-lg">
                  {user.first_name}
                </div>
              </div>

              {/* Last Name */}
              <div className="space-y-3">
                <div className="flex items-center text-gray-500 dark:text-gray-400">
                  <User className="w-5 h-5 mr-2" />
                  <label className="text-base font-medium">Last Name</label>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-900 rounded-lg text-gray-800 dark:text-gray-200 text-lg">
                  {user.last_name}
                </div>
              </div>
            </div>

            <div className="h-px bg-gray-200 dark:bg-gray-700 my-8" />

            {/* Actions */}
            <div className="flex justify-between items-center">
              <button
                className="flex items-center gap-2 px-6 py-3 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors text-lg"
                // onClick={() => document.getElementById("profile-photo").click()}
              >
                Update Data
              </button>
              <button
                className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors text-lg"
                onClick={handleResetPassword}
              >
                <Key className="w-5 h-5" />
                Reset Password
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
