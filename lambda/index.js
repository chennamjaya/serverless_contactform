const AWS = require('aws-sdk');
const cors = require('cors');
const ses = new AWS.SES({ region: 'us-east-1' });

// Initialize the CORS middleware
const corsHandler = cors({
    origin: '*',
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Origin']
});

exports.handler = async (event, context, callback) => {
    console.log("Received event:", JSON.stringify(event, null, 2));

    // Handle CORS preflight request
    if (event.httpMethod === 'OPTIONS') {
        return corsHandler(event, context, () => {
            callback(null, {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin'
                },
                body: ''
            });
        });
    }

    // Handle POST request
    if (event.httpMethod === 'POST') {
        if (!event.body) {
            console.error("Error: No body in the request");
            return {
                statusCode: 400,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin'
                },
                body: JSON.stringify({ message: 'Invalid request, no body found' })
            };
        }

        try {
            const { name, email, message } = JSON.parse(event.body);

            const params = {
                Destination: {
                    ToAddresses: ['chennamjaya@gmail.com'] // Replace with your verified email address
                },
                Message: {
                    Body: {
                        Text: {
                            Charset: 'UTF-8',
                            Data: `Name: ${name}\nEmail: ${email}\nMessage: ${message}`
                        }
                    },
                    Subject: {
                        Charset: 'UTF-8',
                        Data: 'New Contact Form Submission'
                    }
                },
                Source: 'chennamjaya@gmail.com' // Replace with your verified email address
            };

            await ses.sendEmail(params).promise();
            return {
                statusCode: 200,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin'
                },
                body: JSON.stringify({ message: 'Message sent successfully!' })
            };
        } catch (error) {
            console.error("Error sending email:", error);
            return {
                statusCode: 500,
                headers: {
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type, Origin'
                },
                body: JSON.stringify({ message: 'Failed to send message.' })
            };
        }
    }

    return {
        statusCode: 405, // Method Not Allowed
        headers: {
            'Access-Control-Allow-Origin': '*',
            'Access-Control-Allow-Methods': 'POST, OPTIONS',
            'Access-Control-Allow-Headers': 'Content-Type, Origin'
        },
        body: JSON.stringify({ message: 'Method Not Allowed' })
    };
};
