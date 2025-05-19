
import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';
dotenv.config();

const pinecone = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY,
//   controllerHostUrl: `https://controller.${process.env.PINECONE_ENVIRONMENT}.pinecone.io`,
});

export default pinecone;
