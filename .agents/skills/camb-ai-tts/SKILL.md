---
name: camb
description: CAMB AI voice and translation APIs - TTS, voice cloning, dubbing, transcription. Use when integrating speech synthesis, voice cloning, audio translation, or transcription.
license: MIT
metadata:
  author: CAMB AI
  version: 1.0.0
---

# CAMB AI Voice & Translation APIs

## Quick Start

### Authentication

Get your API key from [CAMB AI Studio](https://studio.camb.ai).

```bash
export CAMB_API_KEY=your_api_key
```

### SDK Installation

```bash
# Python
pip install camb-sdk

# Node.js
npm install @camb-ai/sdk
```

### Client Initialization

**Python:**
```python
import os
from camb.client import CambAI

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))
```

**TypeScript:**
```typescript
import { CambClient } from '@camb-ai/sdk';

const client = new CambClient({
    apiKey: process.env.CAMB_API_KEY
});
```

---

## Text-to-Speech (TTS)

Generate speech from text with streaming support.

**Python:**
```python
from camb.client import CambAI, save_stream_to_file
from camb.types import StreamTtsOutputConfiguration

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))

stream = client.text_to_speech.tts(
    text="Hello! Welcome to CAMB AI.",
    language="en-us",
    voice_id=147320,
    speech_model="mars-flash",
    output_configuration=StreamTtsOutputConfiguration(format="wav"),
)
save_stream_to_file(stream, "output.wav")
```

**TypeScript:**
```typescript
import { CambClient, saveStreamToFile } from '@camb-ai/sdk';

const client = new CambClient({ apiKey: process.env.CAMB_API_KEY });

const response = await client.textToSpeech.tts({
    text: "Hello! Welcome to CAMB AI.",
    language: "en-us",
    voice_id: 147320,
    speech_model: "mars-flash",
    output_configuration: { format: "wav" }
});

await saveStreamToFile(response, "output.wav");
```

**Direct API (curl):**
```bash
curl -X POST "https://client.camb.ai/apis/tts-stream" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello from CAMB AI!",
    "voice_id": 147320,
    "language": "en-us",
    "speech_model": "mars-flash",
    "output_configuration": {"format": "wav"}
  }' \
  --output output.wav
```

---

## Voice Cloning

Clone voices from reference audio (10-30 seconds of clear speech).

**Python:**
```python
from camb.client import CambAI, save_stream_to_file
from camb.types import StreamTtsOutputConfiguration
from camb.types.language_enums import Languages

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))

# Create custom voice from reference audio
custom_voice = client.voice_cloning.create_custom_voice(
    file=open("reference.wav", "rb"),
    voice_name="my-cloned-voice",
    gender=1,  # 1 = male, 2 = female
    language=Languages.EN_US,
    enhance_audio=True
)

print(f"Voice created! ID: {custom_voice.voice_id}")

# Use the cloned voice
stream = client.text_to_speech.tts(
    text="Hello from my cloned voice!",
    voice_id=custom_voice.voice_id,
    language="en-us",
    speech_model="mars-flash",
    output_configuration=StreamTtsOutputConfiguration(format="wav")
)
save_stream_to_file(stream, "cloned_output.wav")
```

**TypeScript:**
```typescript
import { CambClient, saveStreamToFile } from '@camb-ai/sdk';
import * as fs from 'fs';

const client = new CambClient({ apiKey: process.env.CAMB_API_KEY });

// Create custom voice
const customVoice = await client.voiceCloning.createCustomVoice({
    file: fs.createReadStream('reference.wav'),
    voice_name: 'my-cloned-voice',
    gender: 1,  // 1 = male, 2 = female
    language: 1,  // English
    enhance_audio: true
});

console.log(`Voice created! ID: ${customVoice.voice_id}`);

// Use the cloned voice
const response = await client.textToSpeech.tts({
    text: 'Hello from my cloned voice!',
    voice_id: customVoice.voice_id,
    language: 'en-us',
    speech_model: 'mars-flash',
    output_configuration: { format: 'wav' }
});

await saveStreamToFile(response, 'cloned_output.wav');
```

**Direct API (curl):**
```bash
curl -X POST "https://client.camb.ai/apis/create-custom-voice" \
  -H "x-api-key: YOUR_API_KEY" \
  -F "file=@reference.wav" \
  -F "voice_name=my-cloned-voice" \
  -F "gender=1" \
  -F "language=1" \
  -F "enhance_audio=true"
```

---

## Translated TTS

Translate text and generate speech in one call. Uses numeric language IDs.

**Python:**
```python
import time
import requests
from camb.client import CambAI

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))

# Translate English to Spanish and generate speech
response = client.translated_tts.create_translated_tts(
    text="Hello, welcome to our service. We're glad to have you here.",
    source_language=1,   # English (US)
    target_language=54,  # Spanish (Spain)
    voice_id=144300
)

task_id = response.task_id
print(f"Task created: {task_id}")

# Poll for completion
while True:
    status = client.translated_tts.get_translated_tts_task_status(task_id=task_id)
    print(f"Status: {status.status}")

    if status.status == "SUCCESS":
        result = client.text_to_speech.get_tts_run_info(
            run_id=status.run_id,
            output_type="file_url"
        )
        audio_response = requests.get(result.output_url)
        with open("translated_output.wav", "wb") as f:
            f.write(audio_response.content)
        print("Saved to translated_output.wav")
        break
    elif status.status == "FAILED":
        print("Translation failed!")
        break

    time.sleep(2)
```

**Direct API (curl):**
```bash
# Step 1: Create translated TTS task
curl -X POST "https://client.camb.ai/apis/translated-tts" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "text": "Hello, welcome to our service.",
    "source_language": 1,
    "target_language": 54,
    "voice_id": 144300
  }'
# Returns: {"task_id": "..."}

# Step 2: Poll for completion
curl "https://client.camb.ai/apis/translated-tts/{task_id}" \
  -H "x-api-key: YOUR_API_KEY"
# Returns: {"status": "SUCCESS", "run_id": "..."}

# Step 3: Get audio result
curl "https://client.camb.ai/apis/tts-result/{run_id}" \
  -H "x-api-key: YOUR_API_KEY" \
  --output translated_output.wav
```

---

## Transcription

Convert speech to text.

**curl:**
```bash
# Using a local file
curl -X POST "https://client.camb.ai/apis/transcribe" \
  -H "x-api-key: YOUR_API_KEY" \
  -F "language=1" \
  -F "media_file=@recording.mp3"

# Using a URL
curl -X POST "https://client.camb.ai/apis/transcribe" \
  -H "x-api-key: YOUR_API_KEY" \
  -F "language=1" \
  -F "media_url=https://example.com/audio.mp3"
```

**Python:**
```python
import requests

def create_transcription(api_key, language=1, media_file_path=None, media_url=None):
    url = "https://client.camb.ai/apis/transcribe"
    headers = {"x-api-key": api_key}
    data = {"language": language}

    if media_file_path:
        with open(media_file_path, "rb") as f:
            files = {"media_file": (media_file_path.split("/")[-1], f)}
            response = requests.post(url, headers=headers, files=files, data=data)
    else:
        data["media_url"] = media_url
        response = requests.post(url, headers=headers, data=data)

    return response.json()  # Returns {"task_id": "..."}

# Poll status: GET https://client.camb.ai/apis/transcribe/{task_id}
# Get result: GET https://client.camb.ai/apis/transcription-result/{run_id}
```

Supported formats: MP3, WAV, AAC, FLAC, MP4, MOV, MXF

---

## Dubbing

Dub videos/audio into other languages.

**Python:**
```python
import requests
import time

api_key = "YOUR_API_KEY"
headers = {
    "x-api-key": api_key,
    "Content-Type": "application/json"
}

# Submit dubbing task
response = requests.post(
    "https://client.camb.ai/apis/dub",
    headers=headers,
    json={
        "video_url": "https://www.youtube.com/watch?v=...",
        "source_language": 1,      # English
        "target_languages": [54],  # Spanish
    }
)
task_id = response.json()["task_id"]
print(f"Task created: {task_id}")

# Poll for completion
while True:
    status_response = requests.get(
        f"https://client.camb.ai/apis/dub/{task_id}",
        headers=headers
    )
    status = status_response.json()["status"]
    print(f"Status: {status}")

    if status == "SUCCESS":
        run_id = status_response.json()["run_id"]
        # Get result: GET /dub-result/{run_id}
        break
    elif status in ["ERROR", "FAILED"]:
        break

    time.sleep(5)
```

Supported sources: YouTube, Google Drive, direct URLs
Supported formats: MP4, MOV, MXF, MP3, FLAC, WAV, AAC

---

## MARS Models

| Model | Latency | Use Case |
|-------|---------|----------|
| `mars-flash` | ~150ms | Real-time agents, conversational AI |
| `mars-pro` | 800ms-2s | Translation, audiobooks, expressive dubbing |
| `mars-instruct` | Higher | TV/film, director-level control |
| `mars-nano` | 500ms-2s | On-device applications |

---

## Language Codes

**For TTS** (BCP-47 codes):
`en-us`, `es-es`, `fr-fr`, `de-de`, `ja-jp`, `hi-in`, `pt-br`, `zh-cn`, `ko-kr`, `it-it`, `nl-nl`, `ru-ru`, `ar-sa`, `ta-in`, `te-in`, `bn-in`

**For Translation/Transcription/Dubbing** (numeric IDs):

| Language | ID |
|----------|-----|
| English (US) | 1 |
| Spanish (Spain) | 54 |
| French (France) | 76 |
| German | 31 |
| Japanese | 88 |
| Hindi | 81 |
| Portuguese (Brazil) | 111 |
| Chinese (Mandarin) | 139 |

Use `/source-languages` and `/target-languages` endpoints to get full list.

---

## Pipecat Integration

Build real-time voice AI agents with Pipecat.

```bash
pip install "pipecat-ai[camb,silero,daily]"
```

```python
from pipecat.services.camb.tts import CambTTSService

tts = CambTTSService(
    api_key=os.getenv("CAMB_API_KEY"),
    model="mars-flash",
)

# Use in pipeline
pipeline = Pipeline([
    transport.input(),
    stt,
    context_aggregator.user(),
    llm,
    tts,
    transport.output(),
    context_aggregator.assistant(),
])
```

---

## LiveKit Integration

Build voice agents with LiveKit.

```bash
pip install livekit-plugins-camb 'livekit-agents[silero]'
```

```python
from livekit.plugins import camb

session = AgentSession(
    stt="deepgram/nova-3",
    llm="openai/gpt-4.1-mini",
    tts=camb.TTS(),
    vad=ctx.proc.userdata["vad"],
)
```

---

## Task Status Values

| Status | Description |
|--------|-------------|
| `PENDING` | Processing |
| `SUCCESS` | Completed |
| `ERROR` | Failed |
| `TIMEOUT` | Timed out |

---

## REST API Endpoint Reference

Base URL: `https://client.camb.ai/apis` — All requests require `x-api-key` header.

### TTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/tts` | Create async TTS task |
| GET | `/tts/{task_id}` | Poll TTS task status |
| GET | `/tts-result/{run_id}` | Fetch TTS audio result |
| POST | `/tts-stream` | Stream TTS audio (real-time) |

### Voice Cloning

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-custom-voice` | Create cloned voice (multipart form) |
| GET | `/list-voices` | List all voices (public + custom) |

### Translated TTS

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/translated-tts` | Create translated TTS task |
| GET | `/translated-tts/{task_id}` | Poll translated TTS status |
| GET | `/tts-result/{run_id}` | Fetch translated audio result |
| GET | `/translation-result/{run_id}` | Fetch translated text result |

### Translation (text-only)

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/translate` | Create text translation task |
| GET | `/translate/{task_id}` | Poll translation status |
| GET | `/translation-result/{run_id}` | Fetch translation result |

### Transcription

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/transcribe` | Create transcription task (multipart form) |
| GET | `/transcribe/{task_id}` | Poll transcription status |
| GET | `/transcription-result/{run_id}` | Fetch transcription text |

### Dubbing

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/dub` | Create dubbing task |
| GET | `/dub/{task_id}` | Poll dubbing status |
| GET | `/dub-result/{run_id}` | Fetch dubbed result |
| POST | `/dub-alt-format/{run_id}/{language}` | Export in alt format (MP4, SRT, VTT, TXT) |

### Language/Voice Support

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/source-languages` | List supported source languages |
| GET | `/target-languages` | List supported target languages |

---

## Additional Examples

For more detailed examples, see:

- [examples/tts.md](examples/tts.md) - Streaming, async, multiple languages, output formats
- [examples/voice-cloning.md](examples/voice-cloning.md) - Creating and using cloned voices
- [examples/translation.md](examples/translation.md) - Translated TTS with polling
- [examples/transcription.md](examples/transcription.md) - Speech-to-text workflows
- [examples/dubbing.md](examples/dubbing.md) - Video/audio dubbing
- [examples/integrations.md](examples/integrations.md) - Full Pipecat and LiveKit examples
