{
  pkgs ? import <nixpkgs> { },
}:

let
  prismaEngines = pkgs.prisma-engines;
in
with pkgs;
mkShell {
  buildInputs = [
    nodejs_latest
    pnpm
    openssl
    prisma-engines
  ];

  shellHook = ''
    export PRISMA_QUERY_ENGINE_LIBRARY="${prismaEngines}/lib/libquery_engine.node"
    export PRISMA_QUERY_ENGINE_BINARY="${prismaEngines}/bin/query-engine"
    export PRISMA_SCHEMA_ENGINE_BINARY="${prismaEngines}/bin/schema-engine"    
    export PRISMA_FMT_BINARY="${prismaEngines}/bin/prisma-fmt"
    unset TEMP TMP TEMPDIR TMPDIR
  '';
}
