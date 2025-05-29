import dotenv from "dotenv";
dotenv.config();
import pdf from "pdf-parse";
import { pipeline } from "@xenova/transformers";
import pinecone from "../config/pineconeClient.js";
import groq from "../config/groqClient.js";

import splitter from "../utils/splitter.js";

const docProcessor = async (req, res) => {
  try {
    if (!req.file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    //parsing the pdf content
    const pdfData = await pdf(req.file.buffer);

    console.log([pdfData.text][0].split('\n'), "pdf dataa")

    //splitting pdf into chunks
    const chunks = await splitter(pdfData)

    // Generate embeddings for each chunk
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );

    const embeddings = await Promise.all(
      chunks.map(async (chunk) => {
        const embedding = await embedder(chunk.pageContent, {
          pooling: "mean",
          normalize: true,
        });
        return Array.from(embedding.data);
      })
    );

    // inserting vectors to pinecone
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const vectorsToUpsert = embeddings.map((embedding, idx) => ({
      id: `chunk-${idx}`,
      values: embedding,
      metadata: {
        chunkText: chunks[idx].pageContent,
      },
    }));

    await index.upsert(vectorsToUpsert);

    res.json({
      text: pdfData.text,
      info: pdfData.info,
      numPages: pdfData.numpages,
      embeddings: embeddings,
      message: "embedding upserted successfully.",
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ error: error.message });
  }
};

const searchChunks = async (req, res) => {
  try {
    const { prompt } = req.query;

    if (!prompt) {
      return res.status(400).json({ error: "Query is required" });
    }

    // embedding the prompt
    const embedder = await pipeline(
      "feature-extraction",
      "Xenova/all-MiniLM-L6-v2"
    );
    const queryEmbedding = await embedder(prompt, {
      pooling: "mean",
      normalize: true,
    });

    const vector = Array.from(queryEmbedding.data);

    //quering the db
    const index = pinecone.Index(process.env.PINECONE_INDEX_NAME);

    const queryResponse = await index.query({
      vector,
      topK: 5,
      includeMetadata: true,
    });

    //structuring the response with metadata
    const results = queryResponse.matches.map((match) => ({
      score: match.score,
      chunkText: match.metadata.chunkText,
    }));

    let context = "";

    results.forEach((item) => {
      context = item.chunkText;
    });

    // asking the llm with the user question and context data
    let llmPrompt = `
        You are an expert assistant. Use the following context to answer the question as accurately as possible.
           Context:
             ${context}
          
          Question:
             ${prompt}
    `;

    // structuring the response with llm api
    const chatCompletion = await groq.chat.completions.create({
      messages: [{ role: "user", content: llmPrompt }],
      model: "llama3-8b-8192",
    });

    res.json({ result: chatCompletion["choices"][0].message });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
};

export default {
  docProcessor,
  searchChunks,
};
