from flask import Flask, request, render_template_string, jsonify, make_response, redirect, session
from flask_cors import CORS
import os
import secrets
import requests
from datetime import datetime, timedelta
from urllib.parse import urlencode
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Import database and models
from .database import SessionLocal, init_db
from .models import User, TikTokToken, TikTokProfile, UserConfig

app = Flask(__name__)
app.secret_key = os.getenv('SESSION_SECRET', secrets.token_hex(32))
CORS(app, supports_credentials=True)

# TikTok OAuth config
TIKTOK_CLIENT_KEY = os.getenv('TIKTOK_CLIENT_KEY')
TIKTOK_CLIENT_SECRET = os.getenv('TIKTOK_CLIENT_SECRET')
TIKTOK_REDIRECT_URI = os.getenv('TIKTOK_REDIRECT_URI')
TIKTOK_AUTH_URL = "https://www.tiktok.com/v2/auth/authorize/"
TIKTOK_TOKEN_URL = "https://open.tiktokapis.com/v2/oauth/token/"
TIKTOK_API_BASE = "https://open.tiktokapis.com/v2"

# Discord OAuth config
DISCORD_CLIENT_ID = os.getenv('DISCORD_CLIENT_ID')
DISCORD_CLIENT_SECRET = os.getenv('DISCORD_CLIENT_SECRET')
DISCORD_REDIRECT_URI = os.getenv('DISCORD_REDIRECT_URI')
DISCORD_AUTH_URL = "https://discord.com/api/oauth2/authorize"
DISCORD_TOKEN_URL = "https://discord.com/api/oauth2/token"
DISCORD_API_BASE = "https://discord.com/api/v10"

# HTML template for OAuth callback (existing)
HTML_TEMPLATE = """
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Authorization Successful</title>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
            background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
            color: #fff;
            min-height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 20px;
        }
        .gradient-bar {
            position: fixed; top: 0; left: 0; right: 0; height: 4px;
            background: linear-gradient(90deg, #00f2ea 0%, #ff0050 100%);
            z-index: 1000;
        }
        .container { width: 100%; max-width: 600px; animation: fadeIn 0.4s ease-out; }
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
        .card {
            background: #1f1f1f; border-radius: 24px; padding: 48px 40px;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            text-align: center; border: 1px solid rgba(255, 255, 255, 0.1);
        }
        .icon { font-size: 64px; margin-bottom: 24px; animation: bounceIn 0.6s ease-out; }
        @keyframes bounceIn {
            0% { transform: scale(0); }
            50% { transform: scale(1.1); }
            100% { transform: scale(1); }
        }
        h1 {
            font-size: 32px; font-weight: 700; margin-bottom: 12px;
            background: linear-gradient(90deg, #00f2ea 0%, #ff0050 100%);
            -webkit-background-clip: text; -webkit-text-fill-color: transparent;
            background-clip: text;
        }
        .subtitle { color: #888; font-size: 16px; margin-bottom: 32px; }
        .btn {
            padding: 16px 32px; border: none; border-radius: 12px;
            font-size: 16px; font-weight: 600; cursor: pointer;
            background: linear-gradient(135deg, #00f2ea 0%, #00b8d4 100%);
            color: #000; transition: all 0.3s ease;
        }
        .btn:hover { transform: translateY(-2px); box-shadow: 0 10px 25px rgba(0, 242, 234, 0.4); }
    </style>
</head>
<body>
    <div class="gradient-bar"></div>
    <div class="container">
        <div class="card">
            <div class="icon">✅</div>
            <h1>Connected Successfully!</h1>
            <p class="subtitle">Redirecting to dashboard...</p>
            <script>
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000);
            </script>
        </div>
    </div>
</body>
</html>
"""

# Routes

@app.route('/')
def home():
    return "DTT API Service Running"

import hashlib
import base64

def generate_code_verifier():
    token = secrets.token_urlsafe(32)
    return token

def generate_code_challenge(verifier):
    m = hashlib.sha256()
    m.update(verifier.encode('utf-8'))
    return base64.urlsafe_b64encode(m.digest()).decode('utf-8').replace('=', '')

@app.route('/api/auth/tiktok')
def tiktok_auth():
    """Initiate TikTok OAuth flow with PKCE"""
    state = secrets.token_urlsafe(32)
    code_verifier = generate_code_verifier()
    code_challenge = generate_code_challenge(code_verifier)
    
    session['oauth_state'] = state
    session['code_verifier'] = code_verifier
    
    params = {
        'client_key': TIKTOK_CLIENT_KEY,
        'scope': 'user.info.basic,user.info.profile,user.info.stats,video.list',
        'response_type': 'code',
        'redirect_uri': TIKTOK_REDIRECT_URI,
        'state': state,
        'code_challenge': code_challenge,
        'code_challenge_method': 'S256'
    }
    
    auth_url = f"{TIKTOK_AUTH_URL}?{urlencode(params)}"
    return redirect(auth_url)

@app.route('/api/auth/tiktok/manual', methods=['POST'])
def tiktok_manual_exchange():
    """Handle manual code exchange (like the bot)"""
    data = request.json
    code = data.get('code')
    
    if not code:
        return jsonify({"error": "Missing code"}), 400
        
    # For manual flow, we use the configured redirect URI (Vercel)
    token_data = {
        'client_key': TIKTOK_CLIENT_KEY,
        'client_secret': TIKTOK_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': TIKTOK_REDIRECT_URI,
    }
    
    # We might not have code_verifier if the user generated the link externally
    # But if they used our link, we might have it. 
    # However, for simplicity in manual mode, we might skip PKCE if TikTok allows it without verifier 
    # OR we assume the user clicked OUR link and we have the verifier.
    code_verifier = session.get('code_verifier')
    if code_verifier:
        token_data['code_verifier'] = code_verifier
    
    response = requests.post(TIKTOK_TOKEN_URL, data=token_data, headers={
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    
    if response.status_code != 200:
        return jsonify({"error": "Token exchange failed", "details": response.json()}), 400
        
    token_info = response.json()
    return handle_token_response(token_info)

def handle_token_response(token_info):
    """Common handler for token response"""
    access_token = token_info.get('access_token')
    refresh_token = token_info.get('refresh_token')
    expires_in = token_info.get('expires_in', 86400)
    open_id = token_info.get('open_id')
    scope = token_info.get('scope')
    
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(tiktok_open_id=open_id).first()
        if not user:
            user = User(tiktok_open_id=open_id)
            db.add(user)
            db.commit()
            db.refresh(user)
        
        # Save token
        token = TikTokToken(
            user_id=user.id,
            access_token=access_token,
            refresh_token=refresh_token,
            expires_at=datetime.now() + timedelta(seconds=expires_in),
            scope=scope
        )
        db.add(token)
        
        # Create default config if not exists
        config = db.query(UserConfig).filter_by(user_id=user.id).first()
        if not config:
            config = UserConfig(user_id=user.id)
            db.add(config)
        
        db.commit()
        
        # Set session
        session['user_id'] = user.id
        session['tiktok_open_id'] = open_id
        
        # Fetch and save profile
        fetch_and_save_profile(user.id, access_token, db)
        
        return jsonify({"success": True, "user_id": user.id})
        
    finally:
        db.close()

@app.route('/api/auth/tiktok/callback')
def tiktok_callback():
    """Handle TikTok OAuth callback"""
    code = request.args.get('code')
    state = request.args.get('state')
    error = request.args.get('error')
    
    if error:
        return jsonify({"error": error}), 400
    
    # Verify state
    if state != session.get('oauth_state'):
        return jsonify({"error": "Invalid state"}), 400
        
    code_verifier = session.get('code_verifier')
    if not code_verifier:
        return jsonify({"error": "Missing code verifier"}), 400
    
    # Exchange code for token
    token_data = {
        'client_key': TIKTOK_CLIENT_KEY,
        'client_secret': TIKTOK_CLIENT_SECRET,
        'code': code,
        'grant_type': 'authorization_code',
        'redirect_uri': TIKTOK_REDIRECT_URI,
        'code_verifier': code_verifier
    }
    
    response = requests.post(TIKTOK_TOKEN_URL, data=token_data, headers={
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    
    if response.status_code != 200:
        return jsonify({"error": "Token exchange failed"}), 400
        
    token_info = response.json()
    handle_token_response(token_info)
    
    return render_template_string(HTML_TEMPLATE)

@app.route('/api/auth/discord')
def discord_auth():
    """Initiate Discord OAuth flow for linking"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
        
    state = secrets.token_urlsafe(32)
    session['discord_oauth_state'] = state
    
    params = {
        'client_id': DISCORD_CLIENT_ID,
        'redirect_uri': DISCORD_REDIRECT_URI,
        'response_type': 'code',
        'scope': 'identify',
        'state': state,
    }
    
    auth_url = f"{DISCORD_AUTH_URL}?{urlencode(params)}"
    return redirect(auth_url)

@app.route('/api/auth/discord/callback')
def discord_callback():
    """Handle Discord OAuth callback"""
    code = request.args.get('code')
    state = request.args.get('state')
    error = request.args.get('error')
    
    if error:
        return jsonify({"error": error}), 400
        
    # Verify state
    if state != session.get('discord_oauth_state'):
        return jsonify({"error": "Invalid state"}), 400
        
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
        
    # Exchange code for token
    data = {
        'client_id': DISCORD_CLIENT_ID,
        'client_secret': DISCORD_CLIENT_SECRET,
        'grant_type': 'authorization_code',
        'code': code,
        'redirect_uri': DISCORD_REDIRECT_URI,
    }
    
    response = requests.post(DISCORD_TOKEN_URL, data=data, headers={
        'Content-Type': 'application/x-www-form-urlencoded'
    })
    
    if response.status_code != 200:
        return jsonify({"error": "Token exchange failed"}), 400
        
    token_data = response.json()
    access_token = token_data.get('access_token')
    
    # Get user info
    user_response = requests.get(f"{DISCORD_API_BASE}/users/@me", headers={
        'Authorization': f"Bearer {access_token}"
    })
    
    if user_response.status_code != 200:
        return jsonify({"error": "Failed to get user info"}), 400
        
    discord_user = user_response.json()
    discord_id = discord_user.get('id')
    discord_username = discord_user.get('username')
    
    # Link to existing user
    db = SessionLocal()
    try:
        user = db.query(User).filter_by(id=user_id).first()
        if user:
            user.discord_id = discord_id
            user.discord_username = discord_username
            db.commit()
    finally:
        db.close()
        
    return render_template_string(HTML_TEMPLATE)

def fetch_and_save_profile(user_id, access_token, db):
    """Fetch TikTok profile and save to database"""
    try:
        headers = {
            'Authorization': f'Bearer {access_token}',
            'Content-Type': 'application/json'
        }
        
        fields = ['open_id', 'display_name', 'avatar_url', 'follower_count', 
                  'following_count', 'likes_count', 'video_count', 'bio_description', 'is_verified']
        
        response = requests.get(
            f"{TIKTOK_API_BASE}/user/info/",
            headers=headers,
            params={'fields': ','.join(fields)}
        )
        
        if response.status_code == 200:
            data = response.json().get('data', {}).get('user', {})
            
            profile = db.query(TikTokProfile).filter_by(user_id=user_id).first()
            if profile:
                # Update existing
                profile.display_name = data.get('display_name')
                profile.avatar_url = data.get('avatar_url')
                profile.follower_count = data.get('follower_count', 0)
                profile.following_count = data.get('following_count', 0)
                profile.likes_count = data.get('likes_count', 0)
                profile.video_count = data.get('video_count', 0)
                profile.bio_description = data.get('bio_description')
                profile.is_verified = data.get('is_verified', False)
                profile.updated_at = datetime.now()
            else:
                # Create new
                profile = TikTokProfile(
                    user_id=user_id,
                    display_name=data.get('display_name'),
                    avatar_url=data.get('avatar_url'),
                    follower_count=data.get('follower_count', 0),
                    following_count=data.get('following_count', 0),
                    likes_count=data.get('likes_count', 0),
                    video_count=data.get('video_count', 0),
                    bio_description=data.get('bio_description'),
                    is_verified=data.get('is_verified', False)
                )
                db.add(profile)
            
            db.commit()
    except Exception as e:
        print(f"Error fetching profile: {e}")

@app.route('/api/user/profile')
def get_user_profile():
    """Get user profile data"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"error": "Not authenticated"}), 401
    
    db = SessionLocal()
    try:
        profile = db.query(TikTokProfile).filter_by(user_id=user_id).first()
        user = db.query(User).filter_by(id=user_id).first()
        
        if not profile:
            return jsonify({"error": "Profile not found"}), 404
        
        return jsonify({
            "display_name": profile.display_name,
            "avatar": profile.avatar_url,
            "follower_count": profile.follower_count,
            "following_count": profile.following_count,
            "likes_count": profile.likes_count,
            "video_count": profile.video_count,
            "bio_description": profile.bio_description,
            "is_verified": profile.is_verified,
            "discord_username": user.discord_username if user else None
        })
    finally:
        db.close()

@app.route('/api/auth/logout', methods=['POST'])
def logout():
    """Logout user"""
    session.clear()
    return jsonify({"success": True})

@app.route('/api/auth/session')
def get_session():
    """Get current session"""
    user_id = session.get('user_id')
    if not user_id:
        return jsonify({"authenticated": False})
    
    return jsonify({
        "authenticated": True,
        "user_id": user_id,
        "tiktok_open_id": session.get('tiktok_open_id')
    })

# Initialize database on startup
with app.app_context():
    try:
        init_db()
        print("✅ Database initialized")
    except Exception as e:
        print(f"⚠️ Database init error: {e}")

if __name__ == '__main__':
    app.run(debug=True, port=5000)
