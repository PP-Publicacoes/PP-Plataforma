#!/usr/bin/env bun

import { bunCommand, typstError } from '../base';

// build.ts — gera out.pdf a partir de template.typ, data.json e content.md usando Typst
export {}; // torna o arquivo um módulo — permite top-level await e for-await

const jsonPath = './data.json';
const mdPath = './content.md';
const template = 'template.typ';
const outPdf = 'out.pdf';

// comando: typst compile template.typ out.pdf --input data=./data.json --input md=./content.md
const proc = bunCommand(template, outPdf, {
  data: jsonPath,
  md: mdPath,
});
await typstError(proc, outPdf);
