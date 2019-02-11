#!/bin/env bash

echo ""
echo "*****************************************"
echo "*    Installing VSCode extensions...    *"
echo "*****************************************"

code --install-extension eamodio.gitlens
code --install-extension dbaeumer.vscode-eslint
code --install-extension shinnn.stylelint

echo ""
echo "*****************************************"
echo "*    Updating the pre-commit hook       *"
echo "*****************************************"
cp ./scripts/pre-commit ./.git/hooks/pre-commit

echo "Done =)"