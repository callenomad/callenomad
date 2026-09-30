"""
Generate CalleNomad phrasebook audio clips via CAMB AI TTS API.
Language: Spanish (Colombia) — id=49, short_name=es-co
Voice: Diego Fernandez (id=165327) — cultured, steady Colombian male
       Alicia Mendoza (id=170460) — bright female fallback
"""

import urllib.request
import urllib.error
import json
import time
import os

API_KEY = "1a0b05eb-ceb4-41e8-a0be-0b8e924b32a6"
BASE_URL = "https://client.camb.ai/apis"

# Colombian Spanish voice - use Malena Medina (lang 58 = es-mx, close LATAM cadence)
# or Diego Fernandez (lang 54 = es-es, Castilian) — try translated-tts to es-co instead
# We'll use the standard TTS endpoint with language=es-co and a suitable voice_id
VOICE_ID = 165327  # Diego Fernandez — cultured, steady, descriptive (closest warm male)

PHRASES = {
    "wifi": "¡Buenas! ¿Cómo le va? ¿Me regala la clave del wifi y una mesita cerca al enchufe, porfa? Vengo a trabajar un ratico.",
    "rent": "Hola, buenas tardes. Me gustó muchísimo el apartamento. ¿Habría posibilidad de cuadrar un arriendo mensual directo si me quedo dos o tres meses?",
    "food": "Buenas, ¿qué almuerzo tiene para hoy? ¿Viene con sopa o frijoles? Y me regala juguito natural en agua, por favor.",
    "ride": "Buenas, ya voy saliendo del edificio y estoy en la portería. Me avisa cuando esté afuera, porfa.",
    "social": "¡Qué buen plan! Me encantaría. Vamos a tomar un café y charlar un rato. ¿A qué horas nos vemos?",
}

HEADERS = {
    "x-api-key": API_KEY,
    "Content-Type": "application/json",
}


def post(endpoint, payload):
    data = json.dumps(payload).encode()
    req = urllib.request.Request(f"{BASE_URL}{endpoint}", data=data, headers=HEADERS, method="POST")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def get(endpoint):
    req = urllib.request.Request(f"{BASE_URL}{endpoint}", headers=HEADERS, method="GET")
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def download(endpoint, dest):
    req = urllib.request.Request(f"{BASE_URL}{endpoint}", headers=HEADERS, method="GET")
    with urllib.request.urlopen(req) as r, open(dest, "wb") as f:
        f.write(r.read())


def generate_clip(name, text):
    print(f"\n[{name}] Submitting TTS task...")
    resp = post("/tts", {
        "voice_id": VOICE_ID,
        "text": text,
        "language": "es-co",
        "speech_model": "mars-pro",
    })
    task_id = resp.get("task_id")
    print(f"[{name}] task_id={task_id}")

    # Poll for completion
    for attempt in range(30):
        time.sleep(3)
        status = get(f"/tts/{task_id}")
        s = status.get("status")
        print(f"[{name}] status={s} (attempt {attempt+1})")
        if s == "SUCCESS":
            run_id = status.get("run_id")
            # Download as WAV, save as m4a container (browser handles both)
            out_path = f"audio/{name}.m4a"
            download(f"/tts-result/{run_id}", out_path)
            print(f"[{name}] ✅ Saved to {out_path}")
            return True
        elif s in ("ERROR", "FAILED", "TIMEOUT"):
            print(f"[{name}] ❌ Failed: {status}")
            return False

    print(f"[{name}] ⏱ Timed out")
    return False


if __name__ == "__main__":
    os.makedirs("audio", exist_ok=True)
    results = {}
    for name, text in PHRASES.items():
        ok = generate_clip(name, text)
        results[name] = "✅" if ok else "❌"

    print("\n=== Results ===")
    for k, v in results.items():
        print(f"  {v} {k}.m4a")
