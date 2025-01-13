- ~~Chatbots Count which are up and running~~
- ~~Traffic analysis~~
- Chatbot's name uniqueness
- Show, some data / Super Admin
- Datewise filter / Super Admin
- User management
- Chatbot management - to create/ update chatbot
- Filter chatbots based on dates like how much we have created

- How many chatbots subscribed - weekly, monthly, yearly

SubAdmin
- Reservation, GetQuote's data
- Finance reports

Payment - Paypal or Stripe


```yaml
ChatbotConfigs:
    - id
    - name
    - heroImg
    - chatbotImg
    - description
    - primaryColor
    - secondaryColor

AvailableQuestions:
    Start:
        - text
    DropDown:
        - text
        - default
        - options
    DOptions:
        - id
        - name
        - value
    Date:
        - format
        - validation
    Time:
        - format
        - validation
    DateTime:
        - format
        - validation
    Number:
        - default
        - min
        - max
    Input:
        - text
    Conditional:
        - if condition
        - else condition
    Email:
        - text
        - validation
    Phone:
        - text
    ClickList:
        - text
        - Actions
    CActions:
        - id
        - text
        - value
    Address:
        - text
        - checks
    Payment:
        - merchant
    End:
        - action
        - redirect_to

Questions:
    - id
    - bot_id
    - question_type
    - data
    - variable

    - prev_ques
    - next_ques

    - created_by
    - created_at
    - updated_at
```


ServiceTypeId
    From Airpot 223490
    To Airpot 223491
    Point to Point 223492
    Hourly  223493

PickUpDate

PickUpTime

PickupLocation

DropoffLocation

PassengerNumber

LuggageCount

showRatesBtn

