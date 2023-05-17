const fs = require('fs')
const http = require('http')
const url = require('url')

////////////////////////////
// File System

//blocking - sync
// const textIn = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(textIn)

// const textOut = `This is what we know about the  : ${textIn}.\nCreated on ${Date.now()}`
// fs.writeFileSync('./txt/output.txt', textOut);
// console.log('File written')

//not-blocking - async
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2)
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             console.log(data3);

//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('file has been written')
//             })

//         })
//     })
// })
// console.log('reading file async')









/////////////////////////
//Server

//sync ----> easy to handle data as it is run only once when the page is loaded

const replaceTemplate = (temp, product) => {
    let output = temp.replace(/{%PRODUCTNAME%}/g, product.productName) //makes it global
    output = output.replace(/{%IMAGE%}/g, product.image)
    output = output.replace(/{%PRICE%}/g, product.price)
    output = output.replace(/{%FROM%}/g, product.from)
    output = output.replace(/{%NUTRIENTS%}/g, product.nutrients)
    output = output.replace(/{%QUANTITY%}/g, product.quantity)
    output = output.replace(/{%PRODUCTDESCRIPTION%}/g, product.description)
    output = output.replace(/{%ID%}/g, product.id)


    if (product.organic == false) output = output.replace(/{%NOT_ORGANIC%}/g, 'not-organic')
    return output
}

const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');
const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data)

const server = http.createServer((req, res) => {
    const pathName = req.url;

    // console.log(req.url);
    const { query, pathname } = url.parse(req.url, true);
    // console.log(pathname)
    // console.log(url.parse(req.url, true))
    //overview page
    if (pathname === '/' || pathname === '/overview') {
        res.writeHead(200, {
            'Content-type': 'text/html'
        })

        // const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el))
        // console.log(cardsHtml) give an array containing all html strings

        const cardsHtml = dataObj.map(el => replaceTemplate(tempCard, el)).join('')
        // console.log(cardsHtml)
        const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml)


        res.end(output)
    }

    //product page
    else if (pathname === '/product') {
        // console.log(query)
        // res.end('This is Product')
        res.writeHead(200, {
            'Content-type': 'text/html'
        })
        const product = dataObj[query.id];
        const output = replaceTemplate(tempProduct, product)
        res.end(output)
    }

    //api
    else if (pathname === '/api') {

        res.writeHead(200, {
            'Content-type': 'application/json'
        })
        res.end(data)

    }

    //not found
    else {
        res.writeHead(404, {
            'Content-type': 'text/html',
            'My-Own-Header': 'hello-world'
        })
        res.end('<h1>This is page</h1>')
    }

    // res.end('Hello from server')
})



//async
// const server = http.createServer((req, res) => {
//     // console.log(req.url)

//     const pathName = req.url;
//     if (pathName === '/' || pathName === '/overview') {
//         res.end('This is OverView')
//     } else if (pathName === '/product') {
//         res.end('This is Product')
//     } else if (pathName === '/api') {

//         // fs.readFile('./dev-data/data.json' , )  //__dirname ---> current file is running
//         fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
//             const productData = JSON.parse(data) //change JSON to js
//             // console.log(productData)
//             res.writeHead(200, {
//                 'Content-type': 'application/json'
//             })
//             res.end(data)
//         })
//     } else {
//         res.writeHead(404, {
//             'Content-type': 'text/html',
//             'My-Own-Header': 'hello-world'
//         })
//         res.end('<h1>This is page</h1>')
//     }

//     // res.end('Hello from server')
// })

server.listen(8000, '127.0.0.1', () => {
    console.log('server started on port 8000')
})

