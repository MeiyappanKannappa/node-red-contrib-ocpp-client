const { RPCClient } = require('ocpp-rpc'); var cli;
var simulatedResponse = "";
function triggerHeartBeat(time) { 
    console.log('triggerHeartBeat', time); 
    setInterval(function () { 
        cli.call('Heartbeat', {})
    .then(data => console.log(data))
    .catch(err => console.log(err)); 
}, time) }
function handleEventsFromServer(node, msg) {
    try {
        cli.handle('*', ({ result }) => { console.log("Connection open"); console.log(result); });
        cli.handle('Heartbeat', ({ reply }) => { reply({ currentTime: new Date().toISOString() }); });


    } catch (error) { console.log(error); node.warn(error); }

}

function connectToOCPPServer(node, config, messages, msg) {
    try {
        console.log("connectToOCPPServer");
        // await cli.connect(); console.log("server connected"); cli.connect().then((data1) => { msg.payload = data1; node.warn(msg); node.send([msg, null]); cli.call('BootNotification', { chargePointVendor: config.cpv || "simulator-vendor", chargePointModel: config.cpm || "simulator-model", }).then(data => { console.log('BootNotificationResponse: ', data) node.warn('BootNotificationResponse: ', data) msg.payload = data; node.warn(msg); node.send([msg, null]); }).catch(error => {console.log(error);node.warn(error)}); }).catch(error => {console.log(error);node.warn(error)});

        handleEventsFromServer(node, msg);
    } catch (error) { node.warn(error) }
}
function registerHandlers(msg, node, messages) {
    console.log("Registering OCPP handlers"); cli.handle('ChangeConfiguration', ({ reply, params }) => {
        try { console.log('Server sent Changeconfiguration '); console.log(params); if (params.key == 'HeartBeatInterval') { triggerHeartBeat(params.value); } msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('GetConfiguration', ({ reply, params }) => {
        try { console.log('Server sent Getconfiguration '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply({ configurationKey: [{ key: "EV-NODE-SMILULATOR", readonly: true, value: "dummy" }] }); } catch (error) { console.log(error); }
    });
    cli.handle('ChangeAvailability', ({ reply, params }) => {
        try { console.log('Server got ChangeAvailability '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('CancelReservation', ({ reply, params }) => {
        try { console.log('Server got CancelReservation '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('DataTransfer', ({ reply, params }) => {
        try { console.log('Server got DataTransfer '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted', data: "simulate" }); } catch (error) { console.log(error); }
    }); cli.handle('GetDiagnostics', ({ reply, params }) => {
        try { console.log('Server got GetDiagnostics '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply({ "fileName": "file.txt" }); } catch (error) { console.log(error); }
    }); cli.handle('RemoteStartTransaction', ({ reply, params }) => {
        try { console.log('Server got RemoteStartTransaction '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('RemoteStopTransaction', ({ reply, params }) => {
        try { console.log('Server got RemoteStopTransaction '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('ReserveNow', ({ reply, params }) => {
        try { console.log('Server got ReserveNow '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('Reset', ({ reply, params }) => {
        try { console.log('Server got Reset '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Accepted' }); } catch (error) { console.log(error); }
    }); cli.handle('UnlockConnector', ({ reply, params }) => {
        try { console.log('Server got UnlockConnector '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); console.log(simulatedResponse != "" ? simulatedResponse : { status: 'Unlocked' }); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Unlocked' }); } catch (error) { console.log(error); }
    }); cli.handle('UpdateFirmware', ({ reply, params }) => {
        try { console.log('Server got UpdateFirmware '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Unlocked' }); } catch (error) { console.log(error); }
    }); cli.handle('SendLocalList', ({ reply, params }) => {
        try { console.log('Server got SendLocalList '); console.log(params); msg.payload = params; node.warn(msg); node.send([null, msg]); reply(simulatedResponse != "" ? simulatedResponse : { status: 'Unlocked' }); } catch (error) { console.log(error); }
    });
}
module.exports = function (RED) {
    function OCPPClientNode(config) {
        try {
            RED.nodes.createNode(this, config); var node = this; console.log("OCPPClientNode");
            const messages = new Array(node.outputCount)
            if (config.server == null || config.cbid == null) {
                node.warn("Invalid configurations in ocpp");
            } if (config.password && config.password.length > 0) {
                console.log("Requires authentication "); cli = new RPCClient({
                    endpoint: config.server, identity: config.cbid, // the OCPP identity 
                    protocols: ['ocpp1.6'], // client understands ocpp1.6 subprotocol 
                    password: Buffer.from(config.password, 'utf8'), 
                    strictMode: true, // enable strict validation of requests & responses 
                }); 
            } else { 
                cli = new RPCClient({ 
                    endpoint: config.server, 
                    identity: config.cbid, // the OCPP identity 
                    protocols: ['ocpp1.6'], // client understands ocpp1.6 subprotocol 
                    strictMode: true, // enable strict validation of requests & responses 
                }); 
            }
                    cli.handle('*', ({ result }) => { 
                        console.log("Connection open"); 
                        console.log(result); });

                    node.on('input', function (msg) {
                        node.warn(msg); if (msg.payload == true) { 
                            connectToOCPPServer(node, config, messages, msg) 
                        } else if (msg.payload == false) { 
                            cli.close(); 
                        } else if (msg.payload.BootNotification) { 
                            cli.call('BootNotification', msg.payload.BootNotification)
                            .then(data => { 
                                console.log('BootNotificationResponse: ', data) 
                                node.warn('BootNotificationResponse: ', data) 
                                msg.payload = data; node.send([msg, null]); })
                            .catch(error => { console.log(error); node.warn(error) }); 
                        } else if (msg.payload.DataTransfer) { 
                            cli.call('DataTransfer', msg.payload.DataTransfer)
                            .then(data => { 
                                console.log('DataTransfer: ', data) 
                                node.warn('DataTransfer: ', data) 
                                msg.payload = data; node.send([msg, null]); })
                            .catch(error => { console.log(error); node.warn(error) }); 
                        } // else if (msg.payload.DiagnosticsStatus) { 
                            // cli.call('DiagnosticsStatus', msg.payload.DiagnosticsStatus).then(data => { 
                            // console.log('DiagnosticsStatus: ', data) 
                            // node.warn('DiagnosticsStatus: ', data) 
                            // msg.payload = data; 
                            // node.send ([msg, null]); 
                            // }).catch(error => {console.log(error);node.warn(error)}); 
                            // } else if (msg.payload.FirmwareStatus) { 
                                // cli.call('FirmwareStatus', msg.payload.FirmwareStatus).then(data => { 
                                    // console.log('FirmwareStatus: ', data) 
                                    // node.warn('FirmwareStatus: ', data) 
                                    // msg.payload = data; 
                                    // node.send ([msg, null]); 
                                    // }).catch(error => {console.log(error);node.warn(error)}); 
                                    // } 
                        else if (msg.payload.StatusNotification) { 
                            cli.call('StatusNotification', msg.payload.StatusNotification)
                            .then(data => {
                                 console.log('StatusNotification: ', data) 
                                 node.warn('StatusNotification: ', data) 
                                 msg.payload = data; node.send([msg, null]); })
                            .catch(error => {console.log(error);node.warn(error)}); 
                        } else if (msg.payload.StartTransaction) { 
                            cli.call('StartTransaction', msg.payload.StartTransaction)
                            .then(data => { 
                                console.log('StartTransaction: ', data) 
                                node.warn('StartTransaction: ', data) 
                                msg.payload = data; node.send([msg, null]); })
                            .catch(error => {console.log(error);node.warn(error)}); 
                        } else if (msg.payload.StopTransaction) { 
                            cli.call('StopTransaction', msg.payload.StopTransaction)
                            .then(data => { 
                                console.log('StopTransaction: ', data) 
                                node.warn('StopTransaction: ', data) 
                                msg.payload = data; node.send([msg, null]); })
                            .catch(error => {console.log(error);node.warn(error)}); 
                        } else if (msg.payload.MeterValues) { 
                            cli.call('MeterValues', msg.payload.MeterValues)
                            .then(data => { 
                                console.log('MeterValues: ', data) 
                                node.warn('MeterValues: ', data)
                                msg.payload = data; node.send([msg, null]); })
                            .catch(error => {console.log(error);node.warn(error)}); 
                        }else if(msg.payload.simulateServerResponse){ 
                            simulatedResponse = msg.payload.simulateServerResponse; 
                            console.log('Simulated response accepted ', simulatedResponse) 
                            node.warn('Simulated response accepted ', simulatedResponse)
                         }
                        registerHandlers(msg, node, messages);
                    });
                } catch (error) { node.warn(error) }
            }
            process.on('uncaughtException', function (err) { 
                console.error((new Date).toUTCString() + ' uncaughtException:', err.message) 
                console.error(err.stack) 
            })
            RED.nodes.registerType("ocpp-client", OCPPClientNode);
        }

