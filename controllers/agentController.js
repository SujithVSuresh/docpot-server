import dotenv from "dotenv";
dotenv.config();
import { getAgentExecutor } from "../agentStore/agentExecutorStore.js";


const searchAgent = async (req, res) => {
    try {
        const agentExecutor = getAgentExecutor()

        if (!agentExecutor) {
            return res.status(503).json({ error: 'Agent not initialized yet. Please try again shortly.' });
        }

        const { question } = req.body; 
        if (!question) {
            return res.status(400).json({ error: 'Question is required.' });
        }

        console.log(`Received question: "${question}"`);
        const result = await agentExecutor.invoke({ input: question });
        // console.log(`Agent's Answer: "${result.output}"`);

        console.log(result)

        res.json({ answer: result.output }); 

    } catch (error) {
        console.error("Error during agent execution:", error);
        res.status(500).json({ error: 'Failed to get an answer from the AI agent.', details: error.message });
    }
};

export default {
  searchAgent,
};
