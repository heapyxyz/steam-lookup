# steam-lookup
`steam-lookup` is an easy-to-use website that lets you lookup Steam profiles.

## Requriements
- Node.js 18.18 or later (from [Next.js docs](https://nextjs.org/docs/app/getting-started/installation#system-requirements))

## Usage
1. **Install NodeJS:**
    - [Windows/macOS](https://nodejs.org/en/download/current)
    - [Linux](https://nodesource.com/products/distributions)

2. **Clone and Open the Project:**
    ```bash
    git clone https://github.com/heapyxyz/steam-lookup
    cd steam-lookup
    ```

3. **Create Environment File:**  
    Rename `.env.example` to `.env` and configure it.

4. **Install Dependencies:**
    ```bash
    npm i
    ```

5. **Build the Project:**
    ```bash
    npm run build
    ```

6. **Start the Project:**
    ```bash
    npm run start
    ```

> [!NOTE]
> If you want to use a different IP or port, head to the `package.json` file and add `-H <IP> -p <PORT>` arguments to the `next start` command.