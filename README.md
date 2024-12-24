# Introduction
SteamLookup is an easy-to-use tool for looking up Steam profiles.

## API Endpoints
- `/api/game?id=<APP_ID>` - Returns game's name and app id.  
- `/api/profile?id=<STEAMID64>` - Returns lots of information about profile.  
- `/api/resolve?id=<URL_OR_STEAM_ID>` - Resolves URL/Converts id to SteamID64.

## Usage (Development)
**Rename `.env.example` to `.env` and configure it first!**
```
npm install
npm run dev
```

## Usage (Production)
**Rename `.env.example` to `.env` and configure it first!**  
> [!NOTE]
> By default `npm run start` hosts the website with `0.0.0.0` IP and `80` port.  
> If you want to use a different IP/port - head to [package.json](./package.json) and edit `-H 0.0.0.0` to `-H <IP>` and `-p 80` to `-p <PORT>`.
```
npm install --production
npm run build
npm run start
```
