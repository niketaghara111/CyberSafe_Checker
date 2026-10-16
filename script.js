
const urlForm = document.getElementById("url-form");
const urlInput = document.getElementById("url-input");
const urlResult = document.getElementById("url-result");

const passwordForm = document.getElementById("password-form");
const passwordInput = document.getElementById("password-input");
const passwordResult = document.getElementById("password-result");
const strengthBar = document.getElementById("strength-bar");
const strengthLabel = document.getElementById("strength-label");

function showResult(element, message) {
    element.replaceChildren();
    element.textContent = message;
    element.hidden = false;
}

function makeWarning(title, reason, action) {
    return { title, reason, action };
}

function analyzeURL(value) {
    const warnings = [];
    let parsedURL;

    try {
        parsedURL = new URL(value);
    } catch {
        return {
            valid: false,
            message: "Invalid URL. Enter a complete address, such as https://example.com."
        };
    }

    if (!["http:", "https:"].includes(parsedURL.protocol)) {
        return {
            valid: false,
            message: "Unsupported protocol. Use http:// or https://."
        };
    }

    const hostname = parsedURL.hostname.toLowerCase();

    if (parsedURL.protocol === "http:") {
        warnings.push(makeWarning(
            "The link uses HTTP",
            "HTTP does not encrypt the connection. Information sent through an untrusted connection may be exposed.",
            "Verify the official website address and use HTTPS when available. Do not enter sensitive information on an untrusted HTTP site."
        ));
    }

    if (parsedURL.username || parsedURL.password || value.includes("@")) {
        warnings.push(makeWarning(
            "The URL contains an @ symbol or login information",
            "Some URLs use @ to make text before it look like the website name.",
            "Check the actual hostname carefully. If the link came from an unexpected message, do not sign in through it."
        ));
    }

    const isIPv4 = /^(?:\d{1,3}\.){3}\d{1,3}$/.test(hostname);

    if (isIPv4) {
        const octets = hostname.split(".").map(Number);

        if (!octets.every(n => n >= 0 && n <= 255)) {
            return {
                valid: false,
                message: "The IP address in this URL is invalid."
            };
        }

        warnings.push(makeWarning(
            "The website uses a direct IP address",
            "A numeric IP address is used instead of a familiar domain name. This can be suspicious, although legitimate systems can also use IP addresses.",
            "Verify the destination through an official source before sharing information or downloading files."
        ));
    }

    if (hostname.includes("xn--")) {
        warnings.push(makeWarning(
            "The domain contains encoded international characters",
            "Some international characters can look almost identical to characters from another alphabet.",
            "Compare the domain with the organization's official address. Do not rely on appearance alone."
        ));
    }

    if (hostname.length > 50) {
        warnings.push(makeWarning(
            "The hostname is unusually long",
            "Long hostnames can make the website's identity difficult to recognize.",
            "Verify the domain using a trusted source before interacting with the website."
        ));
    }

    const hostParts = hostname.split(".");
    const isIPv6 = hostname.includes(":");
    const isLocalHost = hostname === "localhost";

    if (!isIPv4 && !isIPv6 && !isLocalHost && hostParts.length >= 5) {
        warnings.push(makeWarning(
            "The hostname contains many sections",
            "Multiple subdomains can make a link look like it belongs to a familiar organization.",
            "Identify the actual registered domain before trusting the link. Multiple subdomains alone do not prove malicious activity."
        ));
    }

    const lureWords =
        /(?:login|signin|verify|account|password|wallet|secure|update)/i;

    if (lureWords.test(value)) {
        warnings.push(makeWarning(
            "The URL contains account or security-related words",
            "Words such as login, verify, or password sometimes appear in phishing messages. Legitimate websites can also use these words.",
            "If the link asks you to sign in or verify an account, open the official website using a known address or bookmark."
        ));
    }

    const shorteners = new Set([
        "bit.ly",
        "tinyurl.com",
        "t.co",
        "is.gd",
        "cutt.ly",
        "rb.gy"
    ]);

    if (shorteners.has(hostname)) {
        warnings.push(makeWarning(
            "The link uses a URL-shortening service",
            "Shortened links hide the final destination in the visible address.",
            "Verify who sent the link and inspect its destination using a trusted service before proceeding."
        ));
    }

    const score = Math.min(warnings.length * 20, 100);

    let level;

    if (score >= 60) {
        level = "High";
    } else if (score >= 20) {
        level = "Caution";
    } else {
        level = "No obvious warning";
    }

    return {
        valid: true,
        hostname,
        warnings,
        score,
        level
    };
}

function formatURLResult(result) {
    urlResult.replaceChildren();

    const card = document.createElement("div");
    card.className = "security-report";

    const heading = document.createElement("h3");
    heading.textContent = result.score >= 60
        ? "⚠️ High Risk Warning"
        : result.score >= 20
            ? "⚠️ Security Warning"
            : "✅ No Obvious Warning";

    const score = document.createElement("p");
    score.className = "risk-score";
    score.textContent =
        `Risk indicator: ${result.score}/100 — ${result.level}`;

    const domain = document.createElement("p");
    domain.textContent = `Checked domain: ${result.hostname}`;

    card.append(heading, score, domain);

    if (result.warnings.length === 0) {
        const message = document.createElement("p");
        message.textContent =
            "No warning patterns were detected by these basic rules. This does not prove that the website is safe.";
        card.append(message);
    } else {
        const intro = document.createElement("p");
        intro.textContent = "Why this link deserves attention:";
        card.append(intro);

        const warningList = document.createElement("div");
        warningList.className = "warning-list";

        result.warnings.forEach((warning, index) => {
            const item = document.createElement("section");
            item.className = "warning-item";

            const title = document.createElement("h4");
            title.textContent = `⚠️ ${index + 1}. ${warning.title}`;

            const reason = document.createElement("p");
            reason.textContent = `Why it matters: ${warning.reason}`;

            const action = document.createElement("p");
            action.textContent = `What to do: ${warning.action}`;

            item.append(title, reason, action);
            warningList.append(item);
        });

        card.append(warningList);
    }

    const note = document.createElement("p");
    note.className = "security-note";
    note.textContent =
        "Important: This is a basic rule-based estimate, not a confirmed phishing verdict. Avoid opening suspicious links or entering sensitive information.";

    card.append(note);
    urlResult.append(card);
    urlResult.hidden = false;
}

urlForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const value = urlInput.value.trim();

    if (!value) {
        showResult(urlResult, "Please enter a website URL.");
        return;
    }

    const result = analyzeURL(value);

    if (!result.valid) {
        showResult(urlResult, result.message);
        return;
    }

    formatURLResult(result);
});

// Password Strength Checker

const commonPasswords = new Set([
    "password",
    "password123",
    "123456",
    "12345678",
    "qwerty",
    "admin",
    "letmein",
    "welcome",
    "iloveyou"
]);

function analyzePassword(password) {
    const tips = [];
    const lower = password.toLowerCase();
    const isCommon = commonPasswords.has(lower);
    const repeated = /^(.)\1+$/.test(password);

    const simpleSequence =
        /12345|23456|34567|45678|56789|98765|87654|76543|65432|54321|qwerty|asdfgh|zxcvbn/i
            .test(password);

    const hasLower = /[a-z]/.test(password);
    const hasUpper = /[A-Z]/.test(password);
    const hasNumber = /\d/.test(password);
    const hasSymbol = /[^A-Za-z0-9]/.test(password);

    let score = 0;

    if (password.length >= 8) score += 20;
    if (password.length >= 12) score += 20;
    if (password.length >= 16) score += 20;

    if (hasLower) score += 10;
    if (hasUpper) score += 10;
    if (hasNumber) score += 10;
    if (hasSymbol) score += 10;

    if (isCommon) score = 0;
    if (repeated) score = Math.min(score, 10);
    if (simpleSequence) score = Math.min(score, 30);

    if (password.length < 12) {
        tips.push("Use at least 12 characters; longer is generally better.");
    }

    if (!hasLower || !hasUpper) {
        tips.push("Consider mixing uppercase and lowercase letters.");
    }

    if (!hasNumber) {
        tips.push("Consider including numbers.");
    }

    if (!hasSymbol) {
        tips.push("Consider adding symbols to increase variety.");
    }

    if (isCommon) {
        tips.push("This is a commonly used password. Choose a unique one.");
    }

    if (repeated) {
        tips.push("Avoid using the same character repeatedly.");
    }

    if (simpleSequence) {
        tips.push("Avoid predictable sequences such as 12345 or qwerty.");
    }

    if (tips.length === 0) {
        tips.push("Good indicators. Make sure this password is unique to one account.");
    }

    let rating;

    if (score < 30) {
        rating = "Weak";
    } else if (score < 60) {
        rating = "Fair";
    } else if (score < 80) {
        rating = "Good";
    } else {
        rating = "Strong";
    }

    return { score, rating, tips };
}

function updatePasswordMeter() {
    const password = passwordInput.value;

    if (!password) {
        strengthBar.style.width = "0%";
        strengthBar.style.backgroundColor = "#64748b";
        strengthLabel.textContent = "Strength: Not checked";
        passwordResult.hidden = true;
        return;
    }

    const result = analyzePassword(password);

    strengthBar.style.width = result.score + "%";
    strengthLabel.textContent =
        `Strength: ${result.rating} (${result.score}/100)`;

    if (result.score < 30) {
        strengthBar.style.backgroundColor = "#ef4444";
    } else if (result.score < 60) {
        strengthBar.style.backgroundColor = "#f59e0b";
    } else if (result.score < 80) {
        strengthBar.style.backgroundColor = "#60a5fa";
    } else {
        strengthBar.style.backgroundColor = "#34d399";
    }
}

passwordInput.addEventListener("input", updatePasswordMeter);

passwordForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const password = passwordInput.value;

    if (!password) {
        showResult(passwordResult, "Please enter a test password.");
        updatePasswordMeter();
        return;
    }

    const result = analyzePassword(password);

    const message =
        `Estimated strength: ${result.rating}\n` +
        `Score: ${result.score}/100\n\n` +
        `Suggestions:\n- ${result.tips.join("\n- ")}\n\n` +
        "This is a simple educational estimate, not a security guarantee.";

    showResult(passwordResult, message);
    updatePasswordMeter();
});
