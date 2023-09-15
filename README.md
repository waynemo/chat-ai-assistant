# chat-ai-assistant

This is a sample Virtual Assistant Chat Bot implemented as follows:
- An Azure Function listens to Chat events from Azure Communication Services via an Event Grid System Topic
- Based on the type of Chat Event, the Azure Function will perform some logic:
    - When a new Chat thread is created, the Bot will be added to the thread and initial message context will be initialized/stored for the thread
    - When a user sends a message:
        - The user message will be appended to the message context for the thread and saved. 
        - The Azure Open AI Chat Completion API will be invoked with the message context to generate a Bot response. 
        - The Bot response will be appended to the message context and saved.
        - The Bot response will be sent back to the Chat via Azure Communication Services

## Prerequisites

Create/configure the following Azure Resources
- Functions App
- Communication Service
- Open AI
- Cosmos DB for NoSQL
- Event Grid System Topic - Subscribe to Chat Events from Communication Service to trigger Function App


## Running Locally

Create the following local config for the function app:
```json
{
  "IsEncrypted": false,
  "Values": {
    "AzureWebJobsStorage": "UseDevelopmentStorage=true",
    "FUNCTIONS_WORKER_RUNTIME": "node",
    "ACS_ENDPOINT_URL": "<AZURE COMMUNICAION SERVICES ENPOINT URL>",
    "ACS_ACCESS_KEY": "<AZURE COMMUNICAION SERVICES ACCESS_KEY>",
    "ACS_CHAT_ADMIN_USER_ID": "<AZURE COMMUNICAION SERVICES IDENTITY FOR MANAGING THE CHAT>",
    "ACS_CHAT_BOT_USER_ID": "<AZURE COMMUNICAION SERVICES IDENTITY REPRESENTING THE VIRTUAL ASSISTANT>",
    "COSMOSDB_ENDPOINT_URL": "<AZURE COSMOS DB ENPOINT URL>",
    "COSMOSDB_ACCESS_KEY": "<AZURE COSMOS DB ACCESS KEY>",
    "OPENAI_ENDPOINT_URL": "<AZURE OPEN AI ENDPOINT URL>",
    "OPENAI_ACCESS_KEY": "<AZURE OPEN AI ACCESS KEY>"
  }
}
```

## Deploying Azure Function
Ensure the following Application Settings are configured:
```bash
ACS_ENDPOINT_URL="<AZURE COMMUNICAION SERVICES ENPOINT URL>"
ACS_ACCESS_KEY="<AZURE COMMUNICAION SERVICES ACCESS_KEY>"
ACS_CHAT_ADMIN_USER_ID="<AZURE COMMUNICAION SERVICES IDENTITY FOR MANAGING THE CHAT>"
ACS_CHAT_BOT_USER_ID="<AZURE COMMUNICAION SERVICES IDENTITY REPRESENTING THE VIRTUAL ASSISTANT>"
COSMOSDB_ENDPOINT_URL="<AZURE COSMOS DB ENPOINT URL>"
COSMOSDB_ACCESS_KEY="<AZURE COSMOS DB ACCESS KEY>"
OPENAI_ENDPOINT_URL="<AZURE OPEN AI ENDPOINT URL>"
OPENAI_ACCESS_KEY="<AZURE OPEN AI ACCESS KEY>"
```