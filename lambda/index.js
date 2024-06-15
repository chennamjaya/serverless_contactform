const AWS = require('aws-sdk');
const SES = new AWS.SES();

exports.handler = async (event) => {
    try {
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

        // Parse the JSON body
        const requestBody = JSON.parse(event.body);

        const { name, email, message } = requestBody;

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
        console.error('Error:', error);

        return {
            statusCode: 400, // Adjust the status code as needed
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Content-Type,Authorization,X-Amz-Date,X-Api-Key,X-Amz-Security-Token',
            },
            isBase64Encoded: false,
            body: JSON.stringify({ message: 'Failed to process request', error }),
        };
    }
};
