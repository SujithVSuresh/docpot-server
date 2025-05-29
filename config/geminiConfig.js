import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

import "dotenv/config"; 


const llm = new ChatGoogleGenerativeAI({
  model: "gemini-1.5-flash", 
  temperature: 0.2,         
});

export default llm