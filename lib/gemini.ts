import { GoogleGenerativeAI } from "@google/generative-ai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error("GEMINI_API_KEY is not set");
}

export const genAI = new GoogleGenerativeAI(apiKey);

// Create Gemini 2.5 Flash model for chat (1500 requests/day free)
export const geminiFlashModel = genAI.getGenerativeModel({ 
  model: "gemini-2.5-flash"
});

// Helper function to convert messages to Gemini format
export interface Message {
  role: "user" | "assistant" | "system";
  content: string;
}

export function convertMessagesToGeminiFormat(messages: Message[]) {
  // Extract system message if it exists
  const systemMessage = messages.find(msg => msg.role === "system");
  const conversationMessages = messages.filter(msg => msg.role !== "system");

  // Convert to Gemini format
  const geminiMessages = conversationMessages.map(msg => ({
    role: msg.role === "assistant" ? "model" : "user",
    parts: [{ text: msg.content }]
  }));

  return {
    systemInstruction: systemMessage?.content,
    messages: geminiMessages
  };
}

// Helper function for streaming chat
export async function streamGeminiChat(
  messages: Message[],
  onChunk: (text: string) => void
) {
  const { systemInstruction, messages: geminiMessages } = convertMessagesToGeminiFormat(messages);

  const chatConfig: any = {
    history: geminiMessages.slice(0, -1)
  };

  if (systemInstruction) {
    chatConfig.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const chat = geminiFlashModel.startChat(chatConfig);

  const lastMessage = geminiMessages[geminiMessages.length - 1];
  const result = await chat.sendMessageStream(lastMessage.parts[0].text);

  for await (const chunk of result.stream) {
    const text = chunk.text();
    onChunk(text);
  }
}

// Helper function for JSON response (for emotion analysis)
export async function getGeminiJsonResponse(
  prompt: string,
  systemInstruction?: string
) {
  const model = genAI.getGenerativeModel({ 
    model: "gemini-2.5-flash",
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const contentRequest: any = {
    contents: [{ role: "user", parts: [{ text: prompt }] }]
  };

  if (systemInstruction) {
    contentRequest.systemInstruction = {
      parts: [{ text: systemInstruction }]
    };
  }

  const result = await model.generateContent(contentRequest);

  const response = result.response;
  const text = response.text();
  
  return JSON.parse(text);
}
