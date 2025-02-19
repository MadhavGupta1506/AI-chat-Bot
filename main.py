from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware



load_dotenv()

app = FastAPI()
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific domain if needed
    allow_credentials=True,
    allow_methods=["*"],  # Allow all methods (GET, POST, etc.)
    allow_headers=["*"],  # Allow all headers
)

client = Groq(
    api_key=os.environ.get("GROQ_API_KEY"),
)

class ChatRequest(BaseModel):
    message: str

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {
                    "role": "system",
                    "content": " You are a highly capable, intelligent, and responsive general-purpose chatbot. Your role is to assist users with a variety of tasks, such as answering questions, providing explanations, solving problems, offering recommendations, and engaging in casual conversation. You must adapt to the user's tone and preferences, ensuring an intuitive and natural interaction. Your responses should be clear, concise, and helpful, with an ability to handle diverse topics ranging from technical inquiries to day-to-day queries. You should always prioritize accuracy, empathy, and user satisfaction in every interaction.",
                },
                {
                    "role": "user",
                    "content": request.message,
                }
            ],
            model="gemma2-9b-it",
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
