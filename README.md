# Introduction
SteamLookup is a easy-to-use tool for looking up Steam profiles. Website provides simple info and has a simple API.

# Usage (Development)
**Rename `.env.example` to `.env` and configure it first!**
```
npm install
npm run dev
```

# Usage (Production)
**Rename `.env.example` to `.env` and configure it first!**  
By default `npm run start` hosts a server using `0.0.0.0` IP and `80` port. If you want to use different IP/port - head to [package.json](./package.json) and edit `-H 0.0.0.0` to `-H <IP>` and `-p 80` to `-p <PORT>`.
```
npm install --production
npm run build
npm run start
```