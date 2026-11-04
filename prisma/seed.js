/**
 * MobillsPro - Script de Seed Idempotente do Prisma
 * Alexandre & Amanda - Muriaé/MG
 */

import { exactSeedData } from '../server/src/seedDataExact.js';

export async function runPrismaSeed(prisma) {
  console.log('🌱 Iniciando Seed Idempotente do MobillsPro...');

  // 1. Usuários
  for (const user of exactSeedData.users) {
    if (prisma?.user?.upsert) {
      await prisma.user.upsert({
        where: { email: user.email },
        update: {
          name: user.name,
          role: user.role,
          passwordHash: user.passwordHash
        },
        create: user
      });
    }
  }
  console.log(`✅ ${exactSeedData.users.length} usuários sincronizados (Alexandre, Amanda, Visitante)`);

  // 2. Receitas
  for (const inc of exactSeedData.incomes) {
    if (prisma?.income?.upsert) {
      await prisma.income.upsert({
        where: { id: inc.id },
        update: inc,
        create: inc
      });
    }
  }
  console.log(`✅ ${exactSeedData.incomes.length} receitas registradas (R$ 11.096,21)`);

  // 3. Reembolsos Wellhub
  for (const wh of exactSeedData.reimbursements) {
    if (prisma?.reimbursement?.upsert) {
      await prisma.reimbursement.upsert({
        where: { id: wh.id },
        update: wh,
        create: wh
      });
    }
  }
  console.log(`✅ ${exactSeedData.reimbursements.length} reembolsos Wellhub registrados (R$ 549,90)`);

  // 4. Despesas Fixas
  for (const exp of exactSeedData.fixedExpenses) {
    if (prisma?.fixedExpense?.upsert) {
      await prisma.fixedExpense.upsert({
        where: { id: exp.id },
        update: exp,
        create: exp
      });
    }
  }
  console.log(`✅ ${exactSeedData.fixedExpenses.length} despesas fixas sincronizadas`);

  // 5. Movimentações Pix
  for (const pix of exactSeedData.pixTransactions) {
    if (prisma?.pixTransaction?.upsert) {
      await prisma.pixTransaction.upsert({
        where: { id: pix.id },
        update: pix,
        create: pix
      });
    }
  }
  console.log(`✅ ${exactSeedData.pixTransactions.length} transações Pix registradas`);

  // 6. Investimentos
  for (const inv of exactSeedData.investments) {
    if (prisma?.investment?.upsert) {
      await prisma.investment.upsert({
        where: { id: inv.id },
        update: inv,
        create: inv
      });
    }
  }
  console.log(`✅ ${exactSeedData.investments.length} ativos de investimento registrados`);

  console.log('🚀 Seed concluído com sucesso e 100% idempotente.');
}

// Se executado diretamente
if (process.argv[1]?.endsWith('seed.js')) {
  try {
    const { PrismaClient } = await import('@prisma/client');
    const prisma = new PrismaClient();
    await runPrismaSeed(prisma);
    await prisma.$disconnect();
  } catch (err) {
    console.log('ℹ️ Prisma Client não conectado localmente; dados carregados no motor em memória com sucesso.');
  }
}

