const { exec: _exec } = require("child_process");
const { promisify } = require("util");
const exec = promisify(_exec);
const dotenv = require("dotenv");

dotenv.config();
// use this solution to obscure the connection string in the code
const PROJECT_REF = process.env.PROJECT_REF;

(async () => {
  // const { stdout, stderr } = await exec(
  //   `npx supabase gen types typescript --db-url ${connection_string} --schema public > types/supabase.ts`
  // );
  const { stdout, stderr } = await exec(
    `npx supabase gen types --lang=typescript --project-id="${PROJECT_REF}" --schema=public > types/supabase.ts`,
  );
  console.log(stdout);
  console.error(stderr);
})();
