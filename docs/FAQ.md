# DocuFlux FAQ

### How does DocuFlux handle path aliases like `@/components/*`?
DocuFlux inspects your `tsconfig.json` `compilerOptions.paths` mapping and resolves module specifiers to absolute files.

### Does it require external parsers?
No, DocuFlux includes an internal regex and lexical tokenizer requiring zero npm dependencies.
