"""Normalize incident messages into canonical signatures for matching."""

import re

from unidecode import unidecode


_RE_UUID = re.compile(r"\b[0-9a-f]{8}-(?:[0-9a-f]{4}-){3}[0-9a-f]{12}\b", re.IGNORECASE)
_RE_MAC = re.compile(r"\b[0-9A-F]{2}(?::[0-9A-F]{2}){5}\b", re.IGNORECASE)
_RE_IPV4 = re.compile(r"\b(?:\d{1,3}\.){3}\d{1,3}\b")
_RE_IPV6 = re.compile(r"\b(?:[0-9a-f]{0,4}:){2,7}[0-9a-f]{0,4}\b", re.IGNORECASE)
_RE_EMAIL = re.compile(r"\b[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}\b", re.IGNORECASE)
_RE_HEX = re.compile(r"\b[0-9A-Fa-f]{8,}\b")
_RE_ANGLE_HEX = re.compile(r"\s*0x([0-9A-Fa-f]+)\s*")
_RE_URL = re.compile(r"\b(?:https?|ftp)://[^\s]+|\bwww\.[^\s]+\b", re.IGNORECASE)
_RE_HOST = re.compile(
    r"(?:[A-Za-z0-9-]+\.)+(?:com|net|org|io|co|ai|dev)\b(?!\.[A-Za-z])",
    re.IGNORECASE,
)
_RE_PATH_UNIX = re.compile(r"(?<!\w)(?:/|\./|\.\./|~/)[A-Za-z0-9._/\-]+")
_RE_PATH_WIN = re.compile(r"\b[A-Za-z]:\\[A-Za-z0-9._\\\-]+\b")
_RE_INT = re.compile(r"\b\d+\b")
_RE_FLOAT = re.compile(r"\b\d+\.\d+\b")
_RE_SPACE = re.compile(r"\s+")
_RE_CODEC = re.compile(r"\b(?:avc|h\.?264|hevc|h\.?265|vp9|av1)\b", re.IGNORECASE)
_RE_MS = re.compile(r"\b(\d{2,6})\s*m?s\b", re.IGNORECASE)
_RE_PORT = re.compile(r":(\d{2,5})(\b|/|$)")

_RE_NON_ALPHANUM = re.compile(r"[^A-Za-z0-9]", re.ASCII)
_RE_UNICODE_GARBAGE = re.compile(
    r"\w*[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFD](?:.*[\x00-\x08\x0B\x0C\x0E-\x1F\uFFFD])?\w*",
    re.DOTALL,
)


def _remove_garbage_and_surrounding(s: str) -> str:
    r"""Remove garbage Unicode characters and surrounding alphanumeric tokens.

    Matches patterns like: \\w*<garbage>(?:.*<garbage>)?\\w*
    - Removes single garbage character with adjacent alphanumerics
    - Removes everything from first to last garbage (inclusive) plus adjacent alphanumerics
    - Stops at punctuation/whitespace boundaries

    Parameters
    ----------
    s : str
        Input string that may contain garbage characters

    Returns
    -------
    str
        String with garbage and surrounding tokens removed

    Examples
    --------
    >>> _remove_garbage_and_surrounding("Got o\ufffd5y{valid}")
    'Got {valid}'

    >>> _remove_garbage_and_surrounding("Got \ufffdLw\ufffd\ufffdA\ufffd3\ufffd{valid}")
    'Got {valid}'

    >>> _remove_garbage_and_surrounding("clean text")
    'clean text'

    """
    return _RE_UNICODE_GARBAGE.sub("", s)


def _preserve_first_number_only(s: str) -> str:
    """Keep the first integer and discard all following. Nukes floats."""
    s = _RE_FLOAT.sub("", s)

    numbers = [(match.start(), match.end()) for match in _RE_INT.finditer(s)]

    if not numbers:
        return s

    for i in range(len(numbers) - 1, 0, -1):
        start, end = numbers[i]
        s = s[:start] + s[end:]

    return s


def _remove_all_hex(s: str) -> str:
    """Remove all hex codes from the string."""
    # Remove 0x... format hex codes
    s = _RE_ANGLE_HEX.sub("", s)
    # Remove standalone hex strings (8+ chars)
    s = _RE_HEX.sub("", s)
    return s


def normalize_message(s: str) -> str:
    """Normalize an incident message into a canonical signature.

    Apply a series of regex patterns to strip variable data (UUIDs, IPs,
    paths, etc.), preserve only the first number, remove all hex values, and limit to
    max words. This creates a stable signature for matching similar incidents.

    Returns
    -------
        Normalized signature string, or "unknown incident" if too short
        or empty.

    """
    if len(s) < 3:
        return "unknown incident"

    s = s.strip().lower()

    s = _remove_garbage_and_surrounding(s)

    # Convert unicode to ASCII (café→cafe)
    s = unidecode(s)

    s = _RE_UUID.sub("<uuid>", s)
    s = _RE_MAC.sub("<mac>", s)
    s = _RE_IPV6.sub("", s)
    s = _RE_IPV4.sub("", s)
    s = _RE_EMAIL.sub("<email>", s)
    s = _RE_URL.sub("<url>", s)
    s = _RE_PATH_UNIX.sub("", s)
    s = _RE_PATH_WIN.sub("", s)
    s = _RE_HOST.sub("", s)
    s = _RE_PORT.sub(r"\2", s)
    s = _RE_CODEC.sub("<codec>", s)
    s = _RE_MS.sub("<ms>", s)

    s = _remove_all_hex(s)
    s = _preserve_first_number_only(s)

    s = _RE_NON_ALPHANUM.sub(" ", s)
    s = _RE_SPACE.sub(" ", s).strip()
    s = " ".join(s.split(" ")[: 10])

    if not s:
        s = "unknown incident"

    return s
