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

export const getAuthorizationHeader = () => {
  const token = getAccessToken();
  return {
    Authorization: `${token.token_type} ${token.access_token}`,
  };
};
