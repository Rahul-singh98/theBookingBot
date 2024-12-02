// Function to handle user login
export const total_bookings = async (chatbot_id) => {
    return {
        current: 100,
        previous: 110
    }
};

export const total_chatbots = async (user_id) => {
    return {
        current: 5,
        previous: 10
    }
}

export const average_number_of_question_in_chatbots = async (user_id) => {
    return {
        current: 5,
        previous: 10
    }
}


export const bookings_through_chatbots = async (user_id, resolution) => {
    return {
        data: [
            {
                name: 'Chatbot1',
                data: [23, 11, 22, 27, 13, 22, 37, 21, 44, 22, 30, 45],
            },
            {
                name: 'Chatbot2',
                data: [30, 25, 36, 30, 45, 35, 64, 52, 59, 36, 39, 51],
            },
            {
                name: 'Chatbot3',
                data: [30, 25, 40, 30, 50, 35, 64, 52, 59, 39, 45, 51],
            },
        ],
        meta: {
            xAxis: {
                columns: [
                    'Sep',
                    'Oct',
                    'Nov',
                    'Dec',
                    'Jan',
                    'Feb',
                    'Mar',
                    'Apr',
                    'May',
                    'Jun',
                    'Jul',
                    'Aug',
                ],
                type: "category"
            },
            yAxis: {
                min: 0,
                max: 100
            },
            colors: ['#3C50E0', '#80CAEE', '#80CAFF'],
            markers: {
                strokeColors: ['#3056D3', '#80CAEE', '#80CAFF'],
            }
        }
    }
}


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