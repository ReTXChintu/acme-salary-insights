import { app } from "./app.js";

const port = Number(process.env.PORT ?? 3000);

app.listen(port, () => {
  console.log(`ACME Salary Insights API listening on port ${port}`);
});
