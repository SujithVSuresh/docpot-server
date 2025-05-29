import { TavilySearchResults } from "@langchain/community/tools/tavily_search";

const tavily = new TavilySearchResults({
  apiKey: "your-tavily-api-key",
});

export default tavily