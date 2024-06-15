"use server";
import { formatDocumentsAsString } from "langchain/util/document";
import { Document } from "langchain/document";

import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnableSequence,
  RunnablePassthrough,
} from "@langchain/core/runnables";

import * as fs from "fs";
import { MongoClient } from "mongodb";
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { OpenAIEmbeddings, ChatOpenAI } from "@langchain/openai";

import { MongoDBAtlasVectorSearch } from "@langchain/mongodb";

import FirecrawlApp from "@mendable/firecrawl-js/build";


let ATLAS_CONNECTION_STRING = process.env.ATLAS_CONNECTION_STRING;
const client = new MongoClient(ATLAS_CONNECTION_STRING);

const app = new FirecrawlApp({ apiKey: process.env.FIRE_CRAWL_KEY });

export async function VectorizeDatabase(link: string, companyname: string, personname: string, email: string) {

  try {


    console.log("connecting to mongo");
    await client.connect();
    console.log(link, "link")
    let data = await app.scrapeUrl(link);

    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 1000,
      chunkOverlap: 1,
    });

    const rawDocs = await splitter.splitDocuments([
      new Document({ pageContent: data?.data?.content }),
    ]);

    const db = client.db("Research");
    const collection = db.collection("Companies");

    const dbConfig = {
      collection: collection,
      indexName: "vector_index", // The name of the Atlas search index to use.
      textKey: "text", // Field name for the raw text content. Defaults to "text".

      embeddingKey: "plot_embedding", // Field name for the vector embeddings. Defaults to "embedding".
    };
    //clear the collection
    // await collection.deleteMany({});
    
    const docs = rawDocs.map((doc) => {
      return {
        ...doc,
        metadata: {
          createdBy: link,
          companyname: companyname,
          personname: personname,
          email: email
        }
      };
    });

    console.log(docs, "docs")

    const vectorStore = await MongoDBAtlasVectorSearch.fromDocuments(

      docs,
      new OpenAIEmbeddings(),
      dbConfig
    );
    console.log("saved successfully")
    await client.close();

    return { res: true };
  } catch (error) {
    console.log(error);
    return { res: false };
  }
}

export async function GetResults(question: string, agent: string, coll_index: string, url: string) {
  console.log("GetResults", question, agent, coll_index, url)

  try {
    await client.connect();

    const db = client.db("Research");
    const collection = db.collection(coll_index);
    collection.createIndex({ "createdBy": "text" });


    const vectorStore = new MongoDBAtlasVectorSearch(new OpenAIEmbeddings(), {
      collection,
      indexName: "vector_index", // The name of the Atlas search index. Defaults to "default"
      textKey: "text", // The name of the collection field containing the raw content. Defaults to "text"
      embeddingKey: "plot_embedding", // The name of the collection field containing the embedded text. Defaults to "embedding"
    });

    // Implement RAG to answer questions on your data filter by {createdBy: url}
    const retriever = vectorStore.asRetriever({ filter: { createdBy: url } });

    // console.log("retriever", retriever)

    const prompt =
      PromptTemplate.fromTemplate(`${agent}, I have strong skills in nextjs, react, tailwind
  {context}

  Task: {question}`);

    const model = new ChatOpenAI({});
    const chain = RunnableSequence.from([
      {
        context: retriever.pipe(formatDocumentsAsString),
        question: new RunnablePassthrough(),
      },
      prompt,
      model,
      new StringOutputParser(),
    ]);

    // Prompt the LLM

    const answer = await chain.invoke(question);
    console.log("Question: " + question);
    console.log("Answer: " + answer);

    // Return source documents
    const retrievedResults = await retriever.getRelevantDocuments(question);
    console.log(retrievedResults, "retrievedResults")
    await client.close();
    return answer;
  } catch (error) {
    console.log(error);
    return { res: false };
  }
}
