/*
 This file is part of web3.js.

 web3.js is free software: you can redistribute it and/or modify
 it under the terms of the GNU Lesser General Public License as published by
 the Free Software Foundation, either version 3 of the License, or
 (at your option) any later version.

 web3.js is distributed in the hope that it will be useful,
 but WITHOUT ANY WARRANTY; without even the implied warranty of
 MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 GNU Lesser General Public License for more details.

 You should have received a copy of the GNU Lesser General Public License
 along with web3.js.  If not, see <http://www.gnu.org/licenses/>.
 */
/**
 * @file SignAndSendMethodCommand.js
 * @author Samuel Furter <samuel@ethereum.org>
 * @date 2018
 */

"use strict";

var AbstractSendMethodCommand = require('../../lib/commands/AbstractSendMethodCommand');

/**
 * @param {TransactionConfirmationWorkflow} transactionConfirmationWorkflow
 * @param {TransactionSigner} transactionSigner
 *
 * @constructor
 */
function SignAndSendMethodCommand(transactionConfirmationWorkflow, transactionSigner) {
    AbstractSendCommand.call(this, transactionConfirmationWorkflow);
    this.transactionSigner = transactionSigner;
}

/**
 * TODO: Add gasPrice check
 *
 * Sends the JSON-RPC request and returns an PromiEvent object
 *
 * @method execute
 *
 * @param {AbstractWeb3Object} web3Package
 * @param {AbstractMethodModel} methodModel
 * @param {AbstractProviderAdapter | EthereumProvider} provider
 * @param {Array} parameters
 * @param {Accounts} accounts
 * @param {PromiEvent} promiEvent
 * @param {Function} callback
 *
 * @callback callback callback(error, result)
 * @returns {PromiEvent}
 */
SignAndSendMethodCommand.prototype.execute = function (
    web3Package,
    methodModel,
    provider,
    parameters,
    accounts,
    promiEvent,
    callback
) {
    methodModel.beforeExecution(parameters, web3Package);
    methodModel.rpcMethod = 'eth_sendRawTransaction';

    this.transactionSigner.sign(parameters[0], accounts).then(function(response) {
        self.send(
            methodModel,
            provider,
            promiEvent,
            [response.rawTransaction],
            null,
            callback
        );
    }).catch(function(error) {
        promiEvent.reject(error);
        promiEvent.on('error', error);
        promiEvent.eventEmitter.removeAllListeners();
        callback(error, null);
    });

    return promiEvent;
};

SignAndSendMethodCommand.prototype = Object.create(AbstractSendMethodCommand.prototype);

module.exports = SignAndSendMethodCommand;