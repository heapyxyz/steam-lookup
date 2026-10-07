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
    export PRISMA_SCHEMA_ENGINE_BINARY="${prismaEngines}/bin/schema-engine"
    unset TEMP TMP TEMPDIR TMPDIR
  '';
}
