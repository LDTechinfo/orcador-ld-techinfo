import { build } from 'vite';

(async () => {
  try {
    await build({
      root: process.cwd(),
      build: {
        outDir: 'dist'
      }
    });
    console.log('Build concluída com sucesso!');
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
})();
