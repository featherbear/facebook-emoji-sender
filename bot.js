const config = require("./.config.js");
const libfb = require("libfb");
const fs = require("fs");

(async () => {
  let bot;
  try {
    // Login
    bot = new libfb.Client(  {
        selfListen: true,
        // Read session if exists
        session: fs.existsSync(__dirname + "/.appstate.json")
          ? JSON.parse(fs.readFileSync(__dirname + "/.appstate.json", "utf8"))
          : undefined
      });
    
    await bot.login(
      config.facebook_username,
      config.facebook_password
    );
  } catch (err) {
    // Login errors
    let error_title = err.errorData.error_title;
    let error_message = err.errorData.error_message;
    console.error(`Error: ${error_title} - "${error_message}"`);
    process.exit(1);
  }

  // Store session
  fs.writeFileSync(
    __dirname + "/.appstate.json",
    JSON.stringify(bot.getSession())
  );

  bot.id = bot.session.tokens.uid;  
  let messageMap = require("./messageMap.json");

  bot.on("message", async message => {
    if (bot.id == message.authorId) {
      let key = message.message;
      if (key in messageMap) {
        let val = messageMap[key];
        // TODO: Delete message we are replacing
        bot.sendAttachmentFile(message.threadId, "./images/" + val.toString())
      }
    }
  });

  console.info("Loading complete");
  
  let _restartTime = (new Date().setHours(23,59,0,0) - new Date());
  if (_restartTime < 0) _restartTime += 1000*60*60*24;
  setTimeout(function() {
    console.log("Restarting bot... Time is " + new Date());
    process.exit(137);
  }, _restartTime);

})();
