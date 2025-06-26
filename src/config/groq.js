import Groq from "groq-sdk";

const API_KEY = "YOUR_API_KEY"; // Replace with your own API key 
const MODEL_NAME = "llama3-70b-8192"; // or change to any other supported model

const groq = new Groq({ apiKey: API_KEY, dangerouslyAllowBrowser: true }); // ⚠️ Only use this in a secure frontend

async function runChat(prompt) {
  const result = await groq.chat.completions.create({
    model: MODEL_NAME,
    messages: [
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.9,
    top_p: 1,
    max_tokens: 2048,
  });

  const responseText = result.choices[0]?.message?.content || "";
  console.log("Prompt:", prompt);
  console.log("AI Response:", responseText);
  return responseText;
}
export default runChat;