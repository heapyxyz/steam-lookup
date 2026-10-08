# steam-lookup

`steam-lookup` is an easy-to-use website that lets you lookup Steam profiles.

## Requriements

- [Node.js](https://nodejs.org)
- [pnpm](https://pnpm.io)

## Usage

1. **Create Environment File:**  
   Copy `.env.example` file as `.env` and configure it.

2. **Install Dependencies:**

   ```bash
   pnpm i
   ```

3. **Prepare the Project:**

   ```bash
   # Push the schema to the database
   pnpm prisma db push

   # Generate the database client using the schema
   pnpm prisma generate

   # Build the project
   pnpm run build
   ```

4. **Start the Project:**
   ```bash
   pnpm run start
   ```
