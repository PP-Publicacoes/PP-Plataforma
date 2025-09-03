export const typstError = async (proc: Bun.Subprocess, outPdf: string) => {
  // aguarda terminar
  const exitCode = await proc.exited;

  if (exitCode !== 0) {
    // forma simples e segura de ler todo o stderr como string
    // (proc.stderr pode ser undefined se não tivermos usado stderr: "pipe")
    let stderrText = '';

    if (proc.stderr) {
      // Em algumas versões/types do Bun, TypeScript pode não conhecer o método .text()
      // — por isso fazemos uma asserção de tipo segura aqui.
      // Alternativa: se suas types estiverem corretas, você pode usar: await proc.stderr.text()
      stderrText = await (proc.stderr as unknown as { text: () => Promise<string> }).text();
    }

    console.error('Typst falhou (exit code ' + exitCode + '):\n', stderrText);
    throw new Error(`Erro ao compilar com typst (exit ${exitCode})`);
  }

  console.log('PDF gerado:', outPdf);
};

export const bunCommand = (template: string, outPdf: string, data: Record<string, string>) => {
  return Bun.spawn(
    [
      'typst',
      'compile',
      template,
      outPdf,
      ...Object.entries(data).map(([name, path]) => `--input ${name}=${path}`),
    ],
    {
      stderr: 'inherit',
      stdout: 'pipe',
    },
  );
};
