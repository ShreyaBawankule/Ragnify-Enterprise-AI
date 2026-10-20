# Use a stable, slim Python image for smaller production containers.
FROM python:3.11-slim-bookworm

# Keep Python logs visible in Docker and prevent .pyc files in the image.
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1
ENV PIP_NO_CACHE_DIR=1
ENV PIP_DISABLE_PIP_VERSION_CHECK=1

# Set the application directory inside the container.
WORKDIR /app

# Install system packages required by Whisper/audio processing and health checks.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        build-essential \
        curl \
        ffmpeg \
    && rm -rf /var/lib/apt/lists/*

# Create a non-root user so the API does not run with administrator privileges.
RUN groupadd --system appuser \
    && useradd --system --gid appuser --home-dir /app appuser

# Install Python dependencies first so Docker can cache this layer.
COPY requirements.txt .
RUN python -m pip install --upgrade pip \
    && python -m pip install -r requirements.txt

# Copy the full application after dependencies are installed.
COPY --chown=appuser:appuser . .

# Create runtime directories for uploads, generated files, and logs.
RUN mkdir -p data/audio data/outputs data/temp logs \
    && chown -R appuser:appuser /app

# Run the application as the non-root user created above.
USER appuser

# FastAPI will listen on this port inside the container.
EXPOSE 8000

# Docker uses this to check whether the API is responsive.
HEALTHCHECK --interval=30s --timeout=5s --start-period=30s --retries=3 \
    CMD curl --fail http://localhost:8000/health || exit 1

# Start the production ASGI server.
CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]