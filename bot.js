const chalk = require("chalk")
const { http, https } = require("follow-redirects");
const collect = require("collect.js");
const DiscordRPC = require("discord-rpc");
const request = require("request");
const delay = require("delay");
const socketio = require("socket.io")(1337);
const notifier = require("node-notifier");

const rpcclientid = "1078993881556865155";
const rpc = new DiscordRPC.Client({ transport: "ipc" });
const config = require("./config.json")

var settings = config.settings;
var maintoken = config.main.token;
var mainchannelid = config.main.channelid;

var timecd = config.settings.cd;
var timehunt = 69000*(1-timecd);
var timework = 309000*(1-timecd);
var timefarm = 609000*(1-timecd);

process.title = "EPIC RPG Farm Bot"

rpc.on("ready", () => {
    console.log(chalk.blue("DISCORD RPG STARTED!"));

    rpc.setActivity({
        details: rpgdetails,
        state: `GnudMad is sleeping...`,
        instance: false,
    });
});

DiscordRPC.register(rpcclientid);

rpc.login({ clientId: rpcclientid }).catch((e) => {
    console.log("Logging...");
});

if(settings.banbypass == "true") {
    global.mainbanc = false;
} else {
    global.mainbanc = true;
}

//------------Check Token------------//
request.get(
    {
        headers: {
            authorization: maintoken,
        },
        url: "https://canary.discord.com/api/v9/users/@me",
    },

    function (error, response, body) {
        var bod = JSON.parse(body);

        if (String(bod.message) === "401: Unauthorized") {
            console.log(
                chalk.red(`Token / ${String(bod.message)} (TOKEN WRONG!)`)
            );
            updateerrorsocket(
                `Main Token / ${String(bod.message)} (TOKEN WRONG!)`
            );
            setTimeout(() => {
                process.exit(0);
            }, 5000);
        } else {
            console.log(chalk.green("Token: Success"));

            setTimeout(() => {
                if(settings.huntrpg == "true") {
                    setTimeout(() => {
                        hunt(maintoken, 1000, mainchannelid);
                    }, 1000);
                    
                    setTimeout(() => {
                        work(maintoken, 2500, mainchannelid);
                    }, 2500);

                    setTimeout(() => {
                        farm(maintoken, 4000, mainchannelid);
                    }, 4000);
                }
            }, 5000)
        }
    }
)

//-------------------HUNT--------------------//
setInterval(() => {

    var timewait = parseInt(rantime());
    if (timewait < 2000) {
        timewait = timewait + 3000;
    } else if (timewait > 6000) {
        timewait = timewait - 3000;
    }

    if (settings.banbypass == "true") {
        bancheck(maintoken, mainchannelid);
    }

    if (settings.huntrpg == "true") {
        if (global.mainbanc) {
            setTimeout(() => {
                hunt(maintoken, timewait, mainchannelid);
            }, timewait);
        }
    }
}, timehunt);

//-------------------WORK--------------------//
setInterval(() => {

    var timewait = parseInt(rantime());
    if (timewait < 2000) {
        timewait = timewait + 3000;
    } else if (timewait > 6000) {
        timewait = timewait - 3000;
    }

    if (settings.banbypass == "true") {
        bancheck(maintoken, mainchannelid);
    }

    if (settings.huntrpg == "true") {
        if (global.mainbanc) {
            setTimeout(() => {
                work(maintoken, timewait, mainchannelid);
            }, timewait);
        }
    }
}, timework);

//-------------------FARM--------------------//
setInterval(() => {

    var timewait = parseInt(rantime());
    if (timewait < 2000) {
        timewait = timewait + 3000;
    } else if (timewait > 6000) {
        timewait = timewait - 3000;
    }

    if (settings.banbypass == "true") {
        bancheck(maintoken, mainchannelid);
    }   

    if (settings.huntrpg == "true") {
        if (global.mainbanc) {
            setTimeout(() => {
                farm(maintoken, timewait, mainchannelid);
            }, timewait);
        }
    }
}, timefarm);

//----------------BANCHECK------------------//
function bancheck(token,channelid) {
    request.get(
        {
            headers: {
                authorization: token,
            },
            url:
                "https://discord.com/api/v9/channels/" +
                channelid +
                "/messages?limit=1",
        },

        function (error, response, body) {
            var bod = JSON.parse(body);
            var cont = bod[0].content;

            if(cont.includes("Select the item") || cont.includes("in the jail")) {
                global.mainbanc = false;
                console.clear();
                console.log(
                    chalk.red(
                        `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                    ) +
                        chalk.magenta(" STATUS:") +
                        chalk.red(" EPIC GUARD!")
                );
                notifier.notify({
                    title: "EPIC GUARD IS COMING!",
                    message: "Do EPIC GUARD and restart the bot!",
                    icon: "./utils/captcha.png",
                    sound: true,
                    wait: true,
                    appID: "EPIC RPG FARM BOT",
                });

                setTimeout(() => {
                    process.exit(0);
                }, 2000);
            } else {
                global.mainbanc = true;
                console.log(
                    chalk.red(
                        `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                    ) +
                        chalk.magenta(" STATUS:") +
                        chalk.green(" Everything is ok!")
                );
                setTimeout(() => {
                    sleepy();
                }, 1000);
            }
        }
    );
}

//---------------FUNCTION-----------------//
function rantime() {
    var s = Math.floor(Math.random()*9);
    if(s == 0)  s = Math.floor(Math.random()*9);
    return s + "000";
}

function nonce() {
    return "1098393848631590" + Math.floor(Math.random() * 9999);
}

function autoseed(token) {
    var seedrandom = require("seedrandom");
    var rng = seedrandom.xor4096(`seedaccess-entropyverror-apiv10.${token}`);
    return rng();
}

function sleepy() {
    console.log(
        chalk.red(
            `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
        ) +
            chalk.magenta(` Waiting... `)
    );
}

//----------------MAIN FEATURES--------------//
function hunt(token, timehunt, channelid) {
    request.post(
        {
            headers: {
                authorization: token,
            },
            url:
                "https://discord.com/api/v9/channels/" +
                channelid +
                "/messages",
            json: {
                content: config.settings.type.hunt,
                nonce: nonce(),
                tts: false,
                flags: 0,
            },
        },
        function (error, response, body) {
            console.log(
                chalk.red(
                    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                ) +
                chalk.blue(" Hunted (" + timehunt + " ms)")
            );
        }
    );
}

function work(token, timework, channelid) {
    request.post(
        {
            headers: {
                authorization: token,
            },
            url:
                "https://discord.com/api/v9/channels/" +
                channelid +
                "/messages",
            json: {
                content: config.settings.type.work,
                nonce: nonce(),
                tts: false,
                flags: 0,
            },
        },
        function (error, response, body) {
            console.log(
                chalk.red(
                    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                ) +
                chalk.blue(" Worked (" + timework + " ms)")
            );
        }
    );
}

function farm(token, timefarm, channelid) {
    request.post(
        {
            headers: {
                authorization: token,
            },
            url:
                "https://discord.com/api/v9/channels/" +
                channelid +
                "/messages",
            json: {
                content: config.settings.type.farm,
                nonce: nonce(),
                tts: false,
                flags: 0,
            },
        },
        function (error, response, body) {
            console.log(
                chalk.red(
                    `${new Date().getHours()}:${new Date().getMinutes()}:${new Date().getSeconds()}`
                ) +
                chalk.blue(" Farmed (" + timefarm + " ms)")
            );
        }
    );
}