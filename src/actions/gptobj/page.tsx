"use server";

import OpenAI from "openai";

export async function TextToObj(data: string) {
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const response = await openai.chat.completions.create({
    model: "gpt-4o",
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `Convert this into a JSON format using named projects with name, description, link`,
      },
      {
        role: "user",
        content: `${data}`,
      },
    ],
    temperature: 0.8,
    max_tokens: 1024,
    top_p: 1,
    frequency_penalty: 0,
    presence_penalty: 0,
  });
  const messageContent = response.choices[0].message.content;
  console.log(messageContent);

  return messageContent;
}
