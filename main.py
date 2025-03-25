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
                {"role": "system", "content": "You are a multilingual chatbot specializing in Indian languages..."},
                {"role": "user", "content": request.message},
            ],
            model="gemma2-9b-it",
        )
        return {"response": chat_completion.choices[0].message.content}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
