import { Application } from "https://deno.land/x/oak/mod.ts";
import { router } from "./routes.ts";

const port = 5555;
const app = new Application();

app.use(router.routes());
app.use(router.allowedMethods());

app.listen({port});
console.log(`Server is running on http://localhost:${port}/api/ ✔️`)