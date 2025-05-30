import { ChatGroq } from "@langchain/groq";

import dotenv from 'dotenv';
dotenv.config();

const llm = new ChatGroq({
  apiKey: process.env.GROQ_API_KEY,
  model: "llama3-8b-8192", 
});

export default llm
