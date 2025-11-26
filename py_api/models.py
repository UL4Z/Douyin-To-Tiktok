from sqlalchemy import Column, Integer, String, Text, Boolean, TIMESTAMP, ForeignKey, JSON
from sqlalchemy.sql import func
from .database import Base

class User(Base):
    __tablename__ = 'users'
    
    id = Column(Integer, primary_key=True)
    discord_id = Column(String(255), unique=True)
    discord_username = Column(String(255))
    tiktok_open_id = Column(String(255), unique=True)
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class TikTokToken(Base):
    __tablename__ = 'tiktok_tokens'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    access_token = Column(Text, nullable=False)
    refresh_token = Column(Text)
    expires_at = Column(TIMESTAMP, nullable=False)
    scope = Column(Text)
    created_at = Column(TIMESTAMP, server_default=func.now())

class UserConfig(Base):
    __tablename__ = 'user_configs'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True)
    douyin_sec_uid = Column(String(255))
    rapid_api_key = Column(Text)
    hashtags = Column(JSON, default=[])
    caption_template = Column(Text, default='Check out this video! {hashtags}')
    posting_enabled = Column(Boolean, default=False)
    schedule_type = Column(String(50), default='immediate')
    scheduled_times = Column(JSON, default=[])
    created_at = Column(TIMESTAMP, server_default=func.now())
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class TikTokProfile(Base):
    __tablename__ = 'tiktok_profiles'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'), unique=True)
    display_name = Column(String(255))
    avatar_url = Column(Text)
    follower_count = Column(Integer, default=0)
    following_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    video_count = Column(Integer, default=0)
    bio_description = Column(Text)
    is_verified = Column(Boolean, default=False)
    updated_at = Column(TIMESTAMP, server_default=func.now(), onupdate=func.now())

class AnalyticsSnapshot(Base):
    __tablename__ = 'analytics_snapshots'
    
    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id', ondelete='CASCADE'))
    follower_count = Column(Integer, default=0)
    likes_count = Column(Integer, default=0)
    video_count = Column(Integer, default=0)
    snapshot_date = Column(TIMESTAMP, server_default=func.now())
