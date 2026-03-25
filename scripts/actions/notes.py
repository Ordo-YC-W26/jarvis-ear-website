"""
Notes action handler.

Supports:
  - Save a note (text, tagged with timestamp)
  - Search notes by keyword
  - List recent notes
  - Delete a note

Notes are stored locally as JSON in data/notes/
"""
import json
import os
from datetime import datetime
from pathlib import Path

NOTES_DIR = Path(__file__).parent.parent.parent / "data" / "notes"


def _ensure_dir():
    NOTES_DIR.mkdir(parents=True, exist_ok=True)


def _note_path(note_id: str) -> Path:
    return NOTES_DIR / f"{note_id}.json"


def save_note(content: str, tags: list = None) -> dict:
    """
    Save a new note.

    Args:
        content: The note text
        tags: Optional list of tags for categorization

    Returns:
        {"success": bool, "note_id": str}
    """
    _ensure_dir()

    note_id = datetime.now().strftime("%Y%m%d_%H%M%S")
    note = {
        "id": note_id,
        "content": content,
        "tags": tags or [],
        "created_at": datetime.now().isoformat(),
    }

    with open(_note_path(note_id), "w") as f:
        json.dump(note, f, indent=2)

    return {
        "success": True,
        "detail": f"Note saved: {content[:50]}{'...' if len(content) > 50 else ''}",
        "note_id": note_id,
    }


def search_notes(query: str) -> dict:
    """Search notes by keyword (case-insensitive)."""
    _ensure_dir()

    query_lower = query.lower()
    results = []

    for f in sorted(NOTES_DIR.glob("*.json"), reverse=True):
        with open(f) as fh:
            note = json.load(fh)
        if query_lower in note.get("content", "").lower() or any(
            query_lower in t.lower() for t in note.get("tags", [])
        ):
            results.append(note)

    return {
        "success": True,
        "results": results,
        "count": len(results),
    }


def list_recent(limit: int = 10) -> dict:
    """List most recent notes."""
    _ensure_dir()

    notes = []
    for f in sorted(NOTES_DIR.glob("*.json"), reverse=True)[:limit]:
        with open(f) as fh:
            notes.append(json.load(fh))

    return {
        "success": True,
        "notes": notes,
        "count": len(notes),
    }


def delete_note(note_id: str) -> dict:
    """Delete a note by ID."""
    path = _note_path(note_id)
    if path.exists():
        path.unlink()
        return {"success": True, "detail": f"Deleted note {note_id}"}
    else:
        return {"success": False, "detail": f"Note {note_id} not found"}


def execute(params: dict) -> dict:
    """Entry point called by the action router."""
    action = params.get("action", "save")

    if action == "save":
        return save_note(
            content=params.get("content", ""),
            tags=params.get("tags"),
        )
    elif action == "search":
        return search_notes(query=params.get("query", ""))
    elif action == "list":
        return list_recent(limit=params.get("limit", 10))
    elif action == "delete":
        return delete_note(note_id=params.get("note_id", ""))
    else:
        return {"success": False, "detail": f"Unknown notes action: {action}"}
