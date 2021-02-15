import * as vscode from "vscode";
import { apiBaseUri } from "./constants";
import * as polka from "polka";

export const authenticate = () => {
  const app = polka();
  app.get("/auth/:jwt", (req, res) => {
    const { jwt } = req.params;
    if (!jwt) {
      return res.end(`<h1>Error! NO /auth/:jwt jwt token found</h1>`);
    }
    return res.end(`<h1>Auth was successful you can close this windows</h1>`);
  });

  console.log("app setup");
  app.listen(54321, (err: any) => {
    if (err) {
      vscode.window.showErrorMessage(err.message);
    } else {
      vscode.commands.executeCommand(
        "vscode.open",
        vscode.Uri.parse(`${apiBaseUri}/auth/github`)
      );
    }
  });
};
