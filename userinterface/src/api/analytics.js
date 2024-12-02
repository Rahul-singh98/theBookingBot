// Function to handle user login
export const total_bookings = async (chatbot_id) => {
    return {
        current: 100,
        previous: 110
    }
};

export const booking_success_rates = async (user_id) => {
    return [
        {
            id: "abc",
            success: 80,
            failure: 20
        },
        {
            id: "xyz",
            success: 20,
            failure: 80
        },
    ]
}