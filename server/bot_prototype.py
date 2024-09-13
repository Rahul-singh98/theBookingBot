from langchain.prompts import PromptTemplate
from langchain.chains.sequential import SimpleSequentialChain
from langchain.agents import initialize_agent, Tool
from langchain.chains.llm import LLMChain
from langchain_groq import ChatGroq
from langchain.chains.conversation.base import ConversationChain
from langchain.memory import ConversationBufferMemory
import requests
import os
import logging

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)
# logger.setLevel(logging.INFO)

OPENAI_API_KEY = os.environ.get("GROC_API_KEY")
os.environ.setdefault("GROQ_API_KEY", OPENAI_API_KEY)

# Define Variables
first_name = "None"
last_name = "None"
phone_number = "None"


# Define prompts for first name, last name, and phone number
first_name_prompt = PromptTemplate(
    input_variables=["welcome"], template="{welcome}\nPlease provide your first name.")
logger.info(first_name_prompt)


last_name_prompt = PromptTemplate(
    input_variables=["first_name"], template="First Name: {first_name}\nPlease provide your last name.")
logger.info(last_name_prompt.format(first_name=first_name))

phone_number_prompt = PromptTemplate(
    template="Last Name: {last_name}\nPlease provide your phone number.")
logger.info(phone_number_prompt.format(
    last_name=last_name))


# Function to collect user input
def collect_first_name():
    input_text = first_name_chain.run(
        {"welcome": "Hello! Welcome to the form assistant."})
    print(input_text)
    first_name = input("User: ")
    return first_name


def collect_last_name(first_name):
    input_text = last_name_chain.run({"first_name": first_name})
    print(input_text)
    last_name = input("User: ")
    return last_name


def collect_phone_number(last_name):
    input_text = phone_number_chain.run({"last_name": last_name})
    print(input_text)
    phone_number = input("User: ")
    return phone_number


# Define an LLM (assuming OpenAI for this example)
llm = ChatGroq(
    model="mixtral-8x7b-32768",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2,
    # model_kwargs={"response_format": {"type": "json_object"}}
)
logger.info(f"Initialized LLM with model: {llm}")

# Chains for sequential input collection using LLMChain
first_name_chain = LLMChain(prompt=first_name_prompt, llm=llm)
logger.info(first_name_chain)

last_name_chain = LLMChain(prompt=last_name_prompt, llm=llm)
logger.info(last_name_chain)

phone_number_chain = LLMChain(prompt=phone_number_prompt, llm=llm)
logger.info(phone_number_chain)

# Sequential chain that collects first name, last name, phone number
input_chain = SimpleSequentialChain(
    chains=[
        first_name_chain,
        last_name_chain,
        phone_number_chain
    ],
    verbose=True
)
# logger.info(input_chain.run("Hey, I'm a chat assistant"))


# Define a function to submit to the API
def submit_to_api(first_name, last_name, phone_number):
    # Example API endpoint (replace with actual API)
    url = "https://api.example.com/submit"

    # Data to be sent to the API
    data = {
        "first_name": first_name,
        "last_name": last_name,
        "phone_number": phone_number
    }

    response = requests.post(url, json=data)

    if response.status_code == 200:
        return "Data submitted successfully!"
    else:
        return f"Failed to submit data. Status code: {response.status_code}"


# Final step: Agent action that submits the collected input
def api_submission_tool(inputs):
    first_name, last_name, phone_number = inputs
    return submit_to_api(first_name, last_name, phone_number)


# Define the tool for submission
submit_tool = Tool(
    name="submit_data",
    func=api_submission_tool,
    description="Submits the first name, last name, and phone number to the API"
)


# Initialize the agent
tools = [submit_tool]
agent = initialize_agent(tools, llm, agent_type="zero-shot-react-description")


# Run the agent to collect inputs and submit to API
def collect_and_submit():
    first_name = collect_first_name()
    # last_name = collect_last_name(first_name)
    # phone_number = collect_phone_number(last_name)

    # # Submit to API
    # result = agent.run(
    #     f"Submit data: {first_name}, {last_name}, {phone_number}")

    # return result


# Example execution
# result = collect_and_submit()
# print(result)


# class InteractiveBot:
#     def __init__(self):
#         self.llm = ChatGroq(
#             model="mixtral-8x7b-32768",
#             temperature=0,
#             max_tokens=None,
#             timeout=None,
#             max_retries=2,
#             # model_kwargs={"response_format": {"type": "json_object"}}
#         )
#         self.memory = ConversationBufferMemory()
#         self.conversation = ConversationChain(
#             llm=self.llm,
#             memory=self.memory,
#             verbose=True
#         )
#         self.first_name = ""
#         self.last_name = ""

#     def start_conversation(self):
#         response = self.conversation.predict(input="""
#         Greet the user and present two options:
#         I. Book
#         II. Flight
#         Ask the user to choose one option.
#         """)
#         print(response)

#         choice = input("Your choice (I or II): ").strip().upper()

#         if choice == "I":
#             self.handle_booking()
#         elif choice == "II":
#             print("You've chosen Flight. This option is not implemented in this demo.")
#         else:
#             print("Invalid choice. Exiting.")

#     def handle_booking(self):
#         response = self.conversation.predict(
#             input="Ask for the user's first name.")
#         print(response)
#         self.first_name = input("Your first name: ").strip()

#         response = self.conversation.predict(
#             input=f"The user's first name is {self.first_name}. Now ask for their last name.")
#         print(response)
#         self.last_name = input("Your last name: ").strip()

#         response = self.conversation.predict(input=f"""
#         The user's full name is {self.first_name} {self.last_name}.
#         Thank them for providing their information and end the conversation.
#         """)
#         print(response)

#         print(f"\nStored information:")
#         print(f"First Name: {self.first_name}")
#         print(f"Last Name: {self.last_name}")


# if __name__ == "__main__":
#     bot = InteractiveBot()
#     bot.start_conversation()


# class InteractiveBot:
#     def __init__(self):
#         self.llm = ChatGroq(
#             model="mixtral-8x7b-32768",
#             temperature=0.7,
#             max_tokens=None,
#             timeout=None,
#             max_retries=2,
#         )
#         self.memory = ConversationBufferMemory()
#         self.conversation = ConversationChain(
#             llm=self.llm,
#             memory=self.memory,
#             verbose=True
#         )
#         self.user_info = {}

#     def start_conversation(self):
#         initial_prompt = """
#         You are an AI assistant for a booking system. Start a conversation with the user:
#         1. Greet the user.
#         2. Present two options: I. Book, II. Flight.
#         3. Ask the user to choose one option.
#         4. If they choose Book, proceed to ask for their first name, then their last name.
#         5. After collecting the information, thank the user and end the conversation.

#         Present one interaction at a time and wait for the user's response.
#         Indicate when you need user input by ending your message with [USER INPUT].
#         """

#         while True:
#             response = self.conversation.predict(input=initial_prompt)
#             print(response)

#             if "[USER INPUT]" in response:
#                 user_input = input("Your response: ").strip()
#                 if "first name" in response.lower():
#                     self.user_info['first_name'] = user_input
#                 elif "last name" in response.lower():
#                     self.user_info['last_name'] = user_input
#                 initial_prompt = f"The user responded: {user_input}. Continue the conversation based on this input."
#             else:
#                 break

#         print("\nStored information:")
#         for key, value in self.user_info.items():
#             print(f"{key.replace('_', ' ').title()}: {value}")


# if __name__ == "__main__":
#     bot = InteractiveBot()
#     bot.start_conversation()


from langchain.chat_models import ChatOpenAI
from langchain.chains import ConversationChain
from langchain.memory import ConversationBufferMemory
from langchain.prompts import PromptTemplate

class QuoteBot:
    def __init__(self):
        self.llm = ChatOpenAI(temperature=0.7)
        self.memory = ConversationBufferMemory()
        
        quote_template = """
        You are QuoteBot, an AI assistant specialized in generating and discussing quotes. Your capabilities include:
        1. Generating original quotes on various topics.
        2. Explaining the meaning behind quotes.
        3. Discussing the context and relevance of quotes.
        4. Engaging in conversations about life, philosophy, and wisdom.

        Current conversation:
        {history}
        Human: {input}
        AI: Let's think about this step-by-step:
        1) First, consider the user's request or question.
        2) If they're asking for a quote, generate an original, thought-provoking quote related to their topic.
        3) If they're asking about a specific quote, provide an explanation or discussion about it.
        4) If they're engaging in a general conversation, respond thoughtfully and incorporate relevant quotes or wisdom.
        5) Always aim to be inspiring, thought-provoking, and engaging.

        Now, based on this thinking, let's respond:
        """
        
        self.prompt = PromptTemplate(
            input_variables=["history", "input"],
            template=quote_template
        )
        
        self.conversation = ConversationChain(
            llm=self.llm,
            memory=self.memory,
            prompt=self.prompt,
            verbose=True
        )

    def chat(self, user_input):
        return self.conversation.predict(input=user_input)

    def run(self):
        print("Welcome to QuoteBot! Ask for a quote, explain a quote, or just chat about life and wisdom. Type 'exit' to end the conversation.")
        while True:
            user_input = input("You: ").strip()
            if user_input.lower() == 'exit':
                print("QuoteBot: Thank you for the enlightening conversation. Until next time!")
                break
            response = self.chat(user_input)
            print("QuoteBot:", response)

if __name__ == "__main__":
    bot = QuoteBot()
    bot.run()