import { GoogleGenerativeAI, FunctionDeclarationSchemaType } from '@google/generative-ai';
import dotenv from 'dotenv';
dotenv.config();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);


const funcoes = {
  taxaJurosParcelamento: ({ value }) => {
    const meses = typeof value === "string" ? parseInt(value) : value;
    if (meses <= 6) {
      return 3;
    } else if (meses <= 12) {
      return 5;
    } else if (meses <= 24) {
      return 7;
    }
  }
};


const tools = [
  {
    functionDeclarations: [
      {
        name: "taxaJurosParcelamento",
        description: "",
        parameters: {
          type: FunctionDeclarationSchemaType.OBJECT,
          properties: {
            value: { type: FunctionDeclarationSchemaType.NUMBER },
          },
          required: ["value"],
        }
      }
    ]
  }
];




const model = genAI.getGenerativeModel(
  { model: "gemini-1.5-flash", tools},
  { apiVersion: "v1beta"});


let chat;


function inicializaChat() {
  chat = model.startChat({
    history: [
      {
        role: "user",
        parts: [{ text: 'Você é o LGPDesk, um chatbot amigável que tira dúvidas sobre as normas LGPD' }],
      },
      {
        role: "model",
        parts: [{ text: 'Olá!' }],
      },
    ],
    generationConfig: {
      maxOutputTokens: 1000,
    },
  });
}


export { chat, funcoes, inicializaChat}