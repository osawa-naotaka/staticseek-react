let pkgs = import <nixpkgs> {};

in pkgs.mkShell rec {
  name = "node-dev";

  buildInputs = with pkgs; [
    git
    nodejs_22
  ];
}
