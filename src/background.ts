import { Command } from './constants'

function sendCommand(command: Command) {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {
            action: command,
        })
    })
}

chrome.commands.onCommand.addListener(function (command) {
    switch (command) {
        case Command.INSERT_SENTENCE:
            sendCommand(Command.INSERT_SENTENCE)
            break
        case Command.INSERT_PARAGRAPH:
            sendCommand(Command.INSERT_PARAGRAPH)
            break
        default:
            break
    }
})
