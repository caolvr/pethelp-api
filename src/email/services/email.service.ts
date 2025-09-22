import { Injectable } from '@nestjs/common';
import * as nodemailer from 'nodemailer';

import * as sgMail from '@sendgrid/mail';

sgMail.setApiKey(process.env.SENDGRID_API_KEY as string);

@Injectable()
export class EmailService {
  private transporter;

  constructor() {
    // this.transporter = nodemailer.createTransport({
    //   host: process.env.EMAIL_HOST,
    //   port: 465,
    //   secure: true,
    //   auth: {
    //     user: process.env.EMAIL_USER,
    //     pass: process.env.EMAIL_PASSWORD,
    //   },
    // });
  }

  async sendMail(to: string, subject: string, text: string) {
    const info = await sgMail.send({
      from: '"PETHELP" <carolineolv01@gmail.com>',
      to,
      subject,
      text,
    });

    console.log('E-mail enviado: %s', info[0].headers['x-message-id']);
  }

  async sendForgotPasswordMail(to: string, token: string) {
    const info = await this.transporter.sendMail({
      from: '"PetHelp" <carolineolv01@gmail.com>',
      to,
      subject: 'Recuperação de Senha - PetHelp',
      text: `Crie uma nova senha usando o seguinte link: http://localhost:3001/login/create-password?token=${token}\nEquipe PetHelp`,
    });

    console.log('E-mail enviado: %s', info.messageId);
  }

  async sendCreatePasswordMail(to: string, token: string, nome: string) {
    const info = await this.transporter.sendMail({
      from: '"PetHelp" <carolineolv01@gmail.com>',
      to,
      subject: 'Criação de Senha - PetHelp',
      text: `Olá ${nome},\n\nSua conta foi criada com sucesso na plataforma PetHelp.\nCrie uma senha de acesso: http://localhost:3001/login/create-password?token=${token}\nEquipe PetHelp`,
    });

    console.log('E-mail enviado: %s', info.messageId);
  }
}
