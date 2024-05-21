import emailjs from '@emailjs/browser';

const serviceId = 'service_hz4jnid';
const templateId = 'template_qptyd19';

const sendEmail = async (name, email, message) => {
    try {
        const response = await emailjs.send(serviceId, templateId, { name, email, message }, {
            publicKey: 'rBtnUxMLM71BMTbBJ',
          });

        if (response.status === 200) {
            console.log('Successfully sent message.');
        }
    } catch (error) {
        console.error('Failed to send email. Error: ', error);
    }
};

export default sendEmail;
