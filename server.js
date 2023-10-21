import express from "express";
import fs from "fs";
import { config } from "dotenv";

config();

const app = express();
const PORT = process.env.PORT || 3000;

let lastCheckIn;
try {
  lastCheckIn = parseInt(fs.readFileSync("last-check-in.txt", "utf-8"));
} catch (error) {
  lastCheckIn = Date.now();
}
const CHECK_IN_INTERVAL = 24 * 60 * 60 * 1000;

app.set("view engine", "ejs");

app.get("/", (_, res) => {
  res.render("index", { CHECK_IN_INTERVAL });
});

app.get("/check-in", (_, res) => {
  lastCheckIn = Date.now();
  fs.writeFileSync("last-check-in.txt", lastCheckIn.toString());
  res.send("Check-in successful!");
});

app.get("/last-check-in", (_, res) => {
  res.send({ timestamp: lastCheckIn });
});

function triggerAction() {
  fs.rm(process.env.DELETE_DIR, { recursive: true, force: true });
}

setInterval(() => {
  if (Date.now() - lastCheckIn > CHECK_IN_INTERVAL) {
    triggerAction();
  }
}, 1000);

app.listen(PORT, () => {
  console.log(`Server running...`);
});
