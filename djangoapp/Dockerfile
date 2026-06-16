# Build environment
FROM python:3.14.3-slim AS builder

## Install pipenv
RUN pip install pipenv

RUN pip install --upgrade pip==26.1.2

WORKDIR /usr/src/app

COPY Pipfile Pipfile.lock ./

## Install dependencies
RUN pipenv install --deploy --system

# Runtime environment
FROM python:3.14.3-slim

WORKDIR /usr/src/app

COPY --from=builder /usr/local/lib/python3.14/site-packages /usr/local/lib/python3.14/site-packages
COPY --from=builder /usr/local/bin /usr/local/bin

## Copy application code
COPY . .

## Run as non-root user
RUN useradd -m appuser
USER appuser

## Set production environment variables
ENV PYTHONUNBUFFERED=1 \
    PYTHONDONTWRITEBYTECODE=1 \
    PYTHONPATH=/app

## Run the development server
CMD ["python", "manage.py", "runserver", "0.0.0.0:8000"]