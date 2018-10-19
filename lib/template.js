module.exports = {
    HTML: function (title, list, body, link, auth) {
        return `
        <!DOCTYPE html>
        <html>
        <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <meta http-equiv="X-UA-Compatible" content="ie=edge">
        <title>WEB1- ${title}</title>
        </head>
        <body>
        ${auth}
        <h1><a href="/">WEB</a></h1>
        ${list}
        <p>${link}</p>
        <h2>${title}</h2>
        <p>${body}</p>
        </body>
        </html>
        `
    }, List: function (filelist) {
        var list = '<ul>';
        var i = 0;
        while (i < filelist.length) {
            list += `<li><a href="/topic/${filelist[i].id}">${filelist[i].title}</a></li>`;
            i++;
        }
        list += '</ul>';
        return list;
    }

}

