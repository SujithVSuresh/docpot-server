import dotenv from "dotenv";
dotenv.config();
import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const tavily = new TavilySearchResults({
  apiKey: process.env.TAVILY_API_KEY,
});

export default tavily