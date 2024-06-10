const AWS = require('aws-sdk');
const ses = new AWS.SES({ region: 'us-east-1' }); // Update to your region

exports.handler = async (event) => {
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
            body: JSON.stringify({ message: 'Message sent successfully!' }),
        };
    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: 'Failed to send message.' }),
        };
    }
};
