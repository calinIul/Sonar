import { AzureOpenAiEmbeddingClient } from '@sap-ai-sdk/foundation-models';
import constants from '../utils/constants.js';

const { EMBEDDING_MODEL } = constants;

export default class AIClient {
  async getEmbeddings(fingerprint) {
    const embeddingClient = new AzureOpenAiEmbeddingClient({
      modelName: EMBEDDING_MODEL.MODEL_NAME
    });

    const response = await embeddingClient.run({
      input: fingerprint
    });

    return response.getEmbeddings();
  }
}
