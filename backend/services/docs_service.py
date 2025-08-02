import openai
import os
from typing import List, Dict
import json

openai.api_key = os.getenv("OPENAI_API_KEY")

class DocsService:
    @staticmethod
    def search_documents(query: str) -> List[Dict]:
        # Simple text search - in production use vector search
        docs = [
            {"id": 1, "title": "Getting Started", "content": "Welcome to CyberSentinel...", "category": "basics"},
            {"id": 2, "title": "Phishing Detection", "content": "Learn to identify phishing...", "category": "training"},
            {"id": 3, "title": "API Reference", "content": "API endpoints and usage...", "category": "api"}
        ]
        
        results = []
        for doc in docs:
            if query.lower() in doc["title"].lower() or query.lower() in doc["content"].lower():
                results.append(doc)
        
        return results
    
    @staticmethod
    def get_document(slug: str) -> Dict:
        # Mock document retrieval
        return {
            "title": "Getting Started",
            "content": "# Getting Started\n\nWelcome to CyberSentinel AI...",
            "category": "basics",
            "updated_at": "2024-01-01"
        }
    
    @staticmethod
    async def chat_with_docs(query: str, context_docs: List[str] = None) -> str:
        try:
            context = "\n".join(context_docs) if context_docs else ""
            
            response = await openai.ChatCompletion.acreate(
                model="gpt-3.5-turbo",
                messages=[
                    {"role": "system", "content": f"You are a helpful assistant for CyberSentinel AI. Use this context: {context}"},
                    {"role": "user", "content": query}
                ],
                max_tokens=500
            )
            
            return response.choices[0].message.content
        except:
            return "I'm sorry, I couldn't process your request. Please try again or contact support."
    
    @staticmethod
    def get_related_docs(topic: str) -> List[Dict]:
        # Return related documents based on topic
        return [
            {"title": "Related Guide 1", "slug": "guide-1"},
            {"title": "Related Guide 2", "slug": "guide-2"}
        ]