import { Container, CosmosClient } from "@azure/cosmos";
import { COSMOSDB_ACCESS_KEY, COSMOSDB_ENDPOINT_URL } from './utils/envConfig';

const cosmosClient = new CosmosClient({ endpoint: COSMOSDB_ENDPOINT_URL, key: COSMOSDB_ACCESS_KEY });
const databaseName = `chatHistoryContext`;
const containerName = `chatHistoryContextMessages`;
const partitionKeyPath = ["/threadId"]
const getChatHistoryContextMessagesContainer = async (): Promise<Container> => {
    const { database } = await cosmosClient.databases.createIfNotExists({ id: databaseName });
    const { container } = await database.containers.createIfNotExists({
        id: containerName,
        partitionKey: {
            paths: partitionKeyPath
        }
    });
    return container;
};

export type ChatContextMessage = {
    threadId: string;
    role: string;
    content: string;
};

export const getContextMessages = async (threadId: string): Promise<ChatContextMessage[]> => {
    const querySpec = {
        query: "select * from messages m where m.threadId=@threadId",
        parameters: [
            {
                name: "@threadId",
                value: threadId
            }
        ]
    };

    const container = await getChatHistoryContextMessagesContainer();
    const { resources } = await container.items.query(querySpec).fetchAll()

    return resources;
};

export const createChatContextMessage = async (message: ChatContextMessage) => {
    const container = await getChatHistoryContextMessagesContainer();
    await container.items.create(message);
};