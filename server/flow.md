## Interactions

https://demo.thequotebot.com/chat_ajax/update?response=Yes%2C+let%27s+get+a+quote%2Fbook+with+Sammy&questionid=282&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": 1,
  "question_id": "283",
  "question": "What occasion gives us the opportunity to transport you?",
  "type": "dropdown",
  "fill": "ss_quote_service_id",
  "options": ["%%services%%"],
  "error_alert": "",
  "previous_question_answer": "Great, let's get started.",
  "previous_question_client_answer": "Yes, let's get a quote/book with Sammy",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Wed, 31 Dec 69 18:00:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=Other&questionid=283&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=5&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "285",
  "question": "What is your desired pick up date and time?",
  "type": "datetime",
  "fill": "pu_time",
  "options": "",
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "Other",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Wed, 31 Dec 69 18:00:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=2024-09-28+1%3A45+AM&questionid=285&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "287",
  "question": "Where are we picking you up from?",
  "type": "address",
  "fill": "pu_location",
  "options": "",
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "2024-09-28 1:45 AM",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=Plot+6%2C+Sabah+Al+Salem%2C+Kuwait--extrainfo--%257B%2522address_name%2522%253A%2522Plot%25206%252C%2520Sabah%2520Al%2520Salem%252C%2520Kuwait%2522%252C%2522address_city%2522%253A%2522%25D8%25B5%25D8%25A8%25D8%25A7%25D8%25AD%2520%25D8%25A7%25D9%2584%25D8%25B3%25D8%25A7%25D9%2584%25D9%2585%2522%252C%2522address_state%2522%253A%2522%25D9%2585%25D8%25A8%25D8%25A7%25D8%25B1%25D9%2583%2520%25D8%25A7%25D9%2584%25D9%2583%25D8%25A8%25D9%258A%25D8%25B1%2522%252C%2522address_zip%2522%253A%252244002%2522%252C%2522address_country%2522%253A%2522Kuwait%2522%257D&questionid=288&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "290",
  "question": "How many passengers will require transportation?",
  "type": "number",
  "fill": "passengers",
  "options": "",
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "Plot 6, Sabah Al Salem, Kuwait",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=3&questionid=290&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "291",
  "question": "What Vehicle Type would you prefer?",
  "type": "dropdown",
  "fill": "ss_quote_vehicle_id",
  "options": ["%%vehicles%%"],
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "3",
  "history": "",
  "passengers": "3",
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=14+Passenger+Ford+Transit&questionid=291&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=6&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "294",
  "question": "Would you like us to include a quote for the return trip? (Round Trip Quote)",
  "type": "clicklist",
  "fill": "extracomments",
  "options": ["Yes", "No"],
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "14 Passenger Ford Transit",
  "history": "",
  "passengers": "3",
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=No&questionid=294&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=1&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "296",
  "question": "Almost finished.  May we please get your name?",
  "type": "input",
  "fill": "name",
  "options": "",
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "No",
  "history": "",
  "passengers": "3",
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=John&questionid=296&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "297",
  "question": "Can we get your phone number if we need to reach you for any reason?",
  "type": "phone",
  "fill": "phone",
  "options": "",
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "John",
  "history": "",
  "passengers": "3",
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=%2B919876543213&questionid=297&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": "1",
  "question_id": "298",
  "question": "What is your preferred email address where we can send your quote?",
  "type": "email",
  "fill": "email",
  "options": "",
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "+919876543213",
  "history": "",
  "passengers": "3",
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```

https://demo.thequotebot.com/chat_ajax/update?response=toxic48282%40obisims.com&questionid=298&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=0&reset=0&firsttime=0

```json
{
  "status": 2,
  "question_id": 0,
  "question": "Thanks so much for taking the time to request a quote! We will send you both an email and a text link to your professional quote very shortly.",
  "type": "none",
  "fill": null,
  "options": null,
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "toxic48282@obisims.com",
  "history": "",
  "passengers": "3",
  "redirect": "",
  "putime": "Sat, 28 Sep 24 01:45:00",
  "debugtext": "",
  "quote_id": 884,
  "quote_total": "0.00"
}
```


https://demo.thequotebot.com/chat_ajax/update?response=&questionid=&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=&reset=1&firsttime=0
302

https://demo.thequotebot.com/chat_ajax/update?response=&questionid=&chatbotid=12&chatbotsessionid=1726122464007ghj08b49ze&answerindex=&reset=1&firsttime=0&reset=0

```json
{
  "status": 0,
  "question_id": "282",
  "question": "Hi, my name is SAMMY. Due to very high call volumes I am offering DISCOUNTED RATES if you quote and book through me. Would you like to proceed?",
  "type": "clicklist",
  "fill": "none",
  "options": [
    "Yes, let's get a quote\/book with Sammy",
    "I don't need a quote...I'm ready to book now",
    "Not at this time"
  ],
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Wed, 31 Dec 69 18:00:00",
  "debugtext": "",
  "quote_id": 0,
  "quote_total": "0.00"
}
```


https://quotes.leroslimo.com/chat_ajax/update?response=&questionid=&chatbotid=1&chatbotsessionid=1726169100924f43uc5zk75&answerindex=&reset=1&firsttime=0&reset=0

```json
{
  "status": 0,
  "question_id": "18",
  "question": "Hi, my name is Lexy, Due to very high call volumes, we are encouraging customers to quote and book through me. Would you like to move forward?",
  "type": "clicklist",
  "fill": "none",
  "options": [
    "Yes, let's get a quote\/book with Lexy,",
    "Not at this time"
  ],
  "error_alert": "",
  "previous_question_answer": "",
  "previous_question_client_answer": "",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Wed, 31 Dec 69 19:00:00",
  "debugtext": "",
  "quote_id": 0,
  "quote_total": "0.00"
}
```

https://quotes.leroslimo.com/chat_ajax/update?response=Yes%2C+let%27s+get+a+quote%2Fbook+with+Lexy%2C&questionid=18&chatbotid=1&chatbotsessionid=1726169100924f43uc5zk75&answerindex=0&reset=0&firsttime=0

```json
{
  "status": 1,
  "question_id": "19",
  "question": "What occasion gives us the opportunity to transport you?",
  "type": "dropdown",
  "fill": "ss_quote_service_id",
  "options": [
    "%%services%%"
  ],
  "error_alert": "",
  "previous_question_answer": "Great, let's get started.",
  "previous_question_client_answer": "Yes, let's get a quote\/book with Lexy,",
  "history": "",
  "passengers": 0,
  "redirect": "",
  "putime": "Wed, 31 Dec 69 19:00:00",
  "debugtext": "",
  "quote_id": "0",
  "quote_total": "0.00"
}
```