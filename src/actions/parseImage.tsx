'use server';

import { GoogleGenerativeAI } from '@google/generative-ai';

const ApiKey = process.env.GEMINI_API_KEY!;

const genAI = new GoogleGenerativeAI(ApiKey);

async function fileToGenerativePart(image: File, mimeType: string) {
  return {
    inlineData: {
      data: Buffer.from(await image.arrayBuffer()).toString('base64'),
      mimeType,
    },
  };
}

async function run(image: File) {
  const model = genAI.getGenerativeModel({ model: 'gemini-pro-vision' });

  const prompt = 'what did I buy? Give the answer in JSON.';

  const imageParts = [await fileToGenerativePart(image, 'image/jpeg')];

  const result = await model.generateContent([prompt, ...imageParts]);
  const response = await result.response;
  const text = response.text();
  return {
    message: JSON.parse(text.replaceAll('```', '').replace('json', '')),
  };
}

export async function parseImage(initialState: any, formData: FormData) {
  const slip = formData.get('slip') as File;
  const data = await run(slip);

  return data;
}
