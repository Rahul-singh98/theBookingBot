import React from "react";

const Signup = () => {
  return (
    <section className="bg-white dark:bg-gray-900 min-h-screen flex items-center justify-center">
      <div className="container px-6 py-24 mx-auto lg:py-32">
        <div className="lg:flex">
          <div className="lg:w-1/2">
            <img
              className="w-auto h-7 sm:h-8"
              src="https://merakiui.com/images/logo.svg"
              alt="Logo"
            />

            <h1 className="mt-4 text-gray-600 dark:text-gray-300 md:text-lg">
              Join Us
            </h1>

            <h1 className="mt-4 text-2xl font-medium text-gray-800 capitalize lg:text-3xl dark:text-white">
              Create your account
            </h1>
          </div>

          <div className="mt-8 lg:w-1/2 lg:mt-0">
            <form className="w-full lg:max-w-xl">
              {/* First Name */}
              <div className="relative flex items-center">
                <input
                  type="text"
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-4 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="First Name"
                />
              </div>

              {/* Last Name */}
              <div className="relative flex items-center mt-4">
                <input
                  type="text"
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-4 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Last Name"
                />
              </div>

              {/* Username */}
              <div className="relative flex items-center mt-4">
                <input
                  type="text"
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-4 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Username"
                />
              </div>

              {/* Email */}
              <div className="relative flex items-center mt-4">
                <input
                  type="email"
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-4 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Email address"
                />
              </div>

              {/* Password */}
              <div className="relative flex items-center mt-4">
                <input
                  type="password"
                  className="block w-full py-3 text-gray-700 bg-white border rounded-lg px-4 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-600 focus:border-blue-400 dark:focus:border-blue-300 focus:ring-blue-300 focus:outline-none focus:ring focus:ring-opacity-40"
                  placeholder="Password"
                />
              </div>

              <div className="mt-8 md:flex md:items-center">
                <button className="w-full px-6 py-3 text-sm font-medium tracking-wide text-white capitalize transition-colors duration-300 transform bg-blue-500 rounded-lg md:w-1/2 hover:bg-blue-400 focus:outline-none focus:ring focus:ring-blue-300 focus:ring-opacity-50">
                  Sign Up
                </button>

                <a
                  href="/login"
                  className="inline-block mt-4 text-center text-blue-500 md:mt-0 md:mx-6 hover:underline dark:text-blue-400"
                >
                  Already have an account? Log in
                </a>
              </div>
            </form>
          </div>
        </div>

        <div className="mt-8 md:mt-24 sm:flex sm:items-center">
          <h3 className="text-blue-500 dark:text-blue-400 sm:w-1/2">
            Sign up with Social
          </h3>

          <div className="flex items-center mt-4 sm:mt-0 -mx-1.5 sm:w-1/2">
            <a
              className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
              href="#"
            >
              <svg
                className="w-10 h-10 fill-current"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                {/* Twitter Icon */}
                <path d="M18.6668 6.67334C18.0002 7.00001 17.3468 7.13268 16.6668 7.33334C15.9195 6.49001 14.8115 6.44334 13.7468 6.84201C12.6822 7.24068 11.9848 8.21534 12.0002 9.33334V10C9.83683 10.0553 7.91016 9.07001 6.66683 7.33334C6.66683 7.33334 3.87883 12.2887 9.3335 14.6667C8.0855 15.498 6.84083 16.0587 5.3335 16C7.53883 17.202 9.94216 17.6153 12.0228 17.0113C14.4095 16.318 16.3708 14.5293 17.1235 11.85C17.348 11.0351 17.4595 10.1932 17.4548 9.34801C17.4535 9.18201 18.4615 7.50001 18.6668 6.67268V6.67334Z" />
              </svg>
            </a>

            <a
              className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
              href="#"
            >
              {/* LinkedIn Icon */}
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15.2 8.80005C16.4731 8.80005 17.694 9.30576 18.5941 10.2059C19.4943 11.1061 20 12.327 20 13.6V19.2H16.8V13.6C16.8 13.1757 16.6315 12.7687 16.3314 12.4687C16.0313 12.1686 15.6244 12 15.2 12C14.7757 12 14.3687 12.1686 14.0687 12.4687C13.7686 12.7687 13.6 13.1757 13.6 13.6V19.2H10.4V13.6C10.4 12.327 10.9057 11.1061 11.8059 10.2059C12.7061 9.30576 13.927 8.80005 15.2 8.80005Z"
                  fill="currentColor"
                />
                <path
                  d="M7.2 9.6001H4V19.2001H7.2V9.6001Z"
                  fill="currentColor"
                />
                <path
                  d="M5.6 7.2C6.48366 7.2 7.2 6.48366 7.2 5.6C7.2 4.71634 6.48366 4 5.6 4C4.71634 4 4 4.71634 4 5.6C4 6.48366 4.71634 7.2 5.6 7.2Z"
                  fill="currentColor"
                />
              </svg>
            </a>

            <a
              className="mx-1.5 dark:hover:text-blue-400 text-gray-400 transition-colors duration-300 transform hover:text-blue-500"
              href="#"
            >
              {/* Facebook Icon */}
              <svg
                className="w-8 h-8"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M18 2H6C4.89543 2 4 2.89543 4 4V20C4 21.1046 4.89543 22 6 22H12V14H9V11H12V8.5C12 6.01472 13.7909 4.5 16.0357 4.5C17.0898 4.5 18.0515 4.6726 18.3143 4.71208V7.5H16.8319C15.9048 7.5 15.5 7.9532 15.5 8.73286V11H18L17.5 14H15.5V22H18C19.1046 22 20 21.1046 20 20V4C20 2.89543 19.1046 2 18 2Z"
                  fill="currentColor"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Signup;
