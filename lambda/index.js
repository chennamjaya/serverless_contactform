const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
const headers = {'Content-Type':'application/json',
    'Access-Control-Allow-Origin':'*',
    'Access-Control-Allow-Methods':'POST,PATCH,OPTIONS'}
    
exports.handler = async (event) => {
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: '',
        };
    }

    const { name, email, message } = JSON.parse(event.body);

    const params = {
        Destination: {
            ToAddresses: ['chennamjaya@gmail.com'], // Replace with your verified email address
        },
        Message: {
            Body: {
                Text: {
                    Charset: 'UTF-8',
                    Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`,
                },
            },
            Subject: {
                Charset: 'UTF-8',
                Data: 'New Contact Form Submission',
            },
        },
        Source: 'chennamjaya@gmail.com', // Replace with your verified email address
    };

    try {
        await ses.sendEmail(params).promise();
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Message sent successfully!' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type',
            },
            body: JSON.stringify({ message: 'Failed to send message.' }),
        };
    }
};
