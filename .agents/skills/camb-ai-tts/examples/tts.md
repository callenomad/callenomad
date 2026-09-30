# Text-to-Speech Examples

## Python SDK - Streaming TTS

```python
import os
from camb.client import CambAI, save_stream_to_file
from camb.types import StreamTtsOutputConfiguration

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))

# Basic streaming TTS
stream = client.text_to_speech.tts(
    text="Hello! Welcome to CAMB AI text-to-speech.",
    language="en-us",
    voice_id=147320,
    speech_model="mars-flash",
    output_configuration=StreamTtsOutputConfiguration(format="wav"),
)
save_stream_to_file(stream, "output.wav")
```

## Python SDK - Async Client

```python
import asyncio
import os
from camb.client import AsyncCambAI, save_async_stream_to_file
from camb.types import StreamTtsOutputConfiguration

async def main():
    client = AsyncCambAI(api_key=os.getenv("CAMB_API_KEY"))

    stream = client.text_to_speech.tts(
        text="Hello from the async client!",
        language="en-us",
        voice_id=147320,
        speech_model="mars-pro",
        output_configuration=StreamTtsOutputConfiguration(format="wav"),
    )
    await save_async_stream_to_file(stream, "output.wav")

asyncio.run(main())
```

## Python SDK - Manual Stream Handling

```python
with open("output.wav", "wb") as f:
    for chunk in client.text_to_speech.tts(
        text="Hello! Welcome to Camb.ai text-to-speech.",
        language="en-us",
        voice_id=147320,
        speech_model="mars-flash",
        output_configuration=StreamTtsOutputConfiguration(format="wav"),
    ):
        f.write(chunk)
```

## TypeScript SDK - Streaming TTS

```typescript
import { CambClient, saveStreamToFile } from '@camb-ai/sdk';

const client = new CambClient({
    apiKey: process.env.CAMB_API_KEY
});

async function main() {
    const response = await client.textToSpeech.tts({
        text: "Hello! Welcome to Camb.ai text-to-speech.",
        language: "en-us",
        voice_id: 147320,
        speech_model: "mars-flash",
        output_configuration: { format: "wav" }
    });

    await saveStreamToFile(response, "output.wav");
}

main();
```

## TypeScript SDK - Manual Stream Handling

```typescript
import { CambClient } from '@camb-ai/sdk';
import * as fs from 'fs';

const client = new CambClient({
    apiKey: process.env.CAMB_API_KEY
});

async function main() {
    const response = await client.textToSpeech.tts({
        text: "Hello! Welcome to Camb.ai text-to-speech.",
        language: "en-us",
        voice_id: 147320,
        speech_model: "mars-flash",
        output_configuration: { format: "wav" }
    });

    const writeStream = fs.createWriteStream("output.wav");
    const reader = response.stream().getReader();

    try {
        while (true) {
            const { done, value } = await reader.read();
            if (done) break;
            writeStream.write(value);
        }
    } finally {
        reader.releaseLock();
        writeStream.end();
    }
}

main();
```

## Direct API - Python requests

```python
import os
import requests

def text_to_speech(text: str, voice_id: int = 147320) -> bytes:
    api_key = os.getenv("CAMB_API_KEY")
    url = "https://client.camb.ai/apis/tts-stream"

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "text": text,
        "voice_id": voice_id,
        "language": "en-us",
        "speech_model": "mars-flash",
        "output_configuration": {"format": "wav"},
    }

    response = requests.post(url, headers=headers, json=payload)
    response.raise_for_status()
    return response.content

audio = text_to_speech("Hello world!")
with open("output.wav", "wb") as f:
    f.write(audio)
```

## Direct API - Python aiohttp (async)

```python
import asyncio
import os
import aiohttp

async def text_to_speech(text: str, voice_id: int = 147320):
    api_key = os.getenv("CAMB_API_KEY")
    url = "https://client.camb.ai/apis/tts-stream"

    headers = {
        "x-api-key": api_key,
        "Content-Type": "application/json",
    }

    payload = {
        "text": text,
        "voice_id": voice_id,
        "language": "en-us",
        "speech_model": "mars-flash",
        "output_configuration": {"format": "wav"},
    }

    async with aiohttp.ClientSession() as session:
        async with session.post(url, headers=headers, json=payload) as resp:
            if resp.status == 200:
                return await resp.read()
            else:
                error = await resp.text()
                raise Exception(f"API error {resp.status}: {error}")

async def main():
    audio = await text_to_speech("Hello from async!")
    with open("output.wav", "wb") as f:
        f.write(audio)

asyncio.run(main())
```

## Direct API - curl

```bash
curl -X POST "https://client.camb.ai/apis/tts-stream" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from the command line!",
    "voice_id": 147320,
    "language": "en-us",
    "speech_model": "mars-flash",
    "output_configuration": {"format": "wav"}
  }' \
  --output output.wav
```

## Multiple Languages

```python
# English
client.text_to_speech.tts(text="Hello!", language="en-us", voice_id=147320)

# Spanish
client.text_to_speech.tts(text="¡Hola!", language="es-es", voice_id=147320)

# French
client.text_to_speech.tts(text="Bonjour!", language="fr-fr", voice_id=147320)

# German
client.text_to_speech.tts(text="Guten Tag!", language="de-de", voice_id=147320)

# Japanese
client.text_to_speech.tts(text="こんにちは!", language="ja-jp", voice_id=147320)
```

## List Available Voices

```python
voices = client.voice_cloning.list_voices()
for voice in voices:
    print(f"ID: {voice['id']}, Name: {voice['voice_name']}, Gender: {voice['gender']}")
```

## Output Formats

Supported formats: `wav`, `mp3`, `flac`, `adts`, `pcm_s16le`, `pcm_s16be`, `pcm_s32le`, `pcm_s32be`, `pcm_f32le`, `pcm_f32be`

```python
# MP3 output
output_configuration=StreamTtsOutputConfiguration(format="mp3")

# Raw PCM (for real-time streaming)
output_configuration=StreamTtsOutputConfiguration(format="pcm_s16le")
```

## TTS Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `text` | string | Yes | Text to convert (min 3 chars) |
| `voice_id` | integer | Yes | Voice ID (default: 147320) |
| `language` | string | No | BCP-47 code (default: `en-us`) |
| `speech_model` | string | No | `mars-flash`, `mars-pro`, `mars-instruct` |
| `output_configuration` | object | No | Format and quality settings |
| `enhance_named_entities` | boolean | No | Better pronunciation for names/places |
