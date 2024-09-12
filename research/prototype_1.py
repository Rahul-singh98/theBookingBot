from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain.agents import tool
from langchain.agents import AgentExecutor
from langchain_groq import ChatGroq
from langchain.agents.format_scratchpad.openai_tools import (
    format_to_openai_tool_messages,
)
from langchain.agents.output_parsers.openai_tools import OpenAIToolsAgentOutputParser
import os
import logging

logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s - %(levelname)s - %(name)s - %(message)s",
    datefmt="%Y-%m-%d %H:%M"
)

logger = logging.getLogger(__name__)

# Replace this with your OpenAI API Key
OPENAI_API_KEY = os.environ.get("GROC_API_KEY")
os.environ.setdefault("GROQ_API_KEY", OPENAI_API_KEY)


@tool
def get_word_length(word: str) -> int:
    """Returns the length of a word."""
    return len(word)


logger.info("When invoking get word length we get %s",
            get_word_length.invoke("abc"))


tools = [get_word_length]

# Initialize Chat Model
llm = ChatGroq(
    model="mixtral-8x7b-32768",
    temperature=0,
    max_tokens=None,
    timeout=None,
    max_retries=2
)


prompt = ChatPromptTemplate.from_messages(
    [
        (
            "system",
            "You are very powerful assistant, who can help user in booking by getting some data as input.",
        ),
        ("user", "{input}"),
        MessagesPlaceholder(variable_name="booking_bot_agent"),
    ]
)

logger.info("Prompt is %s", prompt)


llm_with_tools = llm.bind_tools(tools)
agent = (
    {
        "input": lambda x: x["input"],
        "booking_bot_agent": lambda x: format_to_openai_tool_messages(
            x["intermediate_steps"]
        ),
    }
    | prompt
    | llm_with_tools
    | OpenAIToolsAgentOutputParser()
)


agent_executor = AgentExecutor(agent=agent, tools=tools, verbose=True)

logger.info("Executing agent %s", list(agent_executor.stream(
    {"input": "How many letters in the word eudca"})))
