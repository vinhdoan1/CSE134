module.exports = {
  "globDirectory": "build/",
  "globPatterns": [
    "**/*.css",
    "index.html",
    "index.html",
    "login.html",
    "signup.html",
    "signup_invite.html",
    "signup_new.html",
    "js/login.js",
    "js/state.js",
    "images/*",
  ],
  "swSrc": "hw5/sw.js",
  "swDest": "build/sw.js",
  "globIgnores": [
    "../workbox-cli-config.js"
  ],
  "templatedUrls": {
    "/": ["index.html"]
  }
};
