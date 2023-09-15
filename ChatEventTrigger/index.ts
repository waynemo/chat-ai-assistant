import { AzureFunction, Context } from '@azure/functions';
import { handleChatThreadCreated, handleChatThreadParticipantAdded, handleChatMessageReceivedInThread } from './chatEventHandler';

const eventGridTrigger: AzureFunction = async function (context: Context, eventGridEvent: any): Promise<void> {

    const eventType = eventGridEvent.eventType;
    const eventData = eventGridEvent.data;

    switch(eventType) { 
        case 'Microsoft.Communication.ChatThreadCreated': { 
            handleChatThreadCreated(eventData.threadId);
            break; 
        }
        case 'Microsoft.Communication.ChatThreadParticipantAdded': { 
            handleChatThreadParticipantAdded(eventData.threadId, eventData.participantAdded?.participantCommunicationIdentifier?.rawId);
            break; 
        }
        case 'Microsoft.Communication.ChatMessageReceivedInThread': { 
            handleChatMessageReceivedInThread(eventData.threadId, eventData.senderCommunicationIdentifier?.rawId, eventData.messageBody);
            break; 
        }
        default: { 
            break; 
        }
    }
};

export default eventGridTrigger;