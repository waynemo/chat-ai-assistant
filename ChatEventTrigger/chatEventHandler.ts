import { ChatClient, SendMessageOptions } from '@azure/communication-chat';
import { ACS_ENDPOINT_URL, ACS_CHAT_ADMIN_USER_ID, ACS_CHAT_BOT_USER_ID } from './utils/envConfig';
import { chatAdminCredential, chatBotCredential } from './utils/identityHelper';
import { initAssistant, processUserMessage } from './chatAssistantService';

const BOT_DISPLAY_NAME = 'Virtual Assistant';
const adminChatClient = new ChatClient(ACS_ENDPOINT_URL, chatAdminCredential);
const botChatClient = new ChatClient(ACS_ENDPOINT_URL, chatBotCredential);

export const handleChatThreadCreated = async (threadId: string) => {
    await addBotToThread(threadId);
    await initAssistant(threadId);
};

export const handleChatThreadParticipantAdded = async (threadId: string, participantAddedUserId: string) => {
    // Bot prompt when first user is added
    if (participantAddedUserId !== ACS_CHAT_ADMIN_USER_ID && participantAddedUserId !== ACS_CHAT_BOT_USER_ID) {
        await sendBotMessage(threadId, 'Hello, how may I help you?');
    }
};

export const handleChatMessageReceivedInThread = async (threadId: string, senderUserId: string, messageBody: string) => {
    // Handle received message
    if (senderUserId !== ACS_CHAT_BOT_USER_ID) {
        const assistantResponse = await processUserMessage(threadId, messageBody);
        await sendBotMessage(threadId, assistantResponse);
    }
};

const addBotToThread = async (threadId: string) => {
    try {
        const adminChatThreadClient = await adminChatClient.getChatThreadClient(threadId);
        await adminChatThreadClient.addParticipants({
          participants: [
            {
              id: { communicationUserId: ACS_CHAT_BOT_USER_ID },
              displayName: BOT_DISPLAY_NAME
            }
          ]
        });
    } 
    catch (err) {
        throw Error(`Cannot add Chat Bot to thread ID: ${threadId}`);
    }
};

const sendBotMessage = async (threadId: string, message: string) => {
    try {
        const botChatThreadClient = await botChatClient.getChatThreadClient(threadId);
        const sendMessageRequest = {
            content: message
        };
      
        const sendMessageOptions: SendMessageOptions = {
            senderDisplayName: BOT_DISPLAY_NAME
        };

        await botChatThreadClient.sendMessage(sendMessageRequest, sendMessageOptions);
    } 
    catch (err) {
        throw Error(`Cannot send bot message to thread ID: ${threadId}`);
    }
};