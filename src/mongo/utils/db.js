const mongoose = require("mongoose");
const config = require("../utils/config");
mongoose
  .connect(
    "mongodb+srv://updev_:admin@user-delevery.pxvf0.mongodb.net/depense_db?retryWrites=true&w=majority",
    // config.dburl,
    {
      useUnifiedTopology: true,
      useNewUrlParser: true,
    }
  )
  .then(() => console.log("DB Connected!"))
  .catch((err) => {
    console.log("DB Connection Error: " + err);
  });
