const AWS = require('aws-sdk');
const SES = new AWS.SES();

exports.handler = async (event) => {
    const { name, email, message } = JSON.parse(event.body);

    const params = {
        Source: 'chennamjaya@gmail.com',
        Destination: {
            ToAddresses: ['chj.vaishnavi@gmail.com'],
        },
        Message: {
            Subject: {
                Data: 'New Contact Form Submission',
            },
            Body: {
                Text: {
                    Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
                },
            },
        },
    };

    try {
        await SES.sendEmail(params).promise();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Email sent successfully' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Failed to send email', error }),
        };
    }
};
