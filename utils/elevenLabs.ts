import { signal } from "@preact/signals-react";

const elevenLabsUrl = 'https://api.elevenlabs.io/v1/text-to-speech/'

const elevenLabsKey = signal<string | null>('421fb06f151ebf575036f3b7a4a8fd19');
const elevenLabsVoice = signal<string | null>('vxbIoMIkKH7aduWx4ToQ');

// const elevenLabsKey = '0a0e193b779a3ae7c125091c2eb9856d'
// const elevenLabsVoice = 'vxbIoMIkKH7aduWx4ToQ' // tracer
export const getVoiceOutput = async (output: string) => {
  if (!elevenLabsKey.value) return;
  const responseVoice = await fetch(`${elevenLabsUrl}${elevenLabsVoice.value}`, {
    method: 'POST',
    headers: {
      'accept': 'audio/mpeg',
      'xi-api-key': elevenLabsKey.value as string,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      "text": output,
      "voice_settings": {
        "stability": 0.25,
        "similarity_boost": 0.25
      }
    })
  }).then(res => res.arrayBuffer())
  return responseVoice
}