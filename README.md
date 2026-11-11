# steam-lookup

`steam-lookup` is an easy-to-use website that lets you lookup Steam profiles.

## Requriements

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)

## Usage

1. **Create environment file:**  
   Copy `.env.example` file as `.env` and configure it.

2. **Install dependencies:**

   ```bash
   pnpm i
   ```

3. **Prepare the project:**

   ```bash
   # Push the schema to the database
   pnpm prisma db push

   # Generate the database client using the schema
   pnpm prisma generate

   # Build the project
   pnpm run build
   ```

4. **Start the project:**
   ```bash
   pnpm run start
   ```
