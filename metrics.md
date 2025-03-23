- ~~Fix UI issue on Chatbot table~~
- ~~Fix the Profile section using the form UI~~
- ~~Remove Id section from the UI~~
- Remove permissions to delete Admin
- Fix Group and Permissions
- ~~Change name from `Chatbots Table` to `Chatbot`~~
- ~~Change `Tables` to Management Section~~
- ~~Remove Chatbot configs from Table Section~~
- ~~Remove Questions subsection from Tables Section~~ 
- ~~Add Table or Graph view in~~
- ~~Instead of id make the Link for the chatbot connections~~
- ~~Add Edit Profile in Settings~~
- ~~One chatbot means One new account.~~
- Count of chatbots count by time.
- Regional data
- SubAdmin
  - Count of visitors
  - Payments 
  - Getquotes bills
- Only provide access for premium users

### 1. **Number of Active Chatbots**
- **Query**:  
  ```
  sum(chatbots_active_count)
  ```
- **Display**: Count Box  
  **Description**: Shows the total number of active chatbots.  

---

### 2. **Top Active Chatbots by Count**  
- **Query**:  
  ```
  topk(5, sum by (id, name) (chatbots_active_count))
  ```
- **Display**: Bar Chart  
  **Description**: Displays the top 5 active chatbots by name and ID.  

---

### 3. **Traffic Over Time**
- **Query**:  
  ```
  sum(rate(chatbot_traffic_total[5m])) by (chatbot_id)
  ```
- **Display**: Line Chart  
  **Description**: Tracks the traffic (requests/messages processed) for each chatbot over time with a 5-minute rate window.  

---

### 4. **Total Traffic Processed**
- **Query**:  
  ```
  sum(chatbot_traffic_total)
  ```
- **Display**: Count Box  
  **Description**: Displays the cumulative total traffic processed by all chatbots.  

---

### 5. **Questions Answered Per Chatbot**
- **Query**:  
  ```
  sum(rate(chatbot_questions_answered_total[5m])) by (chatbot_id)
  ```
- **Display**: Line Chart  
  **Description**: Tracks the rate of questions answered per chatbot in a 5-minute interval.  

---

### 6. **Total Questions Answered**
- **Query**:  
  ```
  sum(chatbot_questions_answered_total)
  ```
- **Display**: Count Box  
  **Description**: Shows the total number of questions answered by all chatbots.  

---

### 7. **Completed Payments Over Time**
- **Query**:  
  ```
  sum(rate(payment_completed_total[5m]))
  ```
- **Display**: Line Chart  
  **Description**: Displays the number of completed payments over time in a 5-minute window.  

---

### 8. **Total Completed Payments**
- **Query**:  
  ```
  sum(payment_completed_total)
  ```
- **Display**: Count Box  
  **Description**: Shows the total number of completed payments.  

---

### 9. **Average Booking Amount Distribution**
- **Query**:  
  ```
  histogram_quantile(0.5, sum(rate(booking_amount_bucket[5m])) by (le))
  ```
  *(Adjust quantile as needed, e.g., 0.5 for median, 0.9 for 90th percentile)*  
- **Display**: Histogram  
  **Description**: Shows the median (or specified quantile) of booking amounts.  

---

### 10. **Booking Amount Trend Over Time**
- **Query**:  
  ```
  sum(rate(booking_amount_sum[5m])) / sum(rate(booking_amount_count[5m]))
  ```
- **Display**: Line Chart  
  **Description**: Tracks the average booking amount over time in a 5-minute interval.  

---

### 11. **Total Booking Amount**
- **Query**:  
  ```
  sum(booking_amount_sum)
  ```
- **Display**: Count Box  
  **Description**: Displays the cumulative booking amount across all sessions and visitors.  

---

### 12. **Top Visitors by Booking Amount**
- **Query**:  
  ```
  topk(5, sum(rate(booking_amount_sum[5m])) by (visitor_id))
  ```
- **Display**: Bar Chart  
  **Description**: Highlights the top 5 visitors with the highest booking amounts.  
