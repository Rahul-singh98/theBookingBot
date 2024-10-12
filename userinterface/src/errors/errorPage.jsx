import { useRouteError } from "react-router-dom";
import useColorMode from "@/hooks/useColorMode";
import React from "react";

const ErrorPage = () => {
  const [colorMode, setColorMode] = useColorMode();
  const error = useRouteError();
  console.error(error);

  return (
    <section
      className={`h-screen w-screen ${colorMode === "dark" ? "bg-boxdark" : "bg-stroke"}`}
    >
      <div className="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
        <div className="mx-auto max-w-screen-sm text-center">
          <h1
            className={`"mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-gray-400`}
          >
            404
          </h1>
          <p
            className={`mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl text-gray-400`}
          >
            {error ? `${error.message}` : "Something's missing."}
          </p>
          <p className="mb-4 text-lg font-light text-gray-500 dark:text-gray-400">
            Sorry, we can't find that page. You'll find lots to explore on the
            home page.{" "}
          </p>
          <a
            href="/"
            className={`inline-flex focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center bg-gray-400 hover:bg-gray-800 my-4 focus:ring-primary-300 text-gray-400`}
          >
            Back to Homepage
          </a>
        </div>
      </div>
    </section>
  );
};

export default ErrorPage;
