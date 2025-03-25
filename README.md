# Gemini MCP Image Generation Server

This is a Model Context Protocol (MCP) server that provides image generation capabilities using Google's Gemini 2 API.

<a href="https://glama.ai/mcp/servers/@sanxfxteam/gemini-mcp-server">
  <img width="380" height="200" src="https://glama.ai/mcp/servers/@sanxfxteam/gemini-mcp-server/badge" alt="Gemini Image Generation Server MCP server" />
</a>

## Setup

1. Install dependencies:
```bash
npm install
```

2. Set up your environment variables:
Create a `.env` file in the root directory and add your Google API key:
```
GEMINI_API_KEY=your_api_key_here
```

## Usage

Run the server:
```bash
npm start
```

To test
```bash
npx @modelcontextprotocol/inspector npm run start
```

### Available Tools

#### generateImage

Generates images using Gemini 2's experimental image generation API.

Parameters:
- `prompt` (string, required): The description of the image you want to generate
- `numSamples` (number, optional, default: 4): Number of images to generate
- `aspectRatio` (string, optional, default: '1:1'): Aspect ratio of the generated images
- `personGeneration` (string, optional, default: 'ALLOW_ADULT'): Person generation settings

Example MCP request:
```json
{
  "tool": "generateImage",
  "params": {
    "prompt": "A serene mountain landscape at sunset",
    "numSamples": 2,
    "aspectRatio": "16:9"
  }
}
```

## Notes

- This server uses the experimental image generation feature of Gemini 2
- Make sure you have appropriate access and API keys from Google
- The server communicates using the Model Context Protocol over stdio