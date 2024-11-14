export const dateFormatOptions = [
    { value: "%Y-%m-%d", label: "YYYY-MM-DD" },
    { value: "%m/%d/%Y", label: "MM/DD/YYYY" },
    { value: "%d-%m-%Y", label: "DD-MM-YYYY" },
    { value: "%B %d, %Y", label: "Month DD, YYYY" },
    { value: "%b %d, %Y", label: "Mon DD, YYYY" },
    { value: "%m/%d/%y", label: "MM/DD/YY" },
    { value: "%Y/%m/%d", label: "YYYY/MM/DD" },
    { value: "%d %B, %Y", label: "DD Month, YYYY" },
    { value: "%A, %B %d, %Y", label: "Weekday, Month DD, YYYY" },
    { value: "%a, %b %d, %Y", label: "Abbr Weekday, Abbr Month DD, YYYY" },
    { value: "%Y", label: "YYYY (Year)" },
    { value: "%B", label: "Month (Full Name)" },
    { value: "%b", label: "Month (Abbr Name)" },
    { value: "%d", label: "DD (Day of Month)" },
    { value: "%A", label: "Weekday (Full Name)" },
    { value: "%a", label: "Weekday (Abbr Name)" },

    { value: "%x", label: "Locale Date" },
    { value: "%X", label: "Locale Time" }
];

export const timeFormatOptions = [
    { value: "%I:%M %p", label: "HH:MM AM/PM" },
    { value: "%H:%M:%S", label: "HH:MM:SS" },
    { value: "%H:%M", label: "HH:MM (24-hour)" },
    { value: "%I:%M %p", label: "HH:MM (12-hour AM/PM)" },
    { value: "%H:%M:%S", label: "HH:MM:SS (24-hour)" },
    { value: "%I:%M:%S %p", label: "HH:MM:SS (12-hour AM/PM)" },

]

export const dateTimeFormatOptions = [
    { value: "%Y-%m-%d %H:%M:%S", label: "YYYY-MM-DD HH:MM:SS" },
    { value: "%d/%m/%Y %I:%M %p", label: "DD/MM/YYYY HH:MM AM/PM" },
    { value: "%Y-%m-%dT%H:%M:%S", label: "ISO 8601 (YYYY-MM-DDTHH:MM:SS)" },
    { value: "%Y-%m-%d %H:%M:%S %Z", label: "YYYY-MM-DD HH:MM:SS Timezone" },
    { value: "%c", label: "Locale Date and Time" },
]