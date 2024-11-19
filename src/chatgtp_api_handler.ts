import OpenAI from "openai";
import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";
import "dotenv/config";

// Passwordless credential
const credential = new DefaultAzureCredential();

// Get Key Vault name from environment variables
// such as `https://${keyVaultName}.vault.azure.net`
const keyVaultUrl = process.env.KEY_VAULT_URL;
if (!keyVaultUrl) throw new Error("KEY_VAULT_URL is empty");

const client = new SecretClient(keyVaultUrl, credential);

export async function getRecommendationsFromApi(title: string, year: string) {
  const getSecretResult = await client.getSecret("cgpt-apikey");

  const apikey = getSecretResult.value;

  const openai = new OpenAI({
    apiKey: apikey,
  });

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "user",
        content: `Give me movie recommendations in a serializable json format (just title and year) that are similar to the movie ${title} from the year ${year}`,
      },
    ],
  });

  return completion.choices[0].message.content;
}
