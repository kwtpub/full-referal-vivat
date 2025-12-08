import { prisma } from '../prisma.singleton.js';

async function makeAdmin(email: string) {
  try {
    const agent = await prisma.agent.update({
      where: { email },
      data: { isAdmin: true },
    });
    console.log(`✅ Пользователь ${agent.name} (${agent.email}) теперь админ`);
  } catch (error) {
    console.error('❌ Ошибка:', error);
  } finally {
    await prisma.$disconnect();
  }
}

// Получаем email из аргументов командной строки
const email = process.argv[2];

if (!email) {
  console.log('Использование: npx ts-node src/scripts/makeAdmin.ts <email>');
  console.log('Пример: npx ts-node src/scripts/makeAdmin.ts admin@example.com');
  process.exit(1);
}

makeAdmin(email);

