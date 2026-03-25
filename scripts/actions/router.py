"""
Action Router — maps intents from the LLM to action handlers.

The LLM returns a JSON intent like:
  {"intent": "send_slack", "params": {"channel": "general", "message": "hello"}}

The router dispatches to the correct action module and returns the result.
"""
from actions import slack, github, calendar, notes


# Maps intent names to (module, default_action)
INTENT_MAP = {
    # Slack
    "send_slack": (slack, "send_message"),
    "read_slack": (slack, "read_messages"),
    "list_slack_channels": (slack, "list_channels"),

    # GitHub
    "create_github_issue": (github, "create_issue"),
    "list_github_issues": (github, "list_issues"),
    "list_github_prs": (github, "list_prs"),
    "search_github": (github, "search_repos"),

    # Calendar
    "set_reminder": (calendar, "create_event"),
    "create_event": (calendar, "create_event"),
    "list_events": (calendar, "list_events"),
    "check_calendar": (calendar, "list_events"),

    # Notes
    "take_note": (notes, "save"),
    "remember": (notes, "save"),
    "search_notes": (notes, "search"),
    "list_notes": (notes, "list"),
}


def route(intent: str, params: dict) -> dict:
    """
    Route an intent to the correct action handler.

    Args:
        intent: The intent string from the LLM (e.g., "send_slack")
        params: The params dict from the LLM

    Returns:
        Result dict from the action handler
    """
    if intent in INTENT_MAP:
        module, default_action = INTENT_MAP[intent]
        # Set default action if not specified in params
        if "action" not in params:
            params["action"] = default_action
        return module.execute(params)

    elif intent == "answer_question":
        # No external action needed — the LLM already provided the answer
        return {
            "success": True,
            "detail": "Question answered via spoken response",
            "no_action": True,
        }

    else:
        return {
            "success": False,
            "detail": f"Unknown intent: {intent}. Supported: {list(INTENT_MAP.keys())}",
        }


def list_capabilities() -> list[str]:
    """Return list of all supported intents."""
    return sorted(set(list(INTENT_MAP.keys()) + ["answer_question"]))
