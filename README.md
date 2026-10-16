
# CyberSafe Checker

An educational cybersecurity website for students to inspect suspicious URLs and estimate password strength.

## 1. Project Overview

CyberSafe Checker is a browser-based project built with HTML, CSS, and JavaScript. It helps students learn about common phishing indicators and basic password hygiene.

This is an educational tool, not a professional phishing detection service.

## 2. Features

### Phishing-Link Checker
- Validates URL format.
- Flags HTTP links.
- Detects URLs containing an `@` symbol or embedded credentials.
- Flags valid IPv4 addresses used as hostnames.
- Checks for punycode hostnames.
- Flags unusually long hostnames.
- Flags hostnames with many domain sections.
- Identifies common account-related words in URLs.
- Recognizes selected URL-shortening services.
- Displays a preliminary indicator score and explanations.

### Password-Strength Meter
- Updates the meter while typing.
- Checks password length and character variety.
- Flags selected common passwords.
- Detects repeated characters and selected simple sequences.
- Provides suggestions for improvement.
- Performs analysis in browser-side JavaScript.

### Interface
- Responsive layout for desktop and mobile screens.
- No account or database required.
- No paid API required.

## 3. Technologies Used

- HTML5
- CSS3
- JavaScript
- Browser URL API
- Git for version control

## 4. Requirements

- A modern web browser, such as Google Chrome.
- A text editor, such as Notepad.
- Git is optional for running the website, but useful for version control.

No framework, package installation, database, or build process is required.

## 5. Project Files

- `index.html` — page structure and input fields.
- `style.css` — visual design and responsive layout.
- `script.js` — URL analysis, password scoring, and result messages.
- `README.md` — project documentation.

## 6. How to Run

1. Place all project files in the same folder.
2. Open the project folder.
3. Double-click `index.html`.
4. The website should open in your default browser.
5. Enter a test URL in the phishing checker.
6. Enter a test password in the password meter.

No server is required for the current implementation.

## 7. How URL Analysis Works

The URL checker uses browser-side rules to look for selected patterns.

### Detection rules

1. HTTP protocol: warns that the connection is not encrypted.
2. `@` or embedded credentials: warns that the destination can be confusing.
3. IPv4 hostname: flags a valid numeric IP address as the destination.
4. Punycode hostname: flags domains containing `xn--`.
5. Long hostname: flags hostnames longer than 50 characters.
6. Many hostname sections: flags hostnames with at least five dot-separated sections, subject to the implementation's exclusions.
7. Account-related words: flags terms such as `login`, `verify`, `password`, and `secure`.
8. Shortened URLs: recognizes a predefined list of shortening services.

A URL may trigger more than one rule.

### URL indicator score

The current implementation adds 20 points for each detected warning and caps the score at 100.

- 0 points: No obvious warning
- 20–40 points: Caution
- 60–100 points: High

This is a simple indicator score, not a probability that a URL is malicious.

## 8. How Password Scoring Works

The current implementation uses a basic score from 0 to 100.

### Length points
- At least 8 characters: +20
- At least 12 characters: an additional +20
- At least 16 characters: an additional +20

### Character variety
- Lowercase letters present: +10
- Uppercase letters present: +10
- Numbers present: +10
- Symbols present: +10

The score is capped by the scoring rules for selected weaknesses:
- Selected common passwords receive 0 points.
- A password made entirely of the same character is capped at 10.
- Selected simple sequences cap the score at 30.

### Ratings
- 0–29: Weak
- 30–59: Fair
- 60–79: Good
- 80–100: Strong

The meter also provides suggestions based on length, character variety, common passwords, repeated characters, and selected sequences.

These ratings are estimates, not guarantees of password security. The implementation does not use a comprehensive password dictionary, breach database, or advanced password-strength estimator.

## 9. Security and Privacy Precautions

- Use sample passwords during demonstrations, not real account passwords.
- Password analysis is performed by the page's JavaScript; the current code does not intentionally send the password to a server.
- The application does not intentionally save passwords in local storage or session storage.
- Avoid adding password logging, analytics, or network requests that transmit password values.
- Browser extensions and other software may have their own access; this project cannot guarantee the security of the entire browser environment.
- Do not open suspicious links to test them. Enter their text into the checker instead.
- Never treat a low score or the absence of warnings as proof that a website is safe.
- Verify important links through the organization's official website or a trusted channel.

## 10. Demonstration Test Cases

Use these examples as text inputs only. Do not navigate to suspicious destinations.

### URL tests

| Input | Expected behavior |
| --- | --- |
| Empty input | Requests a URL |
| `abc` | Invalid URL message |
| `ftp://example.com` | Unsupported protocol |
| `https://example.com` | No obvious warning |
| `http://example.com` | HTTP warning |
| `http://192.168.1.10` | IP-host warning |
| `http://999.999.999.999` | Invalid IP message |
| `https://example.com@evil.com` | `@` warning; hostname is `evil.com` |
| `https://bit.ly/example` | Shortener warning |
| `https://login.example.com/verify` | Account-related wording warning |

### Password tests

| Test input | Expected behavior |
| --- | --- |
| Empty input | Requests a password |
| `123456` | Weak |
| `aaaaaaaa` | Weak |
| `password123` | Weak |
| `Hello123` | Weak or Fair according to the implemented score |
| `River!Cloud7Moon#42` | Strong according to the implemented score |

These are demonstration cases, not exhaustive security tests.

## 11. Known Limitations

- No live phishing feeds or reputation APIs.
- No malware scanning or page-content inspection.
- No automatic redirect analysis.
- No guarantee that a URL is safe or malicious.
- The URL score is a heuristic count, not a calibrated risk probability.
- The password score is a simple custom algorithm, not an industry-grade estimator.
- The recognized URL shortener list is limited and may become outdated.
- Domain patterns alone cannot establish malicious intent.

## 12. Future Improvements

Possible future enhancements include:
- A reputable URL reputation service.
- More comprehensive URL parsing and domain validation.
- Automated unit tests.
- A more advanced password-strength estimator.
- Improved accessibility and multilingual explanations.

These improvements are not included in the current version.

## 13. Project Demonstration Checklist

- [ ] Open the website in a browser.
- [ ] Test a normal HTTPS URL.
- [ ] Test an HTTP URL.
- [ ] Test an IP-address URL.
- [ ] Review the explanation for a suspicious pattern.
- [ ] Try common and longer sample passwords.
- [ ] Check desktop and mobile layouts.
- [ ] Verify that the application does not send passwords in network requests.
- [ ] Explain the limitations of heuristic detection.

## 14. Version Control

If Git is installed, use the following commands from the project folder to save the documentation:

```bash
git add README.md
git commit -m "docs: add project guide"
git status
```

## 15. License

This is an educational project. Add a formal license if you intend to distribute or reuse it publicly.
