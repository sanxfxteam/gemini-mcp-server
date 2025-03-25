import { GoogleGenerativeAI } from "@google/generative-ai";
import fs from "fs";
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function generateImage() {
  const contents = "Hi, can you create a 3d rendered image of a pig " +
                  "with wings and a top hat flying over a happy " +
                  "futuristic scifi city with lots of greenery?";

  // Set responseModalities to include "Image" so the model can generate  an image
  const model = genAI.getGenerativeModel({
    model: "gemini-2.0-flash-exp-image-generation",
    generationConfig: {
        responseModalities: ['Text', 'Image']
    },
  });

  try {
    const response = await model.generateContent(contents);
    for (const part of  response.response.candidates[0].content.parts) {
      // Based on the part type, either show the text or save the image
      if (part.text) {
        console.log(part.text);
      } else if (part.inlineData) {
        const imageData = part.inlineData.data;
        const buffer = Buffer.from(imageData, 'base64');
        fs.writeFileSync('gemini-native-image.png', buffer);
        console.log('Image saved as gemini-native-image.png');
      }
    }
  } catch (error) {
    console.error("Error generating content:", error);
  }
}

generateImage();