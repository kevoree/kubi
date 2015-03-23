/*
 * Copyright (c) 2014 aleon GmbH.
 * All rights reserved. This program and the accompanying materials
 * are made available under the terms of the Eclipse Public License v1.0
 * which accompanies this distribution, and is available at
 * http://www.eclipse.org/legal/epl-v10.html
 *
 * Note for all commercial users of this library:
 * Please contact the EnOcean Alliance (http://www.enocean-alliance.org/)
 * about a possible requirement to become member of the alliance to use the
 * EnOcean protocol implementations.
 *
 * Contributors:
 *    Markus Rathgeb - initial API and implementation and/or initial documentation
 */
package eu.aleon.aleoncean.device;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import eu.aleon.aleoncean.packet.EnOceanId;
import eu.aleon.aleoncean.packet.RadioPacket;
import eu.aleon.aleoncean.packet.radio.RadioPacketRPS;
import eu.aleon.aleoncean.rxtx.ESP3Connector;

/**
 *
 * @author Markus Rathgeb <maggu2810@gmail.com>
 */
public abstract class DeviceRPS extends StandardDevice {

    private static final Logger LOGGER = LoggerFactory.getLogger(DeviceRPS.class);

    public DeviceRPS(final ESP3Connector conn,
                     final EnOceanId addressRemote,
                     final EnOceanId addressLocal) {
        super(conn, addressRemote, addressLocal);
    }

    public abstract void parseRadioPacketRPS(RadioPacketRPS packet);

    @Override
    public void parseRadioPacket(final RadioPacket packet) {
        if (packet instanceof RadioPacketRPS) {
            parseRadioPacketRPS((RadioPacketRPS) packet);
        } else {
            LOGGER.warn("Got something other then 1BS radio packet.");
        }
    }

}
