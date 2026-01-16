# Tarkov Map Web App (CS 4800)

An online 2D map web application that allows users to view the Escape from Tarkov map Customs, interact with markers, and utilize search & filter functionalities to find points of interest.

## Local Development

### Prerequisites

- Node.js
- npm

### Setup

```bash
git clone https://github.com/cs4800TheAdmins/tarkov-quest-intel
cd tarkov-quest-intel
npm install
npm run dev
```

### Data Synchronization

The application uses map marker data from the Tarkov.dev API. To sync the latest marker data:

```bash
npm run sync:map
```

This script fetches the latest Customs map markers from the Tarkov.dev GraphQL API and writes them to [public/maps/markers.customs.json](public/maps/markers.customs.json). Run this command whenever you need to update the marker data with the latest information from the API.

## System Testing

[System Testing Manual](src/test/system-testing-checklist.md)