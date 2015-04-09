package org.kubi.fridge.collector;

import lu.snt.zwave.driver.*;
import lu.snt.zwave.protocol.command.ZWaveFactories;
import lu.snt.zwave.protocol.constants.AddNodeInfoStatus;
import lu.snt.zwave.protocol.messages.ZWaveMessage;
import lu.snt.zwave.protocol.messages.app_command.BasicCommandClass;
import lu.snt.zwave.protocol.messages.app_command.MultilevelSensorCommandClass;
import lu.snt.zwave.protocol.messages.app_command.SwitchBinaryCommandClass;
import lu.snt.zwave.protocol.messages.zw_common.ZW_ApplicationCommandHandler;
import lu.snt.zwave.protocol.messages.zw_common.ZW_ApplicationNodeInformation;
import lu.snt.zwave.protocol.messages.zw_controller.ZW_AddNodeToNetwork;
import lu.snt.zwave.utils.ZWCallback;
import org.kevoree.log.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;

/**
 * Created by gnain on 09/04/15.
 */
public class Main implements ZWaveKeyDiscoveryListener {


    private ZWaveKey _zWaveKey;
    private File csv;
    private PrintWriter pr;

    public static void main(String[] args) {
        Log.TRACE();
        final Main m = new Main();

        final ZWaveManager zwaveManager = new ZWaveManager();
        zwaveManager.addZWaveKeyDiscoveryListener(m);
        System.out.println("Start manager");
        zwaveManager.start();

        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                if (m._zWaveKey != null) {
                    m._zWaveKey.disconnect();
                }
                zwaveManager.stop();

                if(m.pr != null) {
                    m.pr.close();
                }
            }
        }));

    }

    public Main() {
        csv = new File("CSV_" + System.currentTimeMillis() + ".csv");
        try {
            pr = new PrintWriter(csv);
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }
    }

    public void zwaveKeyDiscovered(final ZWaveKey zWaveKey) {
        zWaveKey.registerAddNodeCallback(new ZWCallback<ZW_AddNodeToNetwork>() {
            public void on(ZW_AddNodeToNetwork zWaveMessage) {
                System.out.println(zWaveMessage.toString());

                if (zWaveMessage.getStatus() == AddNodeInfoStatus.ADD_NODE_STATUS_PROTOCOL_DONE) {
                    _zWaveKey.submitCommand(ZWaveFactories.admin().zwStopNodeInclusionMode());
                    _zWaveKey.submitCommand(ZWaveFactories.control().associationsAdd(zWaveMessage.getSourceNodeId(), 1, 1));
                    _zWaveKey.submitCommand(ZWaveFactories.control().associationsAdd(zWaveMessage.getSourceNodeId(), 3, 1));
                }
            }
        });

        zWaveKey.registerRemoveNodeCallback(new ZWCallback() {
            public void on(ZWaveMessage zWaveMessage) {
                System.out.println("registerRemoveNodeCallback::" + zWaveMessage.getClass().getName());
                System.out.println(zWaveMessage.toString());
            }
        });

        zWaveKey.registerApplicationNodeInformationCallback(new ZWCallback<ZW_ApplicationNodeInformation>() {
            public void on(ZW_ApplicationNodeInformation zw_applicationNodeInformation) {
                System.out.println(zw_applicationNodeInformation.toString());
            }
        });

        zWaveKey.registerApplicationCommandCallback(new ZWCallback<ZW_ApplicationCommandHandler>() {
            public void on(ZW_ApplicationCommandHandler zw_applicationCommandHandler) {
                System.out.println(zw_applicationCommandHandler.toString());
                pr.print("" + System.currentTimeMillis() + ";" + zw_applicationCommandHandler.getSourceNode() + ";");
                if (zw_applicationCommandHandler instanceof SwitchBinaryCommandClass) {
                    pr.print(Boolean.toString(((SwitchBinaryCommandClass) zw_applicationCommandHandler).isOn()));
                } else if (zw_applicationCommandHandler instanceof MultilevelSensorCommandClass) {
                    MultilevelSensorCommandClass valueUpdate = (MultilevelSensorCommandClass) zw_applicationCommandHandler;
                    float kW = (float) (valueUpdate.getValue() / 3412.142);
                    pr.print(kW);
                } else if (zw_applicationCommandHandler instanceof BasicCommandClass) {
                    pr.print(((BasicCommandClass) zw_applicationCommandHandler).getValue());
                } else {
                    System.out.println("Not supported frame:" + zw_applicationCommandHandler.getClass().getName());
                }
                pr.println(";");
            }
        });

        zWaveKey.addZWaveStateListener(new ZWaveStateListener() {
            public void stateChanged(ZWaveState zWaveState) {
                if (zWaveState == ZWaveState.READY) {
                    if (_zWaveKey == null) {
                        _zWaveKey = zWaveKey;
                        //_zWaveKey.submitCommand(ZWaveFactories.admin().zwReset());
                        //_zWaveKey.submitCommand(ZWaveFactories.admin().zwStartNodeInclusionMode());
                        //_zWaveKey.submitCommand(ZWaveFactories.control().associationsAdd(2,3,1));
                        //_zWaveKey.submitCommand(ZWaveFactories.control().associationsAdd(3,3,1));
                    }
                }
            }
        });
        zWaveKey.connect();
    }
}
