import { AzureKeyCredential } from "@azure/core-auth";
import { ChatCompletions, ChatMessage, OpenAIClient } from '@azure/openai';
import { OPENAI_ENDPOINT_URL, OPENAI_ACCESS_KEY } from './utils/envConfig';
import { getContextMessages, createChatContextMessage, ChatContextMessage } from './chatContextService';

const openaiClient = new OpenAIClient(OPENAI_ENDPOINT_URL, new AzureKeyCredential(OPENAI_ACCESS_KEY));
const deploymentId = "chatgpt-deployment";

export const initAssistant = async (threadId: string) => {
    const message = {
        threadId,
        role: 'system',
        content: 'You are a helpful assistant.'
    };
    await createChatContextMessage(message);
};

export const processUserMessage = async (threadId: string, content: string): Promise<string> => {
    const userMessage = {
        threadId,
        role: 'user',
        content
    };

    await createChatContextMessage(userMessage);

    const chatContextMessages = await getContextMessages(threadId);
    const completionContextMessages = getCompletionContextMessages(chatContextMessages);

    let assistantResponse;

    try {
        const chatCompletions: ChatCompletions = await openaiClient.getChatCompletions(deploymentId, completionContextMessages);

        if (chatCompletions.choices) {
            assistantResponse = chatCompletions.choices[0].message?.content;
        }
    } 
    catch (err) {
        throw Error(`Cannot get chat completion for context: ${JSON.stringify(completionContextMessages)}`);
    }

    if (!assistantResponse) {
        assistantResponse = 'I do not know how to respond.';
    }

    const assistantMessage = {
        threadId,
        role: 'assistant',
        content: assistantResponse
    };

    await createChatContextMessage(assistantMessage);

    return assistantResponse;
};

const getCompletionContextMessages = (chatContextMessages: ChatContextMessage[]): ChatMessage[] => {

    const completionContextMessages: ChatMessage[] = [];

    for (const chatContextMessage of chatContextMessages) {
        const completionContextMessage: ChatMessage = {
            role: chatContextMessage.role,
            content: chatContextMessage.content
        };

        completionContextMessages.push(completionContextMessage);
    }

    return completionContextMessages;
};