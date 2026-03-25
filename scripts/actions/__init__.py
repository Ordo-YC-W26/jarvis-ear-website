"""
Action execution engine for Jarvis.

Each action module handles one intent type:
  - slack.py    → send Slack messages
  - github.py   → create issues, PRs
  - calendar.py → create/query calendar events
  - notes.py    → save and search notes locally
  - system.py   → device controls, timers, reminders
"""
