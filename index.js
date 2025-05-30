import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';

import docRouter from './routes/docRouter.js';
import agentRouter from './routes/agentRouter.js';

import { Calculator } from "@langchain/community/tools/calculator";
import tavily from "./config/tavilyConfig.js"; 
import llm from './config/groqLlmConfig.js';
import { pull } from "langchain/hub";
import { AgentExecutor, createReactAgent } from "langchain/agents";
import { setAgentExecutor } from './agentStore/agentExecutorStore.js';

async function initializeAgent() {
    const calculator = new Calculator();
    const tools = [calculator, tavily];
    const prompt = await pull("hwchase17/react");

    const agent = await createReactAgent({
        llm,
        tools,
        prompt
    });

    const agentExecutor = new AgentExecutor({
        agent,
        tools,
        verbose: true,
        handleParsingErrors: true,
        maxIterations: 30
    });

    setAgentExecutor(agentExecutor)

    console.log("AI Agent initialized successfully!");
}

async function startServer() {
    try {
        await initializeAgent(); 

        const app = express();

        app.use(cors());
        app.use(express.json());
        app.use(express.urlencoded());

        app.use('/doc', docRouter);
        app.use('/agent', agentRouter);

        app.use('/', (req, res) => {
            res.send("Hello");
        });

        app.listen(process.env.PORT, () => {
            console.log(`Server running on http://localhost:${process.env.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error);
        process.exit(1); 
    }
}

startServer();
