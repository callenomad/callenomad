# Transcription Examples

Convert speech to text from audio/video files.

## curl - File Upload

```bash
curl -X POST "https://client.camb.ai/apis/transcribe" \
  -H "x-api-key: YOUR_API_KEY" \
  -F "language=1" \
  -F "media_file=@/path/to/recording.mp3"
```

## curl - URL

```bash
curl -X POST "https://client.camb.ai/apis/transcribe" \
  -H "x-api-key: YOUR_API_KEY" \
  -F "language=1" \
  -F "media_url=https://example.com/audio.mp3"
```

## Python - Complete Workflow

```python
import os
import time
import requests

api_key = os.getenv("CAMB_API_KEY")
base_url = "https://client.camb.ai/apis"
headers = {"x-api-key": api_key}

def create_transcription(language=1, media_file_path=None, media_url=None):
    """Create a transcription task."""
    data = {"language": language}
    files = None

    if media_file_path:
        with open(media_file_path, "rb") as f:
            files = {"media_file": (os.path.basename(media_file_path), f)}
            response = requests.post(
                f"{base_url}/transcribe",
                headers=headers,
                files=files,
                data=data
            )
    else:
        data["media_url"] = media_url
        response = requests.post(
            f"{base_url}/transcribe",
            headers=headers,
            data=data
        )

    response.raise_for_status()
    return response.json()["task_id"]

def poll_transcription(task_id):
    """Poll until transcription completes."""
    while True:
        response = requests.get(
            f"{base_url}/transcribe/{task_id}",
            headers=headers
        )
        result = response.json()
        status = result["status"]
        print(f"Status: {status}")

        if status == "SUCCESS":
            return result["run_id"]
        elif status in ["ERROR", "FAILED", "TIMEOUT"]:
            raise Exception(f"Transcription failed: {status}")

        time.sleep(5)

def get_transcription_result(run_id):
    """Get the transcription text."""
    response = requests.get(
        f"{base_url}/transcription-result/{run_id}",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# Example usage
task_id = create_transcription(
    language=1,  # English
    media_file_path="meeting_recording.mp3"
)
print(f"Task created: {task_id}")

run_id = poll_transcription(task_id)
print(f"Run ID: {run_id}")

result = get_transcription_result(run_id)
print(f"Transcription: {result}")
```

## Python - Using URL

```python
task_id = create_transcription(
    language=1,
    media_url="https://example.com/podcast.mp3"
)
```

## Supported Formats

| Type | Formats |
|------|---------|
| Audio | MP3, WAV, AAC, FLAC |
| Video | MP4, MOV, MXF* |

*MXF requires Enterprise plan

## Language IDs

| Language | ID |
|----------|-----|
| English | 1 |
| Spanish | 54 |
| French | 76 |
| German | 31 |
| Chinese (Mandarin) | 139 |
| Japanese | 88 |
| Arabic | 4 |

## Best Practices

1. **Audio Quality**: Use clear recordings with minimal background noise
2. **Format**: WAV or FLAC for best quality, high-bitrate MP3 if size matters
3. **Language**: Always specify the correct language code
4. **Long Content**: For recordings over 2 hours, consider splitting into smaller files
5. **File Size**: Maximum 20 MB per file

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/transcribe` | POST | Create transcription task |
| `/transcribe/{task_id}` | GET | Check task status |
| `/transcription-result/{run_id}` | GET | Get transcription result |
