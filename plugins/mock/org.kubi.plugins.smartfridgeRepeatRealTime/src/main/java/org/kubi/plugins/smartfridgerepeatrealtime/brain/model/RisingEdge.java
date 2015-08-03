package org.kubi.plugins.smartfridgerepeatrealtime.brain.model;

/**
 * Created by jerome on 15/04/15.
 */
public class RisingEdge {
    private long timestamp;
    private float value;

    public RisingEdge() {
        this.timestamp = 0;
        this.value = 0;
    }

    public RisingEdge(long timestamp, float value) {
        this.timestamp = timestamp;
        this.value = value;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public float getValue() {
        return value;
    }

    public void setValue(float value) {
        this.value = value;
    }

    @Override
    public String toString() {
        return "RisingEdge{" +
                "timestamp=" + timestamp +
                ", value=" + value +
                '}';
    }
}
