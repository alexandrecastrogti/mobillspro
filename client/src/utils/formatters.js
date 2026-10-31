// Formatters for Currency, Dates and Percentages (pt-BR)

export function formatBRL(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return 'R$ 0,00';
  }
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatUSD(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '$ 0.00';
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value);
}

export function formatPercent(value) {
  if (value === null || value === undefined || isNaN(value)) {
    return '0.0%';
  }
  return `${Number(value).toFixed(1)}%`;
}

export function formatDateBR(dateString) {
  if (!dateString) return '-';
  const parts = dateString.split('T')[0].split('-');
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}/${parts[0]}`;
  }
  return dateString;
}

export function formatMonthName(monthString) {
  const map = {
    '2026-05': 'Maio 2026',
    '2026-06': 'Junho 2026',
    '2026-07': 'Julho 2026',
    '2026-08': 'Agosto 2026',
    '2026-09': 'Setembro 2026',
    '2026-10': 'Outubro 2026',
    '2026-11': 'Novembro 2026',
    '2026-12': 'Dezembro 2026'
  };
  return map[monthString] || monthString;
}

