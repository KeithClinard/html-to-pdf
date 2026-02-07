# html-to-pdf

Containerized nodejs app that accepts either a valid html string or a URL as a POST and returns a PDF.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)

## Building for local development

- `docker build -t html-to-pdf-local .`
- `docker run -p 8080:8080 html-to-pdf-local`
