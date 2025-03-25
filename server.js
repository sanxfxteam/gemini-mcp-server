// Import required modules
import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { z } from "zod";
import fs from 'fs';
import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

console.log = () => {}

// Initialize Gemini API with your API key from environment variables
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Create MCP server instance
const server = new McpServer({
  name: "ImageGenerationServer",
  version: "1.0.0",
  description: "Server for generating images using Gemini API with Imagen 3"
});

// Add image generation tool without zod schema
server.tool(
  "generateImage",
  {
    prompt: z.string(),
    aspectRatio: z.string().optional(),
    outputFormat: z.string().optional()
  },
  async (params) => {
    // Default values
    const prompt = params.prompt || "Default image prompt";
    const aspectRatio = params.aspectRatio || "1:1";
    const outputFormat = params.outputFormat || "png";

    try {
      // Initialize the Imagen 3 model
      const model = genAI.getGenerativeModel({
        model: "gemini-2.0-flash-exp-image-generation",
        generationConfig: {
            responseModalities: ['Text', 'Image'],
        },
      });

      // Generate the image
      const result = await model.generateContent(prompt);

      // Extract the generated image data (base64 encoded)
      for (const part of result.response.candidates[0].content.parts) {
        // Based on the part type, either show the text or save the image
        if (part.text) {
          console.log(part.text);
          return {
            content: [{
                type: "text",
                text: part.text
            }]
          }
        } else if (part.inlineData) {
          const imageData = part.inlineData.data;
          const buffer = Buffer.from(imageData, 'base64');
          fs.writeFileSync('gemini-native-image.png', buffer);
          console.log('Image saved as gemini-native-image.png');
          return {
            content: [{
              type: "image",
              data: imageData,
              mimeType: `image/${outputFormat}`
            }]
          };
        }
      }
    } catch (error) {
      console.error("Image generation error:", error);
      return {
        content: [{
          type: "text",
          text: `Error generating image: ${error.message}`
        }]
      };
    }
  },
  {
    description: "Generate an image using Gemini API",
    parameters: {
      prompt: { type: "string", description: "The text description of the image to generate" },
      aspectRatio: { type: "string", description: "Aspect ratio of the image (e.g., '1:1', '16:9')", optional: true },
      outputFormat: { type: "string", description: "Output image format ('png' or 'jpeg')", optional: true }
    }
  }
);

// Start the server
async function startServer() {
  try {
    const transport = new StdioServerTransport();
    await server.connect(transport);
    console.log("MCP Image Generation Server is running...");
    console.log("Use the 'generateImage' tool with parameters: prompt, aspectRatio, outputFormat");
  } catch (error) {
    console.error("Server startup error:", error);
  }
}

startServer();