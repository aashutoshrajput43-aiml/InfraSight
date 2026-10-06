import time
import math
import httpx
from typing import Dict, Any, Tuple
from app.core.config import settings

# In-memory cache for location context: key = f"{lat_round}_{lon_round}", value = (context_score, reason, timestamp)
_LOCATION_CACHE: Dict[str, Tuple[float, str, float]] = {}
CACHE_TTL_SECONDS = 3600  # 1 hour

# Prominent Indore landmarks for zero-latency / offline fallback
INDORE_LANDMARKS = [
    {"name": "MY Hospital / Medical College", "lat": 22.7164, "lng": 75.8756, "type": "hospital"},
    {"name": "Bombay Hospital Indore", "lat": 22.7562, "lng": 75.8942, "type": "hospital"},
    {"name": "Choithram Hospital", "lat": 22.6847, "lng": 75.8573, "type": "hospital"},
    {"name": "DAVV Campus / University", "lat": 22.7126, "lng": 75.8789, "type": "school"},
    {"name": "Indore Public School / DAV School", "lat": 22.7295, "lng": 75.8741, "type": "school"},
    {"name": "Daily College Indore", "lat": 22.7090, "lng": 75.8920, "type": "school"},
    {"name": "Rajwada Palace & Heritage Zone", "lat": 22.7186, "lng": 75.8462, "type": "primary_road"},
    {"name": "AB Road Corridor (BRTS)", "lat": 22.7289, "lng": 75.8732, "type": "primary_road"},
    {"name": "Ring Road Indore", "lat": 22.7480, "lng": 75.8900, "type": "primary_road"},
]

def _distance_m(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    R = 6371000.0
    phi1, phi2 = math.radians(lat1), math.radians(lat2)
    delta_phi = math.radians(lat2 - lat1)
    delta_lambda = math.radians(lon2 - lon1)
    a = math.sin(delta_phi/2.0)**2 + math.cos(phi1)*math.cos(phi2)*(math.sin(delta_lambda/2.0)**2)
    return R * (2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a)))

async def get_location_context(lat: float, lng: float) -> Tuple[float, str]:
    """
    Determines location context score (1.0 for school/hospital within 200m,
    0.7 for primary/secondary road within 100m, otherwise 0.4).
    Uses OSM Overpass API with caching, with instant fallback to Indore landmark database.
    """
    cache_key = f"{round(lat, 4)}_{round(lng, 4)}"
    now = time.time()
    if cache_key in _LOCATION_CACHE:
        score, desc, ts = _LOCATION_CACHE[cache_key]
        if now - ts < CACHE_TTL_SECONDS:
            return score, desc

    # First, test known Indore landmarks
    for lm in INDORE_LANDMARKS:
        dist = _distance_m(lat, lng, lm["lat"], lm["lng"])
        if lm["type"] in ("school", "hospital") and dist <= 250:
            result = (1.0, f"Within {int(dist)}m of {lm['name']}")
            _LOCATION_CACHE[cache_key] = (result[0], result[1], now)
            return result
        elif lm["type"] == "primary_road" and dist <= 150:
            result = (0.7, f"Within {int(dist)}m of {lm['name']}")
            _LOCATION_CACHE[cache_key] = (result[0], result[1], now)
            return result

    # Query OSM Overpass API if configured
    if settings.OVERPASS_URL:
        try:
            # Query schools/hospitals within 200m or highway within 100m
            query = f"""
            [out:json][timeout:3];
            (
              node["amenity"~"school|hospital|clinic"](around:200,{lat},{lng});
              way["amenity"~"school|hospital|clinic"](around:200,{lat},{lng});
              way["highway"~"primary|secondary|trunk"](around:100,{lat},{lng});
            );
            out tags;
            """
            async with httpx.AsyncClient(timeout=3.5) as client:
                res = await client.post(settings.OVERPASS_URL, data={"data": query})
                if res.status_code == 200:
                    elements = res.json().get("elements", [])
                    has_institution = any(
                        e.get("tags", {}).get("amenity") in ["school", "hospital", "clinic"]
                        for e in elements
                    )
                    if has_institution:
                        result = (1.0, "Near educational or healthcare institution")
                        _LOCATION_CACHE[cache_key] = (result[0], result[1], now)
                        return result

                    has_primary_road = any(
                        e.get("tags", {}).get("highway") in ["primary", "secondary", "trunk"]
                        for e in elements
                    )
                    if has_primary_road:
                        result = (0.7, "On primary/secondary arterial corridor")
                        _LOCATION_CACHE[cache_key] = (result[0], result[1], now)
                        return result
        except Exception:
            # Overpass timeout or rate-limit -> graceful fallback
            pass

    # Default fallback context
    result = (0.4, "Standard urban municipal zone")
    _LOCATION_CACHE[cache_key] = (result[0], result[1], now)
    return result
