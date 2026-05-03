const getPasswordResetEmailTemplate = (userName, resetLink) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Password Reset</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: 'DM Sans', sans-serif;
                    background-color: #0a0a0f;
                    color: #e2e8f0;
                }

                .wrapper {
                    background-color: #0a0a0f;
                    padding: 48px 16px;
                }

                .container {
                    max-width: 560px;
                    margin: 0 auto;
                    background: #111118;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.07);
                    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
                }

                /* Header */
                .header {
                    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
                    padding: 48px 40px 40px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .header::before {
                    content: '';
                    position: absolute;
                    top: -60px; left: 50%;
                    transform: translateX(-50%);
                    width: 300px; height: 300px;
                    background: radial-gradient(circle, rgba(99,102,241,0.15) 0%, transparent 70%);
                    pointer-events: none;
                }

                .logo-icon {
                    display: inline-flex;
                    align-items: center;
                    justify-content: center;
                    width: 56px; height: 56px;
                    background: linear-gradient(135deg, #6366f1, #8b5cf6);
                    border-radius: 16px;
                    font-size: 26px;
                    margin-bottom: 16px;
                    box-shadow: 0 8px 32px rgba(99,102,241,0.35);
                }

                .logo-text {
                    font-family: 'Syne', sans-serif;
                    font-size: 22px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.5px;
                }

                .logo-sub {
                    font-size: 12px;
                    color: rgba(255,255,255,0.35);
                    letter-spacing: 2px;
                    text-transform: uppercase;
                    margin-top: 4px;
                    font-weight: 300;
                }

                /* Body */
                .body {
                    padding: 40px 40px 32px;
                }

                .tag {
                    display: inline-block;
                    background: rgba(99,102,241,0.12);
                    border: 1px solid rgba(99,102,241,0.25);
                    color: #818cf8;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 20px;
                    margin-bottom: 20px;
                }

                .greeting {
                    font-family: 'Syne', sans-serif;
                    font-size: 26px;
                    font-weight: 700;
                    color: #f1f5f9;
                    line-height: 1.3;
                    margin-bottom: 14px;
                    letter-spacing: -0.5px;
                }

                .message {
                    font-size: 15px;
                    color: rgba(255,255,255,0.5);
                    line-height: 1.7;
                    margin-bottom: 32px;
                    font-weight: 300;
                }

                /* CTA Button */
                .btn-wrap {
                    text-align: center;
                    margin-bottom: 28px;
                }

                .btn {
                    display: inline-block;
                    background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%);
                    color: #ffffff !important;
                    text-decoration: none;
                    font-family: 'Syne', sans-serif;
                    font-size: 15px;
                    font-weight: 600;
                    padding: 14px 36px;
                    border-radius: 12px;
                    letter-spacing: 0.3px;
                    box-shadow: 0 8px 24px rgba(99,102,241,0.4);
                }

                /* Link fallback */
                .link-box {
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.07);
                    border-radius: 10px;
                    padding: 14px 16px;
                    margin-bottom: 28px;
                }

                .link-label {
                    font-size: 11px;
                    color: rgba(255,255,255,0.3);
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    margin-bottom: 6px;
                }

                .link-url {
                    font-size: 12px;
                    color: #818cf8;
                    word-break: break-all;
                    font-family: 'Courier New', monospace;
                }

                /* Warning */
                .warning {
                    display: flex;
                    align-items: flex-start;
                    gap: 12px;
                    background: rgba(245,158,11,0.06);
                    border: 1px solid rgba(245,158,11,0.15);
                    border-radius: 10px;
                    padding: 14px 16px;
                }

                .warning-icon { font-size: 16px; flex-shrink: 0; margin-top: 1px; }

                .warning-text {
                    font-size: 13px;
                    color: rgba(255,255,255,0.4);
                    line-height: 1.6;
                }

                .warning-text strong { color: rgba(245,158,11,0.8); font-weight: 500; }

                /* Divider */
                .divider {
                    height: 1px;
                    background: rgba(255,255,255,0.05);
                    margin: 28px 0;
                }

                /* Footer */
                .footer {
                    background: rgba(0,0,0,0.2);
                    border-top: 1px solid rgba(255,255,255,0.04);
                    padding: 24px 40px;
                    text-align: center;
                }

                .footer p {
                    font-size: 12px;
                    color: rgba(255,255,255,0.2);
                    line-height: 1.6;
                    font-weight: 300;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <div class="logo-icon">📱</div>
                        <div class="logo-text">Message App</div>
                        <div class="logo-sub">Secure Messaging Platform</div>
                    </div>

                    <div class="body">
                        <div class="tag">🔐 Password Reset</div>
                        <h2 class="greeting">Hey ${userName || 'there'},<br>forgot your password?</h2>
                        <p class="message">
                            No worries — it happens to everyone. Click the button below to set a new password. This link is only valid for <strong style="color:rgba(255,255,255,0.6)">10 minutes</strong>.
                        </p>

                        <div class="btn-wrap">
                            <a href="${resetLink}" class="btn">Reset My Password →</a>
                        </div>

                        <div class="link-box">
                            <div class="link-label">Or paste this link in your browser</div>
                            <div class="link-url">${resetLink}</div>
                        </div>

                        <div class="warning">
                            <span class="warning-icon">⚠️</span>
                            <p class="warning-text">
                                <strong>Didn't request this?</strong> You can safely ignore this email. Your password will remain unchanged and this link will expire shortly.
                            </p>
                        </div>
                    </div>

                    <div class="footer">
                        <p>© 2026 Message App · All rights reserved<br>Secure Messaging for Everyone</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};


const getWelcomeEmailTemplate = (userName) => {
    return `
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Welcome to Message App</title>
            <style>
                @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500&display=swap');

                * { margin: 0; padding: 0; box-sizing: border-box; }

                body {
                    font-family: 'DM Sans', sans-serif;
                    background-color: #0a0a0f;
                    color: #e2e8f0;
                }

                .wrapper {
                    background-color: #0a0a0f;
                    padding: 48px 16px;
                }

                .container {
                    max-width: 560px;
                    margin: 0 auto;
                    background: #111118;
                    border-radius: 24px;
                    overflow: hidden;
                    border: 1px solid rgba(255,255,255,0.07);
                    box-shadow: 0 32px 80px rgba(0,0,0,0.6);
                }

                /* Hero Header */
                .header {
                    background: linear-gradient(135deg, #0f0f1a 0%, #1a1a2e 50%, #0f0f1a 100%);
                    padding: 56px 40px 48px;
                    text-align: center;
                    position: relative;
                    overflow: hidden;
                    border-bottom: 1px solid rgba(255,255,255,0.05);
                }

                .header::before {
                    content: '';
                    position: absolute;
                    top: -80px; left: 50%;
                    transform: translateX(-50%);
                    width: 400px; height: 400px;
                    background: radial-gradient(circle, rgba(16,185,129,0.12) 0%, transparent 65%);
                    pointer-events: none;
                }

                .confetti {
                    font-size: 40px;
                    margin-bottom: 20px;
                    display: block;
                }

                .logo-text {
                    font-family: 'Syne', sans-serif;
                    font-size: 28px;
                    font-weight: 800;
                    color: #ffffff;
                    letter-spacing: -0.8px;
                }

                .header-sub {
                    font-size: 13px;
                    color: rgba(255,255,255,0.3);
                    margin-top: 6px;
                    font-weight: 300;
                    letter-spacing: 1px;
                }

                /* Body */
                .body {
                    padding: 40px 40px 32px;
                }

                .tag {
                    display: inline-block;
                    background: rgba(16,185,129,0.1);
                    border: 1px solid rgba(16,185,129,0.2);
                    color: #34d399;
                    font-size: 11px;
                    font-weight: 500;
                    letter-spacing: 1.5px;
                    text-transform: uppercase;
                    padding: 5px 12px;
                    border-radius: 20px;
                    margin-bottom: 20px;
                }

                .greeting {
                    font-family: 'Syne', sans-serif;
                    font-size: 28px;
                    font-weight: 700;
                    color: #f1f5f9;
                    line-height: 1.3;
                    margin-bottom: 14px;
                    letter-spacing: -0.5px;
                }

                .message {
                    font-size: 15px;
                    color: rgba(255,255,255,0.5);
                    line-height: 1.7;
                    margin-bottom: 32px;
                    font-weight: 300;
                }

                /* Feature Cards */
                .features {
                    display: flex;
                    flex-direction: column;
                    gap: 10px;
                    margin-bottom: 32px;
                }

                .feature {
                    display: flex;
                    align-items: center;
                    gap: 14px;
                    background: rgba(255,255,255,0.03);
                    border: 1px solid rgba(255,255,255,0.06);
                    border-radius: 12px;
                    padding: 14px 16px;
                }

                .feature-icon {
                    font-size: 20px;
                    flex-shrink: 0;
                }

                .feature-title {
                    font-family: 'Syne', sans-serif;
                    font-size: 14px;
                    font-weight: 600;
                    color: rgba(255,255,255,0.85);
                    margin-bottom: 2px;
                }

                .feature-desc {
                    font-size: 12px;
                    color: rgba(255,255,255,0.3);
                    font-weight: 300;
                }

                /* Divider */
                .divider {
                    height: 1px;
                    background: rgba(255,255,255,0.05);
                    margin: 28px 0;
                }

                .support {
                    text-align: center;
                    font-size: 13px;
                    color: rgba(255,255,255,0.3);
                    font-weight: 300;
                }

                .support a {
                    color: #818cf8;
                    text-decoration: none;
                }

                /* Footer */
                .footer {
                    background: rgba(0,0,0,0.2);
                    border-top: 1px solid rgba(255,255,255,0.04);
                    padding: 24px 40px;
                    text-align: center;
                }

                .footer p {
                    font-size: 12px;
                    color: rgba(255,255,255,0.2);
                    line-height: 1.6;
                    font-weight: 300;
                }
            </style>
        </head>
        <body>
            <div class="wrapper">
                <div class="container">
                    <div class="header">
                        <span class="confetti">🎉</span>
                        <div class="logo-text">Message App</div>
                        <div class="header-sub">Secure Messaging Platform</div>
                    </div>

                    <div class="body">
                        <div class="tag">✅ Account Created</div>
                        <h2 class="greeting">Welcome aboard,<br>${userName}!</h2>
                        <p class="message">
                            Your account is all set. You're now part of a platform built for fast, private, and reliable messaging. Here's what you can do:
                        </p>

                        <div class="features">
                            <div class="feature">
                                <span class="feature-icon">💬</span>
                                <div>
                                    <div class="feature-title">Real-time Messaging</div>
                                    <div class="feature-desc">Send and receive messages instantly</div>
                                </div>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">🔒</span>
                                <div>
                                    <div class="feature-title">End-to-End Privacy</div>
                                    <div class="feature-desc">Your conversations stay yours</div>
                                </div>
                            </div>
                            <div class="feature">
                                <span class="feature-icon">👥</span>
                                <div>
                                    <div class="feature-title">Connect with Anyone</div>
                                    <div class="feature-desc">Find and message friends easily</div>
                                </div>
                            </div>
                        </div>

                        <div class="divider"></div>

                        <p class="support">Need help getting started? <a href="#">Contact Support</a></p>
                    </div>

                    <div class="footer">
                        <p>© 2026 Message App · All rights reserved</p>
                    </div>
                </div>
            </div>
        </body>
        </html>
    `;
};

module.exports = {
    getPasswordResetEmailTemplate,
    getWelcomeEmailTemplate
};