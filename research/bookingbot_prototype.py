import requests
from langchain.tools import BaseTool
from langchain.agents import initialize_agent, Tool, AgentType
from langchain_groq import ChatGroq
import os

# Replace this with your OpenAI API Key
OPENAI_API_KEY = os.environ.get("GROC_API_KEY")
os.environ.setdefault("GROQ_API_KEY", OPENAI_API_KEY)

# Step 3: Define the Custom Tool for API Call


class BookingTool(BaseTool):
    name = "booking_tool"
    description = "This tool books a reservation with the first name, last name, and number of guests provided."

    def _run(self, first_name: str, last_name: str, number_of_guests: int):
        """Run the tool with the provided inputs."""
        url = "https://myapi.com/book"
        data = {
            "first_name": first_name,
            "last_name": last_name,
            "number_of_guests": number_of_guests
        }
        try:
            response = requests.post(url, json=data)
            if response.status_code == 200:
                return f"Booking successful: {response.json()}"
            else:
                return f"Failed to book: {response.text}"
        except Exception as e:
            return f"Error during booking: {str(e)}"

    def _arun(self, first_name: str, last_name: str, number_of_guests: int):
        """Asynchronous run method not implemented."""
        raise NotImplementedError("Asynchronous booking not supported.")

    def run(self, input_dict):
        """Wrap _run to provide compatibility with LangChain tool requirements."""
        return self._run(**input_dict)


# Step 4: Initialize LangChain Agent with the Custom Tool
booking_tool = BookingTool()
tools = [
    Tool(
        name=booking_tool.name,
        func=booking_tool.run,
        description=booking_tool.description
    )
]

# Initialize Chat Model
llm = ChatGroq(
    model="mixtral-8x7b-32768",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2
)

# Create the agent
agent = initialize_agent(
    tools=tools,
    llm=llm,
    agent=AgentType.ZERO_SHOT_REACT_DESCRIPTION,
    verbose=True
)

# Example usage


def make_booking(first_name, last_name, number_of_guests):
    result = agent.run(
        f"Book a reservation for {first_name} {last_name} with {number_of_guests} guests.")
    print(result)


# Example input
make_booking("John", "Doe", 3)
