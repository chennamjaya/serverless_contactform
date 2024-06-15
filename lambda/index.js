const AWS = require('aws-sdk');
const SES = new AWS.SES();

exports.handler = async (event) => {
    // Handle preflight OPTIONS requests
    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 204,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
                'Access-Control-Allow-Methods': 'OPTIONS,POST'
            },
            isBase64Encoded: false,
            body: JSON.stringify({ message: 'CORS preflight handled' }),
        };
    }

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
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            },
            isBase64Encoded: false,
            body: JSON.stringify({ message: 'Message sent successfully!' }),
        };
    } catch (error) {
        return {
            statusCode: 500,
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            },
            isBase64Encoded: false,
            body: JSON.stringify({ message: 'Failed to send message', error }),
        };
    }
};
