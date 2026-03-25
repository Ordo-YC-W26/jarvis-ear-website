"""
Audio Pipeline Test — runs entirely on your laptop (no hardware needed).

Tests the full Jarvis flow using your Mac's microphone:
  1. Listen for voice command (Mac mic)
  2. Speech-to-Text (Deepgram API)
  3. Intent parsing + action decision (Claude API)
  4. Execute action (Slack, GitHub, etc.)
  5. Text-to-Speech response (OpenAI TTS API)
  6. Play response through speaker

This validates the entire cloud pipeline before any hardware exists.

Usage:
    python test_audio_pipeline.py

Required env vars:
    ANTHROPIC_API_KEY  — for Claude (intent parsing)
    DEEPGRAM_API_KEY   — for speech-to-text

Optional env vars:
    OPENAI_API_KEY     — for TTS (text-to-speech)
    SLACK_BOT_TOKEN    — for Slack actions
    GITHUB_TOKEN       — for GitHub actions
"""
import json
import os
import sys
import wave
import tempfile
import subprocess

# Check dependencies before importing
MISSING = []
try:
    import pyaudio
except ImportError:
    MISSING.append("pyaudio")
try:
    import anthropic
except ImportError:
    MISSING.append("anthropic")
try:
    import requests
except ImportError:
    MISSING.append("requests")

if MISSING:
    print(f"Missing dependencies: {', '.join(MISSING)}")
    print(f"Install with: pip install {' '.join(MISSING)}")
    sys.exit(1)


# ─── CONFIG ───────────────────────────────────────────────────────────
SAMPLE_RATE = 16000
CHANNELS = 1
CHUNK_SIZE = 1024
RECORD_SECONDS = 5  # How long to listen for a command
FORMAT = pyaudio.paInt16


# ─── STEP 1: RECORD AUDIO FROM MAC MIC ──────────────────────────────
def record_audio(duration: int = RECORD_SECONDS) -> str:
    """Record audio from the default microphone. Returns path to WAV file."""
    print(f"\n  [MIC] Listening for {duration} seconds... Speak now!")

    p = pyaudio.PyAudio()
    stream = p.open(
        format=FORMAT,
        channels=CHANNELS,
        rate=SAMPLE_RATE,
        input=True,
        frames_per_buffer=CHUNK_SIZE,
    )

    frames = []
    for _ in range(0, int(SAMPLE_RATE / CHUNK_SIZE * duration)):
        data = stream.read(CHUNK_SIZE, exception_on_overflow=False)
        frames.append(data)

    stream.stop_stream()
    stream.close()
    p.terminate()

    # Save to temp WAV file
    tmp = tempfile.NamedTemporaryFile(suffix=".wav", delete=False)
    wf = wave.open(tmp.name, "wb")
    wf.setnchannels(CHANNELS)
    wf.setsampwidth(p.get_sample_size(FORMAT))
    wf.setframerate(SAMPLE_RATE)
    wf.writeframes(b"".join(frames))
    wf.close()

    print(f"  [MIC] Recorded {duration}s → {tmp.name}")
    return tmp.name


# ─── STEP 2: SPEECH-TO-TEXT (DEEPGRAM) ──────────────────────────────
def speech_to_text_deepgram(audio_path: str) -> str:
    """Send audio to Deepgram API for transcription."""
    api_key = os.environ.get("DEEPGRAM_API_KEY")
    if not api_key:
        print("  [STT] No DEEPGRAM_API_KEY set — using fallback (whisper CLI)")
        return speech_to_text_fallback(audio_path)

    print("  [STT] Sending to Deepgram...")

    with open(audio_path, "rb") as f:
        audio_data = f.read()

    response = requests.post(
        "https://api.deepgram.com/v1/listen?model=nova-2&smart_format=true",
        headers={
            "Authorization": f"Token {api_key}",
            "Content-Type": "audio/wav",
        },
        data=audio_data,
    )

    if response.status_code != 200:
        print(f"  [STT] Deepgram error: {response.status_code} {response.text[:200]}")
        return ""

    result = response.json()
    transcript = result["results"]["channels"][0]["alternatives"][0]["transcript"]
    print(f"  [STT] Transcript: \"{transcript}\"")
    return transcript


def speech_to_text_fallback(audio_path: str) -> str:
    """Fallback: use macOS built-in speech recognition or manual input."""
    print("  [STT] Fallback — type what you said (or press Enter to skip):")
    text = input("  > ").strip()
    return text


# ─── STEP 3: INTENT PARSING (CLAUDE) ────────────────────────────────
SYSTEM_PROMPT = """You are Jarvis, a voice-activated AI assistant worn on the ear.
The user speaks voice commands. Parse the intent and decide what action to take.

Respond with JSON only:
{
  "intent": "send_slack" | "create_github_issue" | "set_reminder" | "create_event" | "take_note" | "remember" | "search_notes" | "list_github_issues" | "list_github_prs" | "read_slack" | "answer_question" | "unknown",
  "confidence": 0.0-1.0,
  "params": {
    // For send_slack: {"channel": "...", "recipient": "...", "message": "..."}
    // For create_github_issue: {"repo": "owner/repo", "title": "...", "body": "..."}
    // For set_reminder/create_event: {"title": "...", "date": "...", "time": "...", "duration_minutes": 30}
    // For take_note/remember: {"content": "..."}
    // For search_notes: {"query": "..."}
    // For list_github_issues/list_github_prs: {"repo": "owner/repo"}
    // For read_slack: {"channel": "..."}
    // For answer_question: {"question": "..."}
  },
  "spoken_response": "Brief confirmation to speak back to the user (1 sentence)"
}"""


def parse_intent(transcript: str) -> dict:
    """Use Claude to parse the voice command into an actionable intent."""
    api_key = os.environ.get("ANTHROPIC_API_KEY")
    if not api_key:
        print("  [LLM] No ANTHROPIC_API_KEY set — cannot parse intent")
        return {"intent": "unknown", "spoken_response": "I need an API key to work."}

    print("  [LLM] Parsing intent with Claude...")

    client = anthropic.Anthropic()
    response = client.messages.create(
        model="claude-sonnet-4-6",
        max_tokens=300,
        system=SYSTEM_PROMPT,
        messages=[{"role": "user", "content": f"Voice command: \"{transcript}\""}],
    )

    text = response.content[0].text

    # Extract JSON from response
    try:
        # Handle case where Claude wraps in markdown code block
        if "```" in text:
            text = text.split("```json")[-1].split("```")[0].strip()
            if not text:
                text = response.content[0].text.split("```")[1].split("```")[0].strip()
        result = json.loads(text)
    except json.JSONDecodeError:
        result = {"intent": "unknown", "spoken_response": "I didn't understand that."}

    print(f"  [LLM] Intent: {result.get('intent')} (confidence: {result.get('confidence', '?')})")
    print(f"  [LLM] Params: {json.dumps(result.get('params', {}), indent=2)}")
    print(f"  [LLM] Response: \"{result.get('spoken_response')}\"")
    return result


# ─── STEP 4: EXECUTE ACTIONS ────────────────────────────────────────
def execute_action(intent_result: dict) -> bool:
    """Execute the parsed intent via the action router. Returns True if succeeded."""
    from actions.router import route

    intent = intent_result.get("intent", "unknown")
    params = intent_result.get("params", {})

    print(f"  [ACTION] Routing: {intent}")
    result = route(intent, params)

    if result.get("success"):
        print(f"  [ACTION] OK: {result.get('detail', 'Done')}")
        if result.get("dry_run"):
            print(f"  [ACTION] (Dry run — set API token for real execution)")
        return True
    else:
        print(f"  [ACTION] FAILED: {result.get('detail', 'Unknown error')}")
        return False


# ─── STEP 5: TEXT-TO-SPEECH ─────────────────────────────────────────
def text_to_speech(text: str) -> str:
    """Convert text to speech. Returns path to audio file."""
    api_key = os.environ.get("OPENAI_API_KEY")

    if api_key:
        print("  [TTS] Generating speech with OpenAI...")
        response = requests.post(
            "https://api.openai.com/v1/audio/speech",
            headers={"Authorization": f"Bearer {api_key}", "Content-Type": "application/json"},
            json={"model": "tts-1", "input": text, "voice": "onyx", "response_format": "mp3"},
        )
        if response.status_code == 200:
            tmp = tempfile.NamedTemporaryFile(suffix=".mp3", delete=False)
            tmp.write(response.content)
            tmp.close()
            print(f"  [TTS] Generated: {tmp.name}")
            return tmp.name

    # Fallback: macOS built-in TTS
    print("  [TTS] Using macOS say command...")
    tmp = tempfile.NamedTemporaryFile(suffix=".aiff", delete=False)
    tmp.close()
    subprocess.run(["say", "-o", tmp.name, text], capture_output=True)
    return tmp.name


# ─── STEP 6: PLAY AUDIO ─────────────────────────────────────────────
def play_audio(audio_path: str):
    """Play audio file through speakers."""
    print(f"  [PLAY] Playing response...")
    subprocess.run(["afplay", audio_path], capture_output=True)


# ─── MAIN LOOP ──────────────────────────────────────────────────────
def run_once():
    """Run the pipeline once: listen → understand → act → respond."""
    print("\n" + "=" * 60)
    print("JARVIS EAR — Audio Pipeline Test")
    print("=" * 60)

    # Step 1: Record
    audio_path = record_audio()

    # Step 2: STT
    transcript = speech_to_text_deepgram(audio_path)
    if not transcript:
        print("  [SKIP] No speech detected.")
        os.unlink(audio_path)
        return

    # Step 3: Parse intent
    intent_result = parse_intent(transcript)

    # Step 4: Execute action
    success = execute_action(intent_result)

    # Step 5: TTS
    spoken = intent_result.get("spoken_response", "Done.")
    if not success:
        spoken = "Sorry, I couldn't complete that action."
    tts_path = text_to_speech(spoken)

    # Step 6: Play
    play_audio(tts_path)

    # Cleanup
    os.unlink(audio_path)
    if os.path.exists(tts_path):
        os.unlink(tts_path)

    print("\n  Pipeline complete.")
    print(f"  Flow: Mic → STT → Claude → Action → TTS → Speaker")


def run_loop():
    """Run continuously — press Ctrl+C to stop."""
    print("\nJARVIS EAR — Continuous Mode")
    print("Press Ctrl+C to stop\n")

    while True:
        try:
            input("Press Enter to give a command (or Ctrl+C to quit)...")
            run_once()
        except KeyboardInterrupt:
            print("\n\nGoodbye!")
            break


if __name__ == "__main__":
    if "--loop" in sys.argv:
        run_loop()
    else:
        run_once()
