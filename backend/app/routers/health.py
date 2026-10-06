from fastapi import APIRouter
from app.core.config import settings

router = APIRouter(tags=["Health"])

@router.get("/health")
def health_check():
    return {
        "status": "healthy",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "mock_ai": settings.MOCK_AI,
        "llm_provider": settings.LLM_PROVIDER,
        "region": "Indore, MP, India"
    }
