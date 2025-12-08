import { IsNotEmpty, IsPhoneNumber } from 'class-validator';
import { Agent, Client } from 'generated/prisma';

export class DealCreateDto {
  @IsNotEmpty()
  client: Client;
  @IsNotEmpty()
  agent: Agent;
  @IsPhoneNumber('RU', { message: 'Телефон должен быть российским' })
  phone: string;
}
