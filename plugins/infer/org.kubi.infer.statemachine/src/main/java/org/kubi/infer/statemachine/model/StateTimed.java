package org.kubi.infer.statemachine.model;

/**
 * Created by jerome on 30/06/15.
 */
public class StateTimed {

    private long timestamp;
    private String state;

    //region Constructors
    public StateTimed(long timestamp, String state) {
        this.timestamp = timestamp;
        this.state = state;
    }

    public StateTimed(String statetimed) {
        String[] data = statetimed.split("--");
        this.timestamp = Long.parseLong(data[0]);
        this.state = data[1];
    }

    //endregion

    //region getters & setters
    public Long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getState() {
        return state;
    }

    public void setState(String state) {
        this.state = state;
    }
    //endregion

    //region equals & hashCode
    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;

        StateTimed that = (StateTimed) o;

        if (timestamp != that.timestamp) return false;
        if (!state.equals(that.state)) return false;

        return true;
    }

    @Override
    public int hashCode() {
        int result = (int) (timestamp ^ (timestamp >>> 32));
        result = 31 * result + state.hashCode();
        return result;
    }
    //endregion
}

