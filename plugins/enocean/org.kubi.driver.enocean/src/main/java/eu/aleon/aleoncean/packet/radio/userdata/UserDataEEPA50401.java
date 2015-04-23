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
package eu.aleon.aleoncean.packet.radio.userdata;

/**
 *
 * @author Markus Rathgeb {@literal <maggu2810@gmail.com>}
 */
public class UserDataEEPA50401 extends UserDataEEPA504 {

    public static final double HUMIDITY_SCALE_MIN = 0;
    public static final double HUMIDITY_SCALE_MAX = 100;

    public static final double TEMPERATURE_SCALE_MIN = 0;
    public static final double TEMPERATURE_SCALE_MAX = 40;

    public UserDataEEPA50401(final byte[] eepData) {
        super(eepData, HUMIDITY_SCALE_MIN, HUMIDITY_SCALE_MAX, TEMPERATURE_SCALE_MIN, TEMPERATURE_SCALE_MAX);
    }

}
