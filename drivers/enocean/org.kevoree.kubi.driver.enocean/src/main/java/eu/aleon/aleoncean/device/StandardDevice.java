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

import java.util.HashSet;
import java.util.Objects;
import java.util.Set;
import eu.aleon.aleoncean.packet.EnOceanId;
import eu.aleon.aleoncean.packet.RadioPacket;
import eu.aleon.aleoncean.packet.ResponsePacket;
import eu.aleon.aleoncean.packet.radio.userdata.UserData;
import eu.aleon.aleoncean.rxtx.ESP3Connector;

/**
 *
 * @author Markus Rathgeb <maggu2810@gmail.com>
 */
public abstract class StandardDevice implements Device {

    protected final DeviceParameterUpdatedSupport parameterChangedSupport;

    private final ESP3Connector conn;
    private final EnOceanId addressRemote;
    private final EnOceanId addressLocal;

    public StandardDevice(final ESP3Connector conn,
                          final EnOceanId addressRemote,
                          final EnOceanId addressLocal) {
        this.parameterChangedSupport = new DeviceParameterUpdatedSupport(this, true);
        this.conn = conn;
        this.addressRemote = addressRemote;
        this.addressLocal = addressLocal;
    }

    public ESP3Connector getConn() {
        return conn;
    }

    @Override
    public EnOceanId getAddressRemote() {
        return addressRemote;
    }

    @Override
    public EnOceanId getAddressLocal() {
        return addressLocal;
    }

    protected ResponsePacket send(final UserData userData) {
        return send(userData.generateRadioPacket());
    }

    protected ResponsePacket send(final RadioPacket packet) {
        packet.setDestinationId(getAddressRemote());
        packet.setSenderId(getAddressLocal());
        final ResponsePacket response = getConn().write(packet);
        return response;
    }

    @Override
    public int hashCode() {
        int hash = 7;
        hash = 97 * hash + Objects.hashCode(this.conn);
        hash = 97 * hash + Objects.hashCode(this.addressRemote);
        hash = 97 * hash + Objects.hashCode(this.addressLocal);
        return hash;
    }

    @Override
    public boolean equals(final Object obj) {
        if (obj == null) {
            return false;
        }
        if (getClass() != obj.getClass()) {
            return false;
        }
        final StandardDevice other = (StandardDevice) obj;
        if (!Objects.equals(this.conn, other.conn)) {
            return false;
        }
        if (!Objects.equals(this.addressRemote, other.addressRemote)) {
            return false;
        }
        if (!Objects.equals(this.addressLocal, other.addressLocal)) {
            return false;
        }

        return Objects.equals(this.parameterChangedSupport, other.parameterChangedSupport);
    }

    @Override
    public int compareTo(final Device o) {
        int comp;

        if (o == null) {
            return 1;
        }

        if (this.equals(o)) {
            return 0;
        }

        comp = getAddressRemote().compareTo(o.getAddressRemote());
        if (comp != 0) {
            return comp;
        }

        comp = getAddressLocal().compareTo(o.getAddressLocal());
        if (comp != 0) {
            return comp;
        }

        if (getClass() != o.getClass()) {
            return getClass().toString().compareTo(o.getClass().toString());
        }

        throw new UnsupportedOperationException("Not supported yet."); //To change body of generated methods, choose Tools | Templates.
    }

    @Override
    public Set<DeviceParameter> getParameters() {
        final Set<DeviceParameter> params = new HashSet<>();
        fillParameters(params);
        return params;
    }

    @Override
    public Object getByParameter(final DeviceParameter parameter) throws IllegalDeviceParameterException {
        throw new IllegalDeviceParameterException(String.format("Given parameter (%s) is not supported.", parameter));
    }

    @Override
    public void setByParameter(final DeviceParameter parameter, final Object value) throws IllegalDeviceParameterException {
        throw new IllegalDeviceParameterException(String.format("Given parameter (%s) is not supported.", parameter));
    }

    protected abstract void fillParameters(final Set<DeviceParameter> params);

    @Override
    public void addParameterUpdatedListener(final DeviceParameterUpdatedListener listener) {
        parameterChangedSupport.addParameterUpdatedListener(listener);
    }

    @Override
    public void removeParameterUpdatedListener(final DeviceParameterUpdatedListener listener) {
        parameterChangedSupport.removeParameterUpdatedListener(listener);
    }

    protected void fireParameterChanged(final DeviceParameter parameter, final DeviceParameterUpdatedInitiation initiation, final Object oldValue, final Object newValue) {
        parameterChangedSupport.fireParameterUpdated(parameter, initiation, oldValue, newValue);
    }

}
