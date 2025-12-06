import os
from dotenv import load_dotenv
from langchain_community.document_loaders import PyPDFLoader
from langchain.text_splitter import RecursiveCharacterTextSplitter
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_community.vectorstores import FAISS
from langchain_groq import ChatGroq

# Load environment variables
load_dotenv()

class BidWizEngine:
    """
    Groq LPU Engine:
    - Hardware: Groq LPU
    - Model: Llama 3.3 70B Versatile
    """
    
    def __init__(self):
        # 1. Embeddings (Local & Free)
        # Using HuggingFaceEmbeddings to avoid deprecation warnings
        self.embeddings = HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")
        self.vector_store = None
        
        # 2. The Model (Llama 3.3 on Groq)
        api_key = os.getenv("GROQ_API_KEY")
        if not api_key:
            print("CRITICAL WARNING: GROQ_API_KEY not found in env!")
        
        self.llm = ChatGroq(
            temperature=0.1, 
            model_name="llama-3.3-70b-versatile",  # <--- Updated as requested
            api_key=api_key
        )

    def ingest_knowledge_base(self, file_path):
        """Ingests the PDF into the Vector Store."""
        try:
            loader = PyPDFLoader(file_path)
            documents = loader.load()
            
            text_splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=100)
            texts = text_splitter.split_documents(documents)
            
            self.vector_store = FAISS.from_documents(texts, self.embeddings)
            return True, f"Successfully indexed {len(texts)} chunks."
        except Exception as e:
            print(f"Ingestion Error: {e}")
            return False, f"Ingestion Failed: {str(e)}"

    def analyze_requirement(self, requirement_text, tone="Professional"):
        """RAG Generation"""
        if not self.vector_store:
            return "Error: Knowledge Base not loaded. Please upload and train a PDF first."

        try:
            # Create retriever
            retriever = self.vector_store.as_retriever(search_kwargs={"k": 4})
            
            # Use invoke() (Modern LangChain syntax)
            docs = retriever.invoke(requirement_text)
            context_text = "\n\n".join([d.page_content for d in docs])

            prompt_template = f"""
            You are a Senior Proposal Manager. Adopt a {tone} tone.
            Rules:
            1. Base answer ONLY on context.
            2. If context is missing answer, say "Requires SME Input".
            
            Context: {context_text}
            Requirement: {requirement_text}
            
            Draft Response:
            """
            
            # Use invoke() for the LLM call as well
            response = self.llm.invoke(prompt_template).content
            return response
            
        except Exception as e:
            # This prints the REAL error to your terminal
            print(f"Generation Error: {e}")
            return f"Error during generation: {str(e)}"
    
    def negotiate_turn(self, history, role, policy_context):
        """Negotiation Logic"""
        if role == "Seller":
            system_prompt = f"""
            You are a Senior Sales Executive. Goal: Maximize value.
            Policy: {policy_context}
            History: {history}
            Respond to the Buyer (max 50 words).
            """
        else:
            system_prompt = f"""
            You are a Tough Procurement Officer. Goal: Lowest price.
            History: {history}
            Respond to the Seller (max 50 words).
            """
            
        response = self.llm.invoke(system_prompt).content
        return response

# Singleton instance
engine = BidWizEngine()