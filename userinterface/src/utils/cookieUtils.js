import Cookies from 'js-cookie';
import { v4 as uuidv4 } from 'uuid';

function generateRandomId() {
    return 'visitor-' + uuidv4();
}

// Function to get the cookie
export function getVisitorId() {
    return Cookies.get('visitorId');
}

// Function to set the cookie if not already set
export function setVisitorId() {
    const visitorId = generateRandomId();
    Cookies.set('visitorId', visitorId, { expires: 365 });  // Cookie will expire in 1 year
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
