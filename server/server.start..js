import app from "./server.js";

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`HomeSphere API running at http://localhost:${PORT}`);
  console.log(`  GET  http://localhost:${PORT}/api/entries`);
  console.log(`  GET  http://localhost:${PORT}/api/entries/:id`);
  console.log(`  POST http://localhost:${PORT}/api/contact`);
});
