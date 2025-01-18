// import Cookies from 'js-cookie';
import { v4 as uuidv4 } from "uuid";

const FOUR_WEEKS_MS = 28 * 24 * 60 * 60 * 1000;

function generateRandomId() {
  return "visitor-" + uuidv4();
}

// // Function to get the cookie
// export function getVisitorId() {
//     return Cookies.get('vId');
// }

// // Function to set the cookie if not already set
// export function setVisitorId() {
//     const visitorId = generateRandomId();
//     Cookies.set('vId', visitorId, { expires: 365 });
//     return visitorId;
// }

// Function to get the visitorId from localStorage
export function getVisitorId() {
  const storedData = JSON.parse(localStorage.getItem("vIdData"));

  if (storedData) {
    const { visitorId, timestamp } = storedData;

    // Check if the stored ID is older than 4 weeks
    if (Date.now() - timestamp > FOUR_WEEKS_MS) {
      // ID is expired, remove it
      localStorage.removeItem("vIdData");
      return null;
    }

    return visitorId;
  }

  return null;
}

// Function to set the visitorId with a timestamp
export function setVisitorId() {
  const visitorId = generateRandomId();
  const data = {
    visitorId,
    timestamp: Date.now(),
  };

  localStorage.setItem("vIdData", JSON.stringify(data));
  return visitorId;
}

// Function to get or create the visitorId
export function getOrCreateVisitorId() {
  let visitorId = getVisitorId();
  if (!visitorId) {
    visitorId = setVisitorId();
  }
  return visitorId;
}
