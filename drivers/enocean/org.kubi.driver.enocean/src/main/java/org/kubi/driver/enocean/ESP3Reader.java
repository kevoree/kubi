package org.kubi.driver.enocean;

import eu.aleon.aleoncean.packet.ESP3Packet;
import eu.aleon.aleoncean.packet.radio.RadioPacketRPS;
import eu.aleon.aleoncean.packet.radio.userdata.*;
import eu.aleon.aleoncean.rxtx.ESP3Connector;
import eu.aleon.aleoncean.rxtx.ReaderShutdownException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.concurrent.LinkedBlockingQueue;
import java.util.concurrent.TimeUnit;

/**
 * Created by duke on 13/03/15.
 */
public class ESP3Reader implements Runnable {

    private static final Logger LOGGER = LoggerFactory.getLogger(ESP3Reader.class);

    private final ESP3Connector connector;
    private final LinkedBlockingQueue workerQueue;

    public ESP3Reader(final ESP3Connector connector, final LinkedBlockingQueue workerQueue) {
        this.connector = connector;
        this.workerQueue = workerQueue;
    }

    @Override
    public void run() {
        while (true) {
            ESP3Packet packet;
            try {
                packet = connector.read(1000, TimeUnit.DAYS);
            } catch (final ReaderShutdownException ex) {
                // Received indication that the read end was shut down.
                return;
            }
            if (packet == null) {
                LOGGER.warn("Received a null package.");
            } else {

                //workerQueue.add(new WorkerItemPacket(packet));
/*
                if(packet instanceof RadioPacketRPS){
                    UserDataRPS rawRPS = UserDataEEPF60202Factory.getPacketData((RadioPacketRPS) packet);
                    if(rawRPS instanceof UserDataEEPF60202T2N){
                        UserDataEEPF60202T2N rps = (UserDataEEPF60202T2N) UserDataEEPF60202Factory.getPacketData((RadioPacketRPS) packet);
                        System.err.println(rps.dimLightDownA());
                        System.err.println(rps.dimLightUpA());
                        System.err.println(rps.dimLightDownB());
                        System.err.println(rps.dimLightUpB());
                    } else if(rawRPS instanceof UserDataEEPF60202T2U) {
                        UserDataEEPF60202T2U rps = (UserDataEEPF60202T2U) UserDataEEPF60202Factory.getPacketData((RadioPacketRPS) packet);
                        System.err.println(rps);
                    }
                }
*/
                System.err.println(packet);



            }
        }
    }

}