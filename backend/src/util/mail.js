const nodeMailer = require('nodemailer');
const hbs = require('nodemailer-express-handlebars');
const path = require('path');

const transporter = nodeMailer.createTransport({
    host:process.env.MAIL_HOST,
    port:process.env.MAIL_PORT,
    auth:{
        user:process.env.MAIL_USER,
        pass:process.env.MAIL_PASSWORD
    }
});

transporter.use('compile',hbs({
    viewEngine: {
        partialsDir : 'src/resources/mail/',
        defaultLayout: false
    },
    viewPath: 'src/resources/mail/',
    extName: '.hbs',
})); 
    
module.exports = transporter;


