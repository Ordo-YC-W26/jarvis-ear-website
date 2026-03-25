"""
Slack action handler.

Supports:
  - Send a message to a channel or user
  - List channels
  - Check recent messages in a channel

Requires SLACK_BOT_TOKEN env var.
Bot needs scopes: chat:write, channels:read, users:read, im:write
"""
import os
import requests

SLACK_API = "https://slack.com/api"


def get_token() -> str | None:
    return os.environ.get("SLACK_BOT_TOKEN")


def _headers():
    return {
        "Authorization": f"Bearer {get_token()}",
        "Content-Type": "application/json",
    }


def send_message(channel: str, message: str, recipient: str = "") -> dict:
    """
    Send a message to a Slack channel or user.

    Args:
        channel: Channel name (without #) or user ID
        message: Message text
        recipient: Optional @mention to prepend

    Returns:
        {"success": bool, "detail": str}
    """
    token = get_token()
    if not token:
        return {
            "success": True,
            "detail": f"[DRY RUN] Would send to #{channel}: {message}",
            "dry_run": True,
        }

    # If channel is a name, resolve to ID
    channel_id = channel
    if not channel.startswith("C") and not channel.startswith("D"):
        resolved = _resolve_channel(channel)
        if resolved:
            channel_id = resolved
        else:
            # Try as DM — resolve user name to user ID, then open DM
            user_id = _resolve_user(channel)
            if user_id:
                dm = _open_dm(user_id)
                if dm:
                    channel_id = dm

    text = message
    if recipient:
        text = f"<@{recipient}> {message}" if recipient.startswith("U") else f"@{recipient}: {message}"

    resp = requests.post(
        f"{SLACK_API}/chat.postMessage",
        headers=_headers(),
        json={"channel": channel_id, "text": text},
    )
    data = resp.json()

    if data.get("ok"):
        return {"success": True, "detail": f"Sent to #{channel}: {text}"}
    else:
        return {"success": False, "detail": f"Slack error: {data.get('error')}"}


def list_channels(limit: int = 20) -> dict:
    """List public channels the bot is in."""
    token = get_token()
    if not token:
        return {"success": True, "detail": "[DRY RUN] Would list channels", "dry_run": True}

    resp = requests.get(
        f"{SLACK_API}/conversations.list",
        headers=_headers(),
        params={"types": "public_channel", "limit": limit, "exclude_archived": True},
    )
    data = resp.json()

    if data.get("ok"):
        channels = [{"name": c["name"], "id": c["id"]} for c in data["channels"]]
        return {"success": True, "channels": channels}
    else:
        return {"success": False, "detail": f"Slack error: {data.get('error')}"}


def get_recent_messages(channel: str, count: int = 5) -> dict:
    """Get recent messages from a channel."""
    token = get_token()
    if not token:
        return {"success": True, "detail": f"[DRY RUN] Would read #{channel}", "dry_run": True}

    channel_id = _resolve_channel(channel) or channel

    resp = requests.get(
        f"{SLACK_API}/conversations.history",
        headers=_headers(),
        params={"channel": channel_id, "limit": count},
    )
    data = resp.json()

    if data.get("ok"):
        messages = [{"text": m.get("text", ""), "user": m.get("user", "")} for m in data["messages"]]
        return {"success": True, "messages": messages}
    else:
        return {"success": False, "detail": f"Slack error: {data.get('error')}"}


def _resolve_channel(name: str) -> str | None:
    """Resolve channel name to ID."""
    resp = requests.get(
        f"{SLACK_API}/conversations.list",
        headers=_headers(),
        params={"types": "public_channel,private_channel", "limit": 200},
    )
    data = resp.json()
    if data.get("ok"):
        for ch in data["channels"]:
            if ch["name"] == name:
                return ch["id"]
    return None


def _resolve_user(name: str) -> str | None:
    """Resolve a display name or real name to a user ID."""
    resp = requests.get(f"{SLACK_API}/users.list", headers=_headers(), params={"limit": 200})
    data = resp.json()
    if data.get("ok"):
        name_lower = name.lower()
        for user in data["members"]:
            if (
                user.get("name", "").lower() == name_lower
                or user.get("real_name", "").lower() == name_lower
                or user.get("profile", {}).get("display_name", "").lower() == name_lower
            ):
                return user["id"]
    return None


def _open_dm(user_id: str) -> str | None:
    """Open a DM channel with a user."""
    resp = requests.post(
        f"{SLACK_API}/conversations.open",
        headers=_headers(),
        json={"users": user_id},
    )
    data = resp.json()
    if data.get("ok"):
        return data["channel"]["id"]
    return None


def execute(params: dict) -> dict:
    """Entry point called by the action router."""
    action = params.get("action", "send_message")

    if action == "send_message":
        return send_message(
            channel=params.get("channel", "general"),
            message=params.get("message", ""),
            recipient=params.get("recipient", ""),
        )
    elif action == "list_channels":
        return list_channels()
    elif action == "read_messages":
        return get_recent_messages(
            channel=params.get("channel", "general"),
            count=params.get("count", 5),
        )
    else:
        return {"success": False, "detail": f"Unknown Slack action: {action}"}
