# ── Stage 1: build React frontend ─────────────────────────────────────────────
FROM node:20-alpine AS frontend-builder

WORKDIR /frontend
COPY frontend/package.json frontend/package-lock.json* ./
RUN npm ci --prefer-offline || npm install
COPY frontend/ .
RUN npm run build

# ── Stage 2: Python / Django ──────────────────────────────────────────────────
FROM python:3.12-slim

# System deps
RUN apt-get update && apt-get install -y --no-install-recommends \
    libpq-dev gcc \
  && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Python dependencies (production-only set)
COPY requirements.prod.txt ./
RUN pip install --no-cache-dir -r requirements.prod.txt

# Copy Django project
COPY . .

# Drop dev requirements file to keep image clean
RUN rm -f requirements.prod.txt

# Copy built frontend bundle into Django's static source directory
COPY --from=frontend-builder /frontend/static/frontend/ frontend/static/frontend/

# Collect static files
RUN python manage.py collectstatic --noinput

EXPOSE 8000

CMD ["sh", "-c", "python manage.py migrate --noinput && gunicorn coffee_shop.wsgi --bind 0.0.0.0:8000 --workers 2 --timeout 120"]
