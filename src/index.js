const config = require("../config.json")
const express = require("express")

const chalk = require("chalk")
const fs = require("node:fs")
const path = require("node:path")

const urlGen = require("./utils/urlGen")

const app = express()
app.use(require("cors")())
app.use(require("express-fileupload")())

app.use(async (req, res, next) => {
    const ip = (req.headers["cf-connecting-ip"] || req.headers["x-forwarded-for"] || req.ip).replace(/^::ffff:/, "");

    console.log(chalk.cyan(`${ip}`), chalk.red("=>"), chalk.yellow(`${req.path}`), chalk.green(`(${req.method})`))

    next()
})

app.post("/", async (req, res) => {

    if(req?.headers?.authorization !== `Bearer ${config.password}`) {
        return res.send("Invalid Password")
    }

    const file = req?.files?.file

    if(!file) return res.send("No File")

    const url = urlGen()
    
    const files = fs.readdirSync("./data")

    for (let i = 0; i < files.length; i++) {
        if(files[i] == url + ".png") {
            return res.send("Error, FileName Taken. Try Again.")
        }
    }

    fs.writeFileSync(`./data/${url + ".png"}`, file.data, "utf-8")

    res.send({
        url: `${req.protocol + '://' + req.get('host') + req.originalUrl}${url}`
    })
})

app.get("/:fileId", async (req, res) => {

    const fileId = req?.params?.fileId

    const fileExists = fs.existsSync(`./data/${fileId + ".png"}`)

    if(!fileExists) {
        res.send("File Does not Exist")
    } else {
        const file = fs.readFileSync(`./data/${fileId + ".png"}`)
        const stats = fs.statSync(`./data/${fileId + ".png"}`)
        res.writeHead(200, {
            'Content-Type': "image/png",
            'Content-Length': stats.size
        })

        res.end(file)
    }

})

app.listen(config.port, async () => {
    console.log(chalk.green("Server Started!"))
})