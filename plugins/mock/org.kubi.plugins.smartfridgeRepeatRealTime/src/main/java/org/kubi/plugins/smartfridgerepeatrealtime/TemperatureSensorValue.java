package org.kubi.plugins.smartfridgerepeatrealtime;

/**
 * Created by jerome on 22/06/15.
 */
public class TemperatureSensorValue {
    private long time;
    private Double temperature;

    public TemperatureSensorValue(double temp, long time) {
        this.temperature =temp;
        this.time = time;
    }

    public long getTime() {
        return time;
    }

    public void setTime(long time) {
        this.time = time;
    }

    public Double getTemperature() {
        return temperature;
    }

    public void setTemperature(Double temperature) {
        this.temperature = temperature;
    }
}
