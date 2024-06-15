"use server";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { MongoClient } from "mongodb";
import { Document } from "langchain/document";
import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";
import OpenAI from "openai";

const apiKey = process.env.apiKey;
let token = process.env.token;
let ATLAS_CONNECTION_STRING = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(ATLAS_CONNECTION_STRING);

const openai = new OpenAI({
  apiKey: apiKey,
  baseURL: "https://api.upstage.ai/v1/solar",
});

async function GetSearchQueries(query: string, responseSummary: string) {
  const chatCompletion = await openai.chat.completions.create({
    model: "solar-1-mini-chat",
    messages: [
      {
        role: "system",
        content: `provide some the response in array not using any formatter returned as exactly this: [url: url_generated, url: url_generated, url: url_generated, url: url_generated, url: url_generated]`,
      },
      {
        role: "user",
        content: `You are a github search bot that formulates 5 relevant search url queries on github filtering by search query which must be varied each time, be sure to include the stack in the query such as react or nextjs the query is: ${query} and the relevant project is ${responseSummary}, using the endpoint https://api.github.com/search/repositories?q=`,
      },
    ],
    temperature: 0.1,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });

  console.log(chatCompletion.choices[0]?.message?.content);
  let responseString = chatCompletion.choices[0]?.message?.content;

  const urlsArray = responseString
    .replace(/\[|\]/g, "") // Removing '[' and ']' from the string
    .split(", "); // Splitting the string at each comma and space

  const fetchableUrls = urlsArray.map((url) => url.replace("url: ", ""));
  return fetchableUrls;
}

export async function getRepositoryUrls(
  query: string,
  responseSummary: string
) {
  let urldata = await GetSearchQueries(query, responseSummary);
  console.log(urldata, "urldata");

  try {
    // Fetching data for each URL and storing unique html_urls
    const uniqueUrls = new Set();
    for (const url of urldata) {
      const response = await fetch(url);
      const data = await response.json();

      if (data.items && data.items.length > 0) {
        data.items.forEach((item) => {
          uniqueUrls.add(item.html_url);
        });
      } else {
        console.log(`No repositories found for ${url}.`);
      }
    }

    // Converting Set to Array and returning
    const urlsArray = [...uniqueUrls];
    console.log(urlsArray);
    return urlsArray;
  } catch (error) {
    console.error("Error fetching data from GitHub API:", error);
    return [];
  }
}
export async function fetchReadme(repoData: string[]) {
  console.log(repoData, "initial repodata");

  try {
    await client.connect();
    const db = client.db("Research");
    const collection = db.collection("Readme");
    const dbConfig = {
      collection: collection,
      indexName: "default", // The name of the Atlas search index to use.
      textKey: "text", // Field name for the raw text content. Defaults to "text".
      embeddingKey: "plot_embedding", // Field name for the vector embeddings. Defaults to "embedding".
    };

    console.log("successfully connected");

    // Helper function to fetch README for a single repository
    const fetchSingleReadme = async (repoUrl: string) => {
      try {
        const repoPath = repoUrl.replace("https://github.com/", "");
        const endpoint = `https://api.github.com/repos/${repoPath}/readme`;
        console.log("ozo endpoint", endpoint);

        const response = await fetch(endpoint, {
          headers: {
            Accept: "application/vnd.github.v3.raw",
            Authorization: `token ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(
            `Failed to fetch README file for ${repoUrl}: ${response.statusText}`
          );
        }

        const content = await response.text();
        return `### ${repoUrl} ###\n\n${content}\n\n### End of ${repoUrl} ###`;
      } catch (error) {
        console.error(error.message);
        return null; // Return null in case of an error
      }
    };

    // Fetch README files concurrently
    const readmePromises = repoData.map((repoUrl) =>
      fetchSingleReadme(repoUrl)
    );
    const readmeContents = await Promise.all(readmePromises);

    // Filter out any null values (errors)
    const validReadmeContents = readmeContents.filter(
      (content) => content !== null
    );

    // Combine all README contents into a single string
    const combinedReadmeContent = validReadmeContents.join("\n\n");

    console.log(typeof combinedReadmeContent, combinedReadmeContent.length);

    await collection.deleteMany({});

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 1,
    });

    const docs = await splitter.splitDocuments([
      new Document({ pageContent: combinedReadmeContent }),
    ]);

    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(
      docs,
      new OpenAIEmbeddings(),
      dbConfig
    );

    console.log(repoData, "repoData");
    return combinedReadmeContent;
  } catch (error) {
    console.error("Error fetching README files:", error);
  } finally {
    await client.close();
  }
}
