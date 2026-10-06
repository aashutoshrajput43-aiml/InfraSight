from typing import Optional
from fastapi import Header, HTTPException, Depends
import httpx
from pydantic import BaseModel
from app.core.config import settings

class CurrentUser(BaseModel):
    id: str
    full_name: str
    role: str  # "citizen" or "admin"
    email: Optional[str] = None

async def get_current_user(
    authorization: Optional[str] = Header(None),
    x_user_role: Optional[str] = Header(None),
    x_user_id: Optional[str] = Header(None),
    x_user_name: Optional[str] = Header(None),
) -> CurrentUser:
    """
    Extracts current authenticated user from Supabase JWT or local dev headers.
    Defaults to demo citizen if unauthenticated to enable frictionless local testing.
    """
    # 1. Check custom dev headers first
    if x_user_role:
        role = x_user_role.lower()
        user_id = x_user_id or ("admin-1" if role == "admin" else "citizen-1")
        name = x_user_name or ("Admin Amit Kumar" if role == "admin" else "Citizen User")
        return CurrentUser(id=user_id, full_name=name, role=role, email=f"{role}@indore.gov.in")

    # 2. Check Supabase JWT if Bearer token is provided
    if authorization and authorization.startswith("Bearer "):
        token = authorization.split(" ")[1]
        if settings.SUPABASE_URL:
            try:
                # Validate with Supabase auth endpoint
                async with httpx.AsyncClient(timeout=5.0) as client:
                    resp = await client.get(
                        f"{settings.SUPABASE_URL}/auth/v1/user",
                        headers={"Authorization": f"Bearer {token}", "apikey": settings.SUPABASE_ANON_KEY}
                    )
                    if resp.status_code == 200:
                        data = resp.json()
                        user_metadata = data.get("user_metadata", {})
                        role = user_metadata.get("role", "citizen")
                        return CurrentUser(
                            id=data.get("id", "citizen-user"),
                            full_name=user_metadata.get("full_name", data.get("email", "Citizen")),
                            role=role,
                            email=data.get("email")
                        )
            except Exception:
                pass

    # 3. Default fallback user (citizen)
    return CurrentUser(
        id="citizen-default",
        full_name="Citizen User",
        role="citizen",
        email="citizen@indore.gov.in"
    )

def require_admin(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    if user.role != "admin":
        raise HTTPException(
            status_code=403,
            detail="Forbidden: Admin role required for this action."
        )
    return user

def require_citizen(user: CurrentUser = Depends(get_current_user)) -> CurrentUser:
    return user
