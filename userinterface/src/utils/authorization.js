export const getAccessToken = () => {
  const tokenData = localStorage.getItem("user");

  if (tokenData) {
    const parsedData = JSON.parse(tokenData);
    return parsedData;
  } else {
    console.warn("Access token not found.");
    return null;
  }
};
