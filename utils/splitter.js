import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";

// It splits document data into chunks
const splitter = async (pdfData) => {
        const splitter = new RecursiveCharacterTextSplitter({
          chunkSize: 300,
          chunkOverlap: 20,
        });
    
        const chunks = await splitter.createDocuments([pdfData.text]);

        return chunks
}

export default splitter