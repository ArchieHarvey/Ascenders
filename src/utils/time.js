export const formatDuration = (milliseconds) => {
  if (!Number.isFinite(milliseconds) || milliseconds < 0) {
    return '0s';
  }

  const totalSeconds = Math.floor(milliseconds / 1000);

  if (totalSeconds <= 0) {
    return '0s';
  }

  const units = [
    { label: 'd', value: 24 * 60 * 60 },
    { label: 'h', value: 60 * 60 },
    { label: 'm', value: 60 },
    { label: 's', value: 1 },
  ];

  const parts = [];
  let remaining = totalSeconds;

  for (const unit of units) {
    if (remaining >= unit.value) {
      const amount = Math.floor(remaining / unit.value);
      remaining %= unit.value;
      parts.push(`${amount}${unit.label}`);
    }
  }

  return parts.length ? parts.join(' ') : '0s';
};
