export const startUpdateWatcher = (client) => {
  if (!client) {
    return;
  }

  console.info(
    '[updateWatcher] Automatic repository update checks are disabled.',
  );
};
