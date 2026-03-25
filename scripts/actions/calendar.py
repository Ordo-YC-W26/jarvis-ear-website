"""
Calendar action handler.

Supports:
  - Create a calendar event
  - List upcoming events
  - Check availability

Uses Google Calendar API.
Requires GOOGLE_CALENDAR_CREDENTIALS env var pointing to credentials JSON,
or falls back to dry-run mode.
"""
import os
import json
from datetime import datetime, timedelta


CREDENTIALS_PATH = os.environ.get("GOOGLE_CALENDAR_CREDENTIALS", "")
CALENDAR_FILE = os.path.join(os.path.dirname(__file__), "..", "..", "data", "calendar.json")


def _load_local_calendar() -> list:
    """Load local calendar (fallback when no Google credentials)."""
    if os.path.exists(CALENDAR_FILE):
        with open(CALENDAR_FILE) as f:
            return json.load(f)
    return []


def _save_local_calendar(events: list):
    """Save to local calendar file."""
    os.makedirs(os.path.dirname(CALENDAR_FILE), exist_ok=True)
    with open(CALENDAR_FILE, "w") as f:
        json.dump(events, f, indent=2)


def create_event(title: str, date: str = "", time: str = "", duration_minutes: int = 30, notes: str = "") -> dict:
    """
    Create a calendar event.

    Args:
        title: Event title
        date: Date string (e.g., "2026-03-26" or "tomorrow")
        time: Time string (e.g., "3pm", "15:00")
        duration_minutes: Duration in minutes
        notes: Optional notes/description

    Returns:
        {"success": bool, "detail": str}
    """
    # Parse date
    if not date or date.lower() == "today":
        event_date = datetime.now().strftime("%Y-%m-%d")
    elif date.lower() == "tomorrow":
        event_date = (datetime.now() + timedelta(days=1)).strftime("%Y-%m-%d")
    else:
        event_date = date

    # Parse time
    if not time:
        event_time = "09:00"
    elif "pm" in time.lower():
        hour = int(time.lower().replace("pm", "").replace(":", "").strip())
        if hour < 12:
            hour += 12
        event_time = f"{hour:02d}:00"
    elif "am" in time.lower():
        hour = int(time.lower().replace("am", "").replace(":", "").strip())
        event_time = f"{hour:02d}:00"
    else:
        event_time = time

    event = {
        "title": title,
        "date": event_date,
        "time": event_time,
        "duration_minutes": duration_minutes,
        "notes": notes,
        "created_at": datetime.now().isoformat(),
    }

    # Try Google Calendar API
    if CREDENTIALS_PATH and os.path.exists(CREDENTIALS_PATH):
        return _create_google_event(event)

    # Fallback: local calendar
    events = _load_local_calendar()
    events.append(event)
    _save_local_calendar(events)

    return {
        "success": True,
        "detail": f"Event created: {title} on {event_date} at {event_time} ({duration_minutes}min)",
        "event": event,
        "local": True,
    }


def list_events(days_ahead: int = 7) -> dict:
    """List upcoming events."""
    if CREDENTIALS_PATH and os.path.exists(CREDENTIALS_PATH):
        return _list_google_events(days_ahead)

    # Fallback: local calendar
    events = _load_local_calendar()
    today = datetime.now().strftime("%Y-%m-%d")
    cutoff = (datetime.now() + timedelta(days=days_ahead)).strftime("%Y-%m-%d")

    upcoming = [e for e in events if today <= e.get("date", "") <= cutoff]
    upcoming.sort(key=lambda e: (e.get("date", ""), e.get("time", "")))

    return {
        "success": True,
        "events": upcoming,
        "count": len(upcoming),
        "local": True,
    }


def _create_google_event(event: dict) -> dict:
    """Create event via Google Calendar API (placeholder)."""
    # TODO: Implement with google-api-python-client
    # from googleapiclient.discovery import build
    # service = build('calendar', 'v3', credentials=creds)
    # service.events().insert(calendarId='primary', body=event_body).execute()
    return {"success": False, "detail": "Google Calendar integration not yet implemented"}


def _list_google_events(days_ahead: int) -> dict:
    """List events via Google Calendar API (placeholder)."""
    return {"success": False, "detail": "Google Calendar integration not yet implemented"}


def execute(params: dict) -> dict:
    """Entry point called by the action router."""
    action = params.get("action", "create_event")

    if action == "create_event":
        return create_event(
            title=params.get("title", ""),
            date=params.get("date", ""),
            time=params.get("time", ""),
            duration_minutes=params.get("duration_minutes", 30),
            notes=params.get("notes", ""),
        )
    elif action == "list_events":
        return list_events(days_ahead=params.get("days_ahead", 7))
    else:
        return {"success": False, "detail": f"Unknown calendar action: {action}"}
