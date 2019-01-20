const request = require('request-promise')
const cheerio = require('cheerio')
const ObjectsToCsv = require('objects-to-csv')

const url = "https://economia.uol.com.br/cotacoes/bolsas/"

/*
    $('.dadosRankings').each((index,element)=>{
	console.log($(element).children(".title").text())
    })
*/
var writeCSV = async (data) => {
    let csv = new ObjectsToCsv(data);
    await csv.toDisk('./test.csv',{ append: true });

}
const scrapeResults = []

async function scrapeCotacao() {
    try {
        const htmlResult = await request.get(url)
        const $ = await cheerio.load(htmlResult)
        $('.dadosRankings').each((index,element)=>{
            const title = $(element).children(".title").text()
            const updown = $(element).children(".up").text() + $(element).children(".down").text()
            valor = $(element).children("td").text().split("R$")[1]
            const scrapeData = {title, updown, valor}
            scrapeResults.push(scrapeData)
        })


        console.log( scrapeResults)

        writeCSV(scrapeResults)

    }catch (err){
        console.error(err)
    }
};

scrapeCotacao();