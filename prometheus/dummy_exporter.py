from prometheus_client import start_http_server, Gauge, Counter, Histogram
import random
import time
from uuid import uuid4
import string
import threading

HTTP_PORT = 8002

# Metric to track the number of chatbots that are up and running
CHATBOTS_GAUGE = Gauge(
    'chatbots_gauge_total', 
    'Number of chatbots up and running',
    ['bot_id', 'bot_name', 'bot_author']
)

# Metric to track traffic analysis
CHATBOTS_TRAFFIC = Counter(
    'chatbots_traffic_total', 
    'Total number of sessions processed by chatbots',
    ['bot_id', 'bot_author', "s_id", 'v_id']
)

# # Metric to track the number of questions answered by chatbots
# QUESTIONS_ANSWERED_COUNTER = Counter(
#     'chatbot_questions_answered_total', 
#     'Total number of questions answered by chatbots, tracked by chatbot ID and session ID', 
#     ['chatbot_id', "session_id", 'visitor_id']
# )

# # Metric to track completed payments
# PAYMENT_COMPLETED_COUNTER = Counter(
#     'payment_completed_total', 
#     'Total number of completed payments by user', 
#     ['visitor_id', 'session_id']
# )

# # Metric to track booking amount
# BOOKING_AMOUNT_HISTOGRAM = Histogram(
#     'booking_amount', 
#     'Distribution of booking amounts', 
#     ['visitor_id', 'session_id']
# )

# Start up the server to expose the metrics.
start_http_server(HTTP_PORT)

# Helper functions to generate random data
def generate_uuid():
    return str(uuid4())

def generate_random_str(k=10):
    return "".join(random.choices(string.ascii_lowercase + string.ascii_uppercase, k=k))

def generate_random_amount(min_amount=10, max_amount=1000):
    return random.uniform(min_amount, max_amount)

def simulate_chatbot_activity(user_id):
    # Simulate creating a new chatbot
    chatbot_id = generate_uuid()
    chatbot_name = f"Chatbot-{generate_random_str(5)}"
    created_by = user_id
    
    # Set the active chatbot gauge
    CHATBOTS_GAUGE.labels(bot_id=chatbot_id, bot_name=chatbot_name, bot_author=created_by).inc()
    # print("Active Chatbots")

    # Simulate traffic and interaction
    for _ in range(random.randint(5, 20)):  # Simulate 5 to 20 messages
        session_id = generate_uuid()
        visitor_id = random.choice(users)  # Pick a random visitor
        CHATBOTS_TRAFFIC.labels(bot_id=chatbot_id, s_id=session_id, v_id=visitor_id, bot_author=created_by).inc()
        # print("Incremented Traffic Counter")

        # Simulate question answering
        # QUESTIONS_ANSWERED_COUNTER.labels(chatbot_id=chatbot_id, session_id=session_id, visitor_id=visitor_id).inc()

        # Simulate payments and booking
        # if random.random() > 0.8:  # 20% chance to simulate a payment
        #     PAYMENT_COMPLETED_COUNTER.labels(visitor_id=visitor_id, session_id=session_id).inc()

        # if random.random() > 0.5:  # 50% chance to simulate booking
        #     booking_amount = generate_random_amount()
        #     BOOKING_AMOUNT_HISTOGRAM.labels(visitor_id=visitor_id, session_id=session_id).observe(booking_amount)

        time.sleep(random.uniform(2, 10))  # Simulate delay between actions

    # After processing, set the chatbot as inactive
    # ACTIVE_CHATBOTS_GAUGE.labels(id=chatbot_id, name=chatbot_name, created_by=created_by).dec()

# Create a list of users (simulating 10 unique visitors)
users = [generate_uuid() for _ in range(10)]

# Use threads to simulate concurrent chatbot activity for multiple users
def start_simulation():
    while True:
        for user in users:
            # Simulate each user creating and interacting with a chatbot
            threading.Thread(target=simulate_chatbot_activity, args=(user,)).start()
        time.sleep(random.uniform(5, 15))  # Random delay before next cycle

# Start the simulation in a background thread
simulation_thread = threading.Thread(target=start_simulation)
simulation_thread.daemon = True  # Allow the main program to exit while simulation is running
simulation_thread.start()

# Keep the main thread alive so the server can continue serving
while True:
    time.sleep(1)
