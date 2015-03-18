package org.kevoree.kubi.driver.enocean;

import eu.aleon.aleoncean.packet.ESP3Packet;
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
                System.err.println(packet);
                //workerQueue.add(new WorkerItemPacket(packet));
            }
        }
    }

}