# Security Policy

## Supported Versions

| Version | Supported |
|---------|-----------|
| 1.0.x   | ✅ Yes    |

## Reporting a Vulnerability

If you discover a security vulnerability in AeroDemand AI, please do **not** open a public GitHub issue.

Instead, report it privately by emailing:

📧 **gemachistesfaye36@gmail.com**

Please include:
- A description of the vulnerability
- Steps to reproduce it
- Potential impact
- Any suggested fix (optional)

We will respond within **48 hours** and work to release a fix as quickly as possible.

## Security Considerations

This project is an academic demonstration platform. Please note:

- The API has **no authentication** — do not use it to store sensitive data
- The `/export` endpoint streams files directly — do not expose to untrusted users in production
- The model is loaded from `model.pkl` at startup — only use pickle files you generated yourself
- `debug=False` is set in production — never enable debug mode on a public server
