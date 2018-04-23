const express = require("express");
const app = express();

app.set("PORT", process.env.PORT || 8000);

app.use("/", require("./routes")());

app.listen(app.get("PORT"), () => console.log("Instagram business RSS feed listening on port 3000!"));

