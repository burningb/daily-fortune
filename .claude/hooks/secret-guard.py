#!/usr/bin/env python3
"""PreToolUse safety hook: block writing/editing files that contain secret-like
patterns (API keys, tokens, private keys).

- Reads the Claude Code hook payload (JSON) from stdin.
- Scans the content that WOULD be saved (Write.content / Edit.new_string /
  MultiEdit.edits[].new_string).
- If a secret pattern is found, denies the tool call and prints the reason to
  the terminal (stderr). The actual secret is never printed — only which kind.
- Exception: .env files (.env, .env.local, .env.*) are always allowed.
"""

import json
import os
import re
import sys

# (label, compiled regex) — patterns are intentionally specific to reduce
# false positives while covering the requested sk- / AKIA / ghp_ families.
PATTERNS = [
    ("OpenAI/Anthropic 키 (sk-…)", re.compile(r"sk-[A-Za-z0-9_-]{16,}")),
    ("AWS 액세스 키 (AKIA…)", re.compile(r"AKIA[0-9A-Z]{16}")),
    ("GitHub 토큰 (ghp_/gho_/ghu_/ghs_/ghr_…)", re.compile(r"gh[pousr]_[A-Za-z0-9]{20,}")),
    ("GitHub PAT (github_pat_…)", re.compile(r"github_pat_[A-Za-z0-9_]{20,}")),
    ("Slack 토큰 (xox…)", re.compile(r"xox[baprs]-[A-Za-z0-9-]{10,}")),
    ("Google API 키 (AIza…)", re.compile(r"AIza[0-9A-Za-z_-]{20,}")),
    ("개인 키 (PRIVATE KEY 블록)", re.compile(r"-----BEGIN [A-Z ]*PRIVATE KEY-----")),
]


def is_env_file(path: str) -> bool:
    base = os.path.basename(path or "")
    return base == ".env" or base.startswith(".env")


def collect_content(tool_input: dict) -> str:
    parts = []
    if isinstance(tool_input.get("content"), str):  # Write
        parts.append(tool_input["content"])
    if isinstance(tool_input.get("new_string"), str):  # Edit
        parts.append(tool_input["new_string"])
    edits = tool_input.get("edits")  # MultiEdit
    if isinstance(edits, list):
        for e in edits:
            if isinstance(e, dict) and isinstance(e.get("new_string"), str):
                parts.append(e["new_string"])
    return "\n".join(parts)


def main() -> int:
    try:
        data = json.load(sys.stdin)
    except Exception:
        return 0  # can't parse → don't block

    tool_input = data.get("tool_input") or {}
    file_path = tool_input.get("file_path") or tool_input.get("notebook_path") or ""

    # .env 파일은 예외로 허용
    if is_env_file(file_path):
        return 0

    content = collect_content(tool_input)
    if not content:
        return 0

    hits = [label for label, rx in PATTERNS if rx.search(content)]
    if not hits:
        return 0  # 안전 → 통과

    reason = (
        f"🔒 저장 차단: '{file_path}' 에 시크릿으로 보이는 패턴이 감지되었습니다 "
        f"({', '.join(hits)}). API 키·토큰은 코드에 넣지 말고 .env 파일이나 "
        f"환경 변수로 관리하세요. (.env 파일은 이 검사에서 예외입니다.)"
    )

    # 터미널에 사유 표시
    print(reason, file=sys.stderr)

    # 도구 호출 차단
    print(
        json.dumps(
            {
                "hookSpecificOutput": {
                    "hookEventName": "PreToolUse",
                    "permissionDecision": "deny",
                    "permissionDecisionReason": reason,
                }
            }
        )
    )
    return 0


if __name__ == "__main__":
    sys.exit(main())
