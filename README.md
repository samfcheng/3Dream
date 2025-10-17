# 3Dream — Dream it. Draw it. Hold it.

Millions of kids create drawings every day, but most of that creativity is lost. Parents have no meaningful way to preserve or celebrate their child’s imagination. 3Dream solves this by transforming any sketch into a tangible toy through a simple online platform. With one click, families can upload a drawing, view the AI-generated 3D model, and order a custom-made, kid-safe toy delivered right to their door.

Made by Sam Cheng, Isaac Chan, Arnav Bansal.

## Development

So, how does it work?
1: 3Dream takes a file upload of a sketch from the user
2: The app uses the Gemini API to generate a photo rendering from the sketch
3: After approval and edits from the user, we use the [Tripo AI API](https://www.tripo3d.ai/) to generate a 3D model

**Underlying Technology:** Svelte Kit, Node.js, SASS, Gemini, Tripo AI, Vercel
