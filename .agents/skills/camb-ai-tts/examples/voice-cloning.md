# Voice Cloning Examples

## Requirements

- Reference audio: 10-30 seconds of clear speech
- Formats: WAV, MP3, FLAC, OGG
- Clean audio with minimal background noise

## Python SDK - Create and Use Cloned Voice

```python
import os
from camb.client import CambAI, save_stream_to_file
from camb.types import StreamTtsOutputConfiguration
from camb.types.language_enums import Languages

client = CambAI(api_key=os.getenv("CAMB_API_KEY"))

# Create custom voice from reference audio
custom_voice = client.voice_cloning.create_custom_voice(
    file=open("reference.wav", "rb"),
    voice_name="my-cloned-voice",
    gender=1,  # 1 = male, 2 = female
    description="Custom cloned voice",
    language=Languages.EN_US,
    enhance_audio=True
)

print(f"Voice created! ID: {custom_voice.voice_id}")

# Generate speech with the cloned voice
response = client.text_to_speech.tts(
    text="Hello! This is my cloned voice speaking.",
    voice_id=custom_voice.voice_id,
    language="en-us",
    speech_model="mars-flash",
    output_configuration=StreamTtsOutputConfiguration(format="wav")
)

save_stream_to_file(response, "cloned_output.wav")
```

## TypeScript SDK - Create and Use Cloned Voice

```typescript
import { CambClient, saveStreamToFile } from '@camb-ai/sdk';
import * as fs from 'fs';

const client = new CambClient({
    apiKey: process.env.CAMB_API_KEY
});

async function cloneVoice() {
    const referenceAudioPath = 'reference.wav';

    if (!fs.existsSync(referenceAudioPath)) {
        console.error('Reference audio file not found');
        return;
    }

    // Create custom voice from reference audio
    console.log('Creating custom voice from reference audio...');
    const customVoice = await client.voiceCloning.createCustomVoice({
        file: fs.createReadStream(referenceAudioPath),
        voice_name: `cloned-voice-${Date.now()}`,
        gender: 1, // 1 = male, 2 = female
        description: 'Custom cloned voice',
        language: 1, // 1 = English
        enhance_audio: true
    });

    console.log(`Voice created! ID: ${customVoice.voice_id}`);

    // Generate speech with the cloned voice
    const response = await client.textToSpeech.tts({
        text: 'Hello! This is my cloned voice speaking.',
        voice_id: customVoice.voice_id,
        language: 'en-us',
        speech_model: 'mars-flash',
        output_configuration: { format: 'wav' }
    });

    await saveStreamToFile(response, 'cloned_output.wav');
    console.log('Audio saved to cloned_output.wav');
}

cloneVoice();
```

## Direct API - curl

```bash
# Create custom voice
curl -X POST "https://client.camb.ai/apis/create-custom-voice" \
  -H "x-api-key: YOUR_API_KEY" \
  -F "file=@reference.wav" \
  -F "voice_name=my-cloned-voice" \
  -F "gender=1" \
  -F "language=1" \
  -F "description=Custom cloned voice" \
  -F "enhance_audio=true"

# List all voices
curl "https://client.camb.ai/apis/list-voices" \
  -H "x-api-key: YOUR_API_KEY"
```

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/create-custom-voice` | Create cloned voice (multipart form) |
| GET | `/list-voices` | List all voices (public + custom) |

## List Your Custom Voices

**Python:**
```python
voices = client.voice_cloning.list_voices()
for voice in voices:
    print(f"ID: {voice['id']}, Name: {voice['voice_name']}, Gender: {voice['gender']}")
```

**TypeScript:**
```typescript
const voices = await client.voiceCloning.listVoices();
for (const voice of voices) {
    console.log(`ID: ${voice.id}, Name: ${voice.voice_name}, Gender: ${voice.gender}`);
}
```

## Voice Creation Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `file` | file | Yes | Reference audio file (10-30s) |
| `voice_name` | string | Yes | Name for the voice |
| `gender` | integer | Yes | 1 = male, 2 = female |
| `language` | Language enum / integer | Yes | Language of the voice |
| `description` | string | No | Description of the voice |
| `enhance_audio` | boolean | No | Clean up reference audio |

## Language Enum Values (Python)

```python
from camb.types.language_enums import Languages

Languages.EN_US  # English (US)
Languages.ES_ES  # Spanish (Spain)
Languages.FR_FR  # French (France)
Languages.DE_DE  # German
Languages.JA_JP  # Japanese
Languages.HI_IN  # Hindi
Languages.PT_BR  # Portuguese (Brazil)
Languages.ZH_CN  # Chinese (Mandarin)
```

## Tips for Best Results

1. **Audio Quality**: Use clean recordings with minimal background noise
2. **Duration**: 10-30 seconds works best - not too short, not too long
3. **Content**: Natural speech works better than reading
4. **Format**: WAV or FLAC preferred for highest quality
5. **Enhancement**: Set `enhance_audio=True` to clean up noisy recordings
