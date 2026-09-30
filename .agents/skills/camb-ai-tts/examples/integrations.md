# Integration Examples

## Pipecat Integration

Build real-time voice AI agents with Pipecat.

### Installation

```bash
# Basic
pip install "pipecat-ai[camb,silero]"

# With Daily transport
pip install "pipecat-ai[camb,silero,daily]"

# With WebSocket transport (for Twilio)
pip install "pipecat-ai[camb,silero,websocket]"

# For local development
pip install "pipecat-ai[camb,silero,local]"
```

### Basic Voice Agent with Daily

```python
import asyncio
import os

from dotenv import load_dotenv
from loguru import logger

from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.audio.vad.vad_analyzer import VADParams
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import LLMContextAggregatorPair
from pipecat.services.camb.tts import CambTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.openai.llm import OpenAILLMService
from pipecat.transports.daily.transport import DailyTransport, DailyParams

load_dotenv()


async def main():
    room_url = os.getenv("DAILY_ROOM_URL")
    token = os.getenv("DAILY_TOKEN", "")

    transport = DailyTransport(
        room_url=room_url,
        token=token,
        bot_name="Camb Voice Bot",
        params=DailyParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.2)),
        ),
    )

    stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))
    tts = CambTTSService(
        api_key=os.getenv("CAMB_API_KEY"),
        model="mars-flash",
    )
    llm = OpenAILLMService(api_key=os.getenv("OPENAI_API_KEY"))

    messages = [
        {
            "role": "system",
            "content": "You are a helpful voice assistant. "
            "Keep your responses concise and conversational. "
            "Avoid special characters or emojis.",
        },
    ]

    context = LLMContext(messages)
    context_aggregator = LLMContextAggregatorPair(context)

    pipeline = Pipeline([
        transport.input(),
        stt,
        context_aggregator.user(),
        llm,
        tts,
        transport.output(),
        context_aggregator.assistant(),
    ])

    task = PipelineTask(
        pipeline,
        params=PipelineParams(
            enable_metrics=True,
            enable_usage_metrics=True,
        ),
    )

    @transport.event_handler("on_client_connected")
    async def on_client_connected(transport, client):
        logger.info("Client connected")
        messages.append({"role": "system", "content": "Please introduce yourself briefly."})
        await task.queue_frames([LLMRunFrame()])

    @transport.event_handler("on_client_disconnected")
    async def on_client_disconnected(transport, client):
        logger.info("Client disconnected")
        await task.cancel()

    runner = PipelineRunner()
    await runner.run(task)


if __name__ == "__main__":
    asyncio.run(main())
```

### Local Audio Agent

```python
import asyncio
import os

from dotenv import load_dotenv
from pipecat.audio.vad.silero import SileroVADAnalyzer
from pipecat.audio.vad.vad_analyzer import VADParams
from pipecat.frames.frames import LLMRunFrame
from pipecat.pipeline.pipeline import Pipeline
from pipecat.pipeline.runner import PipelineRunner
from pipecat.pipeline.task import PipelineParams, PipelineTask
from pipecat.processors.aggregators.llm_context import LLMContext
from pipecat.processors.aggregators.llm_response_universal import LLMContextAggregatorPair
from pipecat.services.camb.tts import CambTTSService
from pipecat.services.deepgram.stt import DeepgramSTTService
from pipecat.services.openai.llm import OpenAILLMService
from pipecat.transports.local.audio import LocalAudioTransport, LocalAudioTransportParams

load_dotenv()


async def main():
    transport = LocalAudioTransport(
        LocalAudioTransportParams(
            audio_in_enabled=True,
            audio_out_enabled=True,
            vad_analyzer=SileroVADAnalyzer(params=VADParams(stop_secs=0.2)),
        )
    )

    stt = DeepgramSTTService(api_key=os.getenv("DEEPGRAM_API_KEY"))
    tts = CambTTSService(api_key=os.getenv("CAMB_API_KEY"), model="mars-flash")
    llm = OpenAILLMService(api_key=os.getenv("OPENAI_API_KEY"))

    messages = [{"role": "system", "content": "You are a helpful voice assistant."}]
    context = LLMContext(messages)
    context_aggregator = LLMContextAggregatorPair(context)

    pipeline = Pipeline([
        transport.input(),
        stt,
        context_aggregator.user(),
        llm,
        tts,
        transport.output(),
        context_aggregator.assistant(),
    ])

    task = PipelineTask(pipeline, params=PipelineParams(audio_out_sample_rate=22050))

    @task.event_handler("on_pipeline_started")
    async def on_started(task, frame):
        messages.append({"role": "system", "content": "Please introduce yourself."})
        await task.queue_frames([LLMRunFrame()])

    runner = PipelineRunner()
    await runner.run(task)


if __name__ == "__main__":
    asyncio.run(main())
```

### CambTTSService Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | str | Required | Your CAMB API key |
| `voice_id` | int | 147320 | Voice ID |
| `model` | str | "mars-flash" | MARS model |
| `timeout` | float | 60.0 | Request timeout |
| `sample_rate` | int | Auto | Audio sample rate |

### Language Configuration

```python
from pipecat.transcriptions.language import Language
from pipecat.services.camb.tts import CambTTSService

# English (US)
tts = CambTTSService(
    api_key=os.getenv("CAMB_API_KEY"),
    params=CambTTSService.InputParams(language=Language.EN_US),
)

# French
tts = CambTTSService(
    api_key=os.getenv("CAMB_API_KEY"),
    params=CambTTSService.InputParams(language=Language.FR),
)

# Spanish
tts = CambTTSService(
    api_key=os.getenv("CAMB_API_KEY"),
    params=CambTTSService.InputParams(language=Language.ES),
)
```

---

## LiveKit Integration

Build voice agents with LiveKit Agents framework.

### Installation

```bash
pip install livekit-plugins-camb 'livekit-agents[silero]' python-dotenv
```

### Environment Variables

```bash
# .env
CAMB_API_KEY=your_camb_api_key
LIVEKIT_URL=wss://your-project.livekit.cloud
LIVEKIT_API_KEY=your_livekit_api_key
LIVEKIT_API_SECRET=your_livekit_api_secret
OPENAI_API_KEY=your_openai_api_key
DEEPGRAM_API_KEY=your_deepgram_api_key
```

### Basic Voice Agent

```python
import logging

from dotenv import load_dotenv
from livekit.agents import (
    Agent,
    AgentServer,
    AgentSession,
    JobContext,
    JobProcess,
    cli,
)
from livekit.plugins import camb, silero

load_dotenv()

logger = logging.getLogger("voice-agent")


class MyAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions=(
                "You are a helpful voice assistant. "
                "Keep your responses concise and conversational. "
                "Do not use emojis or special formatting."
            ),
        )

    async def on_enter(self):
        self.session.generate_reply(allow_interruptions=False)


server = AgentServer()


def prewarm(proc: JobProcess):
    proc.userdata["vad"] = silero.VAD.load()


server.setup_fnc = prewarm


@server.rtc_session()
async def entrypoint(ctx: JobContext):
    session = AgentSession(
        stt="deepgram/nova-3",
        llm="openai/gpt-4.1-mini",
        tts=camb.TTS(),
        vad=ctx.proc.userdata["vad"],
    )

    await session.start(
        agent=MyAgent(),
        room=ctx.room,
    )


if __name__ == "__main__":
    cli.run_app(server)
```

### Run the Agent

```bash
# Development mode (opens playground)
python your_agent.py dev

# Production mode
python your_agent.py start
```

### camb.TTS Options

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| `api_key` | str | CAMB_API_KEY env | Your CAMB API key |
| `voice_id` | int | 147320 | Voice ID |
| `language` | str | "en-us" | BCP-47 language code |
| `model` | str | "mars-flash" | MARS model |
| `output_format` | str | "pcm_s16le" | Audio format |
| `enhance_named_entities` | bool | False | Better pronunciation |

### Dynamic Updates

```python
# Change voice mid-conversation
session.tts.update_options(voice_id=1234)

# Switch model
session.tts.update_options(model="mars-pro")

# Switch language
session.tts.update_options(language="es-es")
```

### Function Tools

```python
from livekit.agents.llm import function_tool
from livekit.agents import RunContext

class MyAgent(Agent):
    def __init__(self) -> None:
        super().__init__(
            instructions="You are a helpful assistant that can look up weather.",
        )

    @function_tool
    async def lookup_weather(
        self,
        context: RunContext,
        location: str,
        latitude: str,
        longitude: str
    ):
        """Called when the user asks for weather information.

        Args:
            location: The location they are asking for
            latitude: The latitude of the location
            longitude: The longitude of the location
        """
        return "sunny with a temperature of 70 degrees."
```

---

## Model Sample Rates

| Model | Sample Rate |
|-------|-------------|
| mars-flash | 22.05 kHz |
| mars-pro | 48 kHz |

Both integrations auto-detect the correct sample rate based on the model.
