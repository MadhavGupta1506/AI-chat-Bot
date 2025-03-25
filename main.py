from fastapi import FastAPI, HTTPException, Request
from pydantic import BaseModel
import os
from dotenv import load_dotenv
from groq import Groq
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates

load_dotenv()

app = FastAPI()

# CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],  
    allow_headers=["*"],  
)

# Serve Static & Templates
app.mount("/static", StaticFiles(directory="app/static"), name="static")
templates = Jinja2Templates(directory="app/templates")

client = Groq(api_key=os.environ.get("GROQ_API_KEY"))

class ChatRequest(BaseModel):
    message: str

@app.get("/")
async def home(request: Request):
    return templates.TemplateResponse("index.html", {"request": request})

@app.post("/chat")
async def chat(request: ChatRequest):
    try:
        chat_completion = client.chat.completions.create(
            messages=[
                {"role": "system", "content": '''You are an AI expert in Indian culture, traditions, history, and languages. You possess deep knowledge about India's festivals, mythology, historical events, art, music, dance, cuisine, spirituality, philosophy, and regional diversity.

Whenever a user asks a question, provide a detailed yet engaging response while respecting the cultural and historical accuracy. Adapt your tone based on the context—being formal for historical and spiritual topics, conversational for general queries, and storytelling for mythology.

If asked about Indian languages, provide responses in multiple Indian languages alongside English. Always ensure translations are accurate, grammatically correct, and culturally appropriate.

If discussing modern India, include references to current trends, Bollywood, technological advancements, and evolving traditions while maintaining the richness of India's heritage.'''},
                {"role": "user", "content": request.message},
            ],
            model="gemma2-9b-it",
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
