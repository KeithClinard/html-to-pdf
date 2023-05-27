# html-to-pdf

Containerized nodejs app that accepts a valid html string as a POST and returns a PDF.

## Prerequisites

- [Node.js](https://nodejs.org/en/download/)

## Building for local development

- `docker build -t html-to-pdf-local .`
- `docker run -p 7071:80 html-to-pdf-local`