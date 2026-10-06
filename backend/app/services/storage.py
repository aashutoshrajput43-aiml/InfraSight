import os
import uuid
from pathlib import Path
from fastapi import UploadFile, HTTPException
import httpx
from app.core.config import settings

UPLOAD_DIR = Path(__file__).resolve().parent.parent.parent / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

ALLOWED_EXTENSIONS = {".jpg", ".jpeg", ".png", ".webp"}
MAX_FILE_SIZE = 8 * 1024 * 1024  # 8 MB

async def save_uploaded_image(file: UploadFile) -> str:
    """
    Validates and stores the image file.
    If Supabase Storage is configured, uploads there; otherwise stores locally in /uploads.
    Returns the accessible URL path.
    """
    # 1. Validate file extension
    ext = Path(file.filename or "").suffix.lower()
    if not ext:
        content_type = file.content_type or ""
        if "png" in content_type:
            ext = ".png"
        elif "webp" in content_type:
            ext = ".webp"
        else:
            ext = ".jpg"

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail=f"Invalid file type '{ext}'. Supported formats: JPEG, PNG, WEBP."
        )

    # 2. Read contents and check size
    contents = await file.read()
    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=400,
            detail=f"File exceeds maximum allowed size of 8 MB (received {len(contents) / (1024*1024):.1f} MB)."
        )

    filename = f"{uuid.uuid4().hex}{ext}"

    # 3. Check for Supabase Storage
    if settings.SUPABASE_URL and settings.SUPABASE_SERVICE_KEY:
        try:
            supabase_upload_url = f"{settings.SUPABASE_URL}/storage/v1/object/infrasight-images/{filename}"
            headers = {
                "Authorization": f"Bearer {settings.SUPABASE_SERVICE_KEY}",
                "Content-Type": file.content_type or "image/jpeg",
            }
            async with httpx.AsyncClient(timeout=10.0) as client:
                res = await client.post(supabase_upload_url, content=contents, headers=headers)
                if res.status_code in (200, 201):
                    return f"{settings.SUPABASE_URL}/storage/v1/object/public/infrasight-images/{filename}"
        except Exception:
            # Fall back to local storage
            pass

    # 4. Local storage fallback
    local_path = UPLOAD_DIR / filename
    with open(local_path, "wb") as f:
        f.write(contents)

    return f"/uploads/{filename}"
