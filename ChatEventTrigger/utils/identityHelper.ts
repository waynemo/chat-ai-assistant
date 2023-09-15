import {
  CommunicationAccessToken,
  CommunicationIdentityClient,
  TokenScope
} from '@azure/communication-identity';
import { AzureCommunicationTokenCredential, CommunicationUserIdentifier } from '@azure/communication-common';
import { AzureKeyCredential } from "@azure/core-auth";
import { ACS_CHAT_ADMIN_USER_ID, ACS_CHAT_BOT_USER_ID, ACS_ENDPOINT_URL, ACS_ACCESS_KEY } from './envConfig';

const adminUserIdentifier: CommunicationUserIdentifier = {
  communicationUserId: ACS_CHAT_ADMIN_USER_ID
};

const botUserIdentifier: CommunicationUserIdentifier = {
  communicationUserId: ACS_CHAT_BOT_USER_ID
};

const keyCredential = new AzureKeyCredential(ACS_ACCESS_KEY);

const communicationIdentityClient: CommunicationIdentityClient = new CommunicationIdentityClient(ACS_ENDPOINT_URL, keyCredential);


const createCredential = (communicationUserIdentifier: CommunicationUserIdentifier) => {
  return new AzureCommunicationTokenCredential({
    tokenRefresher: async () => (await getToken(communicationUserIdentifier, ['chat', 'voip'])).token,
    refreshProactively: true
  });
};

const getToken = (user: CommunicationUserIdentifier, scopes: TokenScope[]): Promise<CommunicationAccessToken> => communicationIdentityClient.getToken(user, scopes);


export const chatAdminCredential = createCredential(adminUserIdentifier);
export const chatBotCredential = createCredential(botUserIdentifier);