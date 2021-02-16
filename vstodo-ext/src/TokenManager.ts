import * as vscode from "vscode";

export class TokenManager {
  static globalState: vscode.Memento;

  static token = "vstodotoken";

  static setToken(token: string) {
    return this.globalState.update(TokenManager.token, token);
  }

  static getToken() {
    return this.globalState.get(TokenManager.token);
  }
}
