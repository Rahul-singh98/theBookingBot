from langchain.chains import ConversationChain
from langchain.prompts import PromptTemplate
from langchain.memory import ConversationBufferMemory
from langchain.chains.llm import LLMChain
from langchain_groq import ChatGroq
import os


# Replace this with your OpenAI API Key
OPENAI_API_KEY = os.environ.get("GROC_API_KEY")
os.environ.setdefault("GROQ_API_KEY", OPENAI_API_KEY)

# Prompt templates to ask the user for different pieces of information
initial_prompt = """
Hello! I am your booking assistant. Would you like to book a flight or a hotel? Please type 'flight' or 'hotel'.
"""

hotel_prompt = """
You have chosen to book a hotel. I will need some details. Let's start:

1. Your first name?
2. Your last name?
3. Your email address?
4. Your phone number?
5. Number of guests?
6. Reservation date (YYYY-MM-DD)?
7. Type of reservation (Dinner, Birthday, NightLife, Other)? If "Other", please specify the reason.
8. Any special requests?

Type 'done' when finished.
"""

flight_prompt = """
You have chosen to book a flight. I will need some details. Let's start:

1. Your first name?
2. Your last name?
3. Your email address?
4. Your phone number?
5. Flight date (YYYY-MM-DD)?
6. Do you want to book a return ticket? (yes/no)
7. If yes, please enter the return trip date (YYYY-MM-DD).

Type 'done' when finished.
"""

confirmation_prompt = "Thank you! We have received your information."


# Groq-based logic to handle conversation flow
conversation_rules = (
    """
    $booking_type = "input[0] == 'hotel' ? 'hotel' : 'flight'"

    if $booking_type == 'hotel' {
        proceed to hotel_prompt
    } else {
        proceed to flight_prompt
    }
    """
)


# Initialize the language model using OpenAI API
llm = ChatGroq(
    model="mixtral-8x7b-32768",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2
)

# Initialize memory to hold the context of the conversation
memory = ConversationBufferMemory()


# Define the chain that uses Groq logic to guide conversation
booking_chain = LLMChain(
    llm=llm,
    memory=memory,
    prompt=PromptTemplate(
        input_variables=["input"],
        template=initial_prompt,
    ),
    # logic=conversation_rules,
)


def run_booking_bot():
    # Initial Greeting
    print("Welcome to TheBookingBot!")

    while True:
        # Ask the user for input
        user_input = input("You: ")

        # Process the input through the booking chain
        response = booking_chain.invoke({"input": user_input})

        # Display the chatbot's response
        print(f"TheBookingBot: {response}")

        # Handle booking submission based on the conversation flow
        if 'done' in user_input.lower():
            if 'hotel' in user_input.lower():
                # Perform hotel booking submission (Example POST request)
                print("Submitting hotel booking...")
                # Replace this with actual API call logic for hotel booking
            elif 'flight' in user_input.lower():
                # Perform flight booking submission
                print("Submitting flight booking...")
                # Replace this with actual API call logic for flight booking

            print("Thank you for using TheBookingBot. Goodbye!")
            break


if __name__ == "__main__":
    run_booking_bot()
