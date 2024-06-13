const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' });
const cors = require('cors');

app.use(cors({
    origin: "*"
}));

exports.handler = async (event) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    if (event.httpMethod === 'OPTIONS') {
        return {
            statusCode: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type, Origin',
            },
            body: '',
        };
    }

    if (event.httpMethod === 'POST') {
        if (!event.body) {
            console.error("Error: No body in the request");
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin',
                },
                body: JSON.stringify({ message: 'Invalid request, no body found' }),
            };
        }

        try {
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

            await ses.sendEmail(params).promise();
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin',
                },
                body: JSON.stringify({ message: 'Message sent successfully!' }),
            };
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin',
                },
                body: JSON.stringify({ message: 'Failed to send message.' }),
            };
        }
    }

    return {
        statusCode: 405, // Method Not Allowed
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Origin',
        },
        body: JSON.stringify({ message: 'Method Not Allowed' }),
    };
};
