const express = require("express");
const axios = require("axios").default;
const bodyParser = require("body-parser");

const app = express();
app.use(bodyParser.json());

const PORT = 5003;

/* moderate to flag filtered words */
app.post("/events", async (req, res) => {
  const { type, data } = req.body;

  // moderate comment
  if (type === "CommentCreated") {
    const { content } = data;

    const FILTERED_WORDS = ["terrorism", "racism"];
    const hasFilteredWord = content
      .split(" ")
      .some(word => FILTERED_WORDS.includes(word.toLowerCase()));
    console.log("Has filtered word? ", hasFilteredWord);

    const status = hasFilteredWord ? "rejected" : "approved";

    // handle error in status setting
    if (status !== "rejected" && status !== "approved")
      throw new Error(
        `Comment moderator service error. Status of ${status} is not valid after moderation.  `
      );

    // emit updated comment to event bus
    await axios.post("http://localhost:5005/events", {
      type: "CommentModerated",
      data: {
        ...data,
        status
      }
    });
  }

  res.send("OK");
});

app.listen(PORT, () => {
  console.info(`Moderator Service listening on port ${PORT}!`);
});
