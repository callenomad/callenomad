# Translation Examples

Translated TTS translates text and generates speech in the target language in one API call.

**Important:** Translation APIs use numeric language IDs, not BCP-47 codes.

## Python SDK - Translated TTS

```python
import os
import time
import requests
from camb.client import CambAI

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))

# Translate English to Spanish and generate speech
response = client.translated_tts.create_translated_tts(
    text="Hello, welcome to our service. We're glad to have you here.",
    source_language=1,  # English (US)
    target_language=54,  # Spanish (Spain)
    voice_id=144300      # Voice ID (required)
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

## TypeScript SDK - Translated TTS

```typescript
import { CambClient } from '@camb-ai/sdk';
import fs from 'fs';

const client = new CambClient({
    apiKey: process.env.CAMB_API_KEY
});

async function translateAndSpeak() {
    // Translate English to Spanish and generate speech
    console.log('Translating and generating speech...');
    const response = await client.translatedTts.createTranslatedTts({
        text: "Hello, welcome to our service. We're glad to have you here.",
        source_language: 1,  // English (US)
        target_language: 54,  // Spanish (Spain)
        voice_id: 144300      // Voice ID (required)
    });

    const taskId = response.task_id;
    console.log(`Task created: ${taskId}`);

    // Poll for completion
    while (true) {
        const status = await client.translatedTts.getTranslatedTtsTaskStatus({
            task_id: taskId
        });

        console.log(`Status: ${status.status}`);

        if (status.status === 'SUCCESS') {
            await new Promise(r => setTimeout(r, 1000));

            const result = await client.textToSpeech.getTtsRunInfo({
                run_id: status.run_id,
                output_type: 'file_url'
            });
            const audioResponse = await fetch(result.output_url);
            const buffer = Buffer.from(await audioResponse.arrayBuffer());
            fs.writeFileSync('translated_output.wav', buffer);
            console.log('Saved to translated_output.wav');
            break;
        } else if (status.status === 'FAILED') {
            console.log('Translation failed!');
            break;
        }

        await new Promise(r => setTimeout(r, 2000));
    }
}

translateAndSpeak();
```

## Direct API - Translated TTS

```python
import requests
import time

api_key = "YOUR_API_KEY"
base_url = "https://client.camb.ai/apis"
headers = {
    "x-api-key": api_key,
    "Content-Type": "application/json"
}

# Step 1: Create translated TTS task
response = requests.post(
    f"{base_url}/translated-tts",
    headers=headers,
    json={
        "text": "Hello, welcome to our service.",
        "source_language": 1,
        "target_language": 54,
        "voice_id": 144300
    }
)
task_id = response.json()["task_id"]

# Step 2: Poll for completion
while True:
    status_response = requests.get(
        f"{base_url}/translated-tts/{task_id}",
        headers=headers
    )
    status = status_response.json()["status"]

    if status == "SUCCESS":
        run_id = status_response.json()["run_id"]
        break
    time.sleep(2)

# Step 3: Get audio result
result_response = requests.get(
    f"{base_url}/tts-result/{run_id}",
    headers=headers,
    stream=True
)
with open("translated.wav", "wb") as f:
    for chunk in result_response.iter_content(chunk_size=1024):
        if chunk:
            f.write(chunk)
```

## Direct API - curl

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

# Step 2: Poll for completion
curl "https://client.camb.ai/apis/translated-tts/{task_id}" \
  -H "x-api-key: YOUR_API_KEY"

# Step 3: Get audio result
curl "https://client.camb.ai/apis/tts-result/{run_id}" \
  -H "x-api-key: YOUR_API_KEY" \
  --output translated_output.wav
```

## Language ID Reference

| Language | ID |
|----------|-----|
| English (US) | 1 |
| Spanish (Spain) | 54 |
| French (France) | 76 |
| German (Germany) | 31 |
| Japanese (Japan) | 88 |
| Hindi (India) | 81 |
| Portuguese (Brazil) | 111 |
| Chinese (Mandarin) | 139 |

Use the `/source-languages` and `/target-languages` API endpoints to get the complete list:

```bash
curl -H "x-api-key: YOUR_API_KEY" https://client.camb.ai/apis/source-languages
curl -H "x-api-key: YOUR_API_KEY" https://client.camb.ai/apis/target-languages
```

## Use Cases

- Global announcements in multiple languages
- Podcast/video content localization
- Customer support in customer's native language
- E-learning course translation
- Marketing content localization
