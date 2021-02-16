import * as vscode from "vscode";
import { authenticate } from "./authenticate";
import { HelloWorldPanel } from "./HelloWorldPanel";
import { SidebarProvider } from "./SidebarProvider";
import { TokenManager } from "./TokenManager";

export function activate(context: vscode.ExtensionContext) {
  TokenManager.globalState = context.globalState;
  console.log('The "vstodo" extension is now active!');
  const sidebarProvider = new SidebarProvider(context.extensionUri);

  const item = vscode.window.createStatusBarItem(
    vscode.StatusBarAlignment.Right
  );
  item.text = "$(beaker) Add Todo";
  item.command = "vstodo.addTodo";
  item.show();

  context.subscriptions.push(
    vscode.window.registerWebviewViewProvider("vstodo-sidebar", sidebarProvider)
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.helloWorld", () => {
      console.log('"vstodo" jwt', TokenManager.getToken());
      HelloWorldPanel.createOrShow(context.extensionUri);
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.authenticate", () => {
      authenticate();
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.askQuestion", async () => {
      const answer = await vscode.window.showInformationMessage(
        "How was your day",
        "good",
        "bad"
      );

      if (answer === "bad") {
        vscode.window.showInformationMessage("Sorry to hear that.");
      } else {
        console.log({ answer });
      }
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refreshWebview", () => {
      HelloWorldPanel.kill();
      HelloWorldPanel.createOrShow(context.extensionUri);
      setTimeout(
        () =>
          vscode.commands.executeCommand(
            "workbench.action.webview.openDeveloperTools"
          ),
        500
      );
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.refreshSidebar", async () => {
      await vscode.commands.executeCommand("workbench.action.closeSidebar");
      await vscode.commands.executeCommand(
        "workbench.view.extension.vstodo-sidebar-view"
      );
      // comment out dev tools below when not needed
      // setTimeout(
      //   () =>
      //     vscode.commands.executeCommand(
      //       "workbench.action.webview.openDeveloperTools"
      //     ),
      //   500
      // );
    })
  );
  context.subscriptions.push(
    vscode.commands.registerCommand("vstodo.addTodo", () => {
      const { activeTextEditor } = vscode.window;
      if (!activeTextEditor) {
        vscode.window.showInformationMessage("No active text editor");
        return;
      }
      const text = activeTextEditor.document.getText(
        activeTextEditor.selection
      );
      sidebarProvider._view?.webview.postMessage({
        type: "new-todo",
        value: text,
      });
    })
  );
}

export function deactivate() {}
