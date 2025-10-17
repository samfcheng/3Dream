import { GoogleGenAI } from '@google/genai';
import { GEMINI_API_KEY } from '$env/static/private';

export async function POST({ request }) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image');

    if (!imageFile) {
      return new Response(JSON.stringify({ error: 'No image provided' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' }
      });
    }

    // Convert uploaded file to base64
    const arrayBuffer = await imageFile.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const base64Image = buffer.toString('base64');

    // Initialize Google GenAI
    const ai = new GoogleGenAI({
      apiKey: GEMINI_API_KEY
    });

    const config = {
      responseModalities: ['IMAGE', 'TEXT']
    };

    const model = 'gemini-2.5-flash-image';

    const contents = [
      {
        role: 'user',
        parts: [
          {
            inlineData: {
              mimeType: imageFile.type,
              data: base64Image
            }
          },
          {
            text: 'Turn sketch into floating 3d rendering of a action figure, white background, no base'
          }
        ]
      }
    ];

    const response = await ai.models.generateContentStream({
      model,
      config,
      contents
    });

    // Collect the generated image
    for await (const chunk of response) {
      if (!chunk.candidates || !chunk.candidates[0].content || !chunk.candidates[0].content.parts) {
        continue;
      }

      if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
        const inlineData = chunk.candidates[0].content.parts[0].inlineData;
        const imageBuffer = Buffer.from(inlineData.data || '', 'base64');

        return new Response(imageBuffer, {
          status: 200,
          headers: {
            'Content-Type': inlineData.mimeType || 'image/png',
            'Content-Length': imageBuffer.length.toString()
          }
        });
      }
    }

    return new Response(JSON.stringify({ error: 'No image generated' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });

  } catch (error) {
    console.error('Error generating image:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}