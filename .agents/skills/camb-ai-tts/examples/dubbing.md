# Dubbing Examples

Dub videos and audio into other languages automatically.

## Python - Complete Dubbing Workflow

```python
import os
import time
import requests

api_key = os.getenv("CAMB_API_KEY")
base_url = "https://client.camb.ai/apis"
headers = {
    "x-api-key": api_key,
    "Content-Type": "application/json"
}

def submit_dubbing(video_url, source_language, target_languages):
    """Submit a dubbing task."""
    response = requests.post(
        f"{base_url}/dub",
        headers=headers,
        json={
            "video_url": video_url,
            "source_language": source_language,
            "target_languages": target_languages
        }
    )
    response.raise_for_status()
    return response.json()["task_id"]

def poll_dubbing(task_id):
    """Poll until dubbing completes."""
    while True:
        response = requests.get(
            f"{base_url}/dub/{task_id}",
            headers=headers
        )
        result = response.json()
        status = result["status"]
        print(f"Status: {status}")

        if status == "SUCCESS":
            return result["run_id"]
        elif status in ["ERROR", "FAILED", "TIMEOUT"]:
            raise Exception(f"Dubbing failed: {status}")

        time.sleep(10)  # Dubbing takes longer, poll less frequently

def get_dubbed_result(run_id):
    """Get dubbed video info."""
    response = requests.get(
        f"{base_url}/dub-result/{run_id}",
        headers=headers
    )
    response.raise_for_status()
    return response.json()

# Example: Dub a YouTube video from English to Spanish
task_id = submit_dubbing(
    video_url="https://www.youtube.com/watch?v=dQw4w9WgXcQ",
    source_language=1,      # English
    target_languages=[54]   # Spanish
)
print(f"Task created: {task_id}")

run_id = poll_dubbing(task_id)
print(f"Run ID: {run_id}")

result = get_dubbed_result(run_id)
print(f"Dubbed video: {result}")
```

## Python - Multiple Target Languages

```python
# Dub to multiple languages at once
task_id = submit_dubbing(
    video_url="https://www.youtube.com/watch?v=...",
    source_language=1,          # English
    target_languages=[54, 76, 31]  # Spanish, French, German
)
```

## curl - Submit Dubbing Task

```bash
curl -X POST "https://client.camb.ai/apis/dub" \
  -H "x-api-key: YOUR_API_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "video_url": "https://www.youtube.com/watch?v=...",
    "source_language": 1,
    "target_languages": [54]
  }'
```

## curl - Check Status

```bash
curl -X GET "https://client.camb.ai/apis/dub/{task_id}" \
  -H "x-api-key: YOUR_API_KEY"
```

## curl - Get Dubbed Result

```bash
curl "https://client.camb.ai/apis/dub-result/{run_id}" \
  -H "x-api-key: YOUR_API_KEY"
```

## Supported Sources

| Source | Example |
|--------|---------|
| YouTube | `https://www.youtube.com/watch?v=...` |
| Google Drive | `https://drive.google.com/file/d/...` (must be public) |
| Direct URL | `https://example.com/video.mp4` |

## Supported Formats

| Type | Formats |
|------|---------|
| Video | MP4, MOV, MXF* |
| Audio | MP3, FLAC, WAV, AAC |

*MXF requires Enterprise plan

## Language IDs

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

Get full list:
```bash
curl -H "x-api-key: YOUR_API_KEY" https://client.camb.ai/apis/source-languages
curl -H "x-api-key: YOUR_API_KEY" https://client.camb.ai/apis/target-languages
```

## API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/dub` | POST | Create dubbing task |
| `/dub/{task_id}` | GET | Check task status |
| `/dub-result/{run_id}` | GET | Get dubbed result |
| `/dub-alt-format/{run_id}/{language}` | POST | Export in alt format (MP4, SRT, VTT, TXT) |
| `/dub-alt-format/{task_id}` | GET | Check alt format export status |

## The Dubbing Process

1. **Project Setup**: System prepares content for localization
2. **Translation**: Text translated using BOLI translation engine
3. **Voiceover Generation**: Speech synthesized using MARS models
4. **Final Assembly**: Combined into seamless final product

## Use Cases

- E-Learning content localization
- Marketing video localization
- Entertainment dubbing
- Corporate communications
- Social media content expansion
