package org.kubi.zwave.spy;

import lu.snt.zwave.protocol.constants.SensorType;
import lu.snt.zwave.protocol.messages.ZWaveMessage;
import lu.snt.zwave.protocol.messages.app_command.MultilevelSensorCommandClass;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by gnain on 05/10/15.
 */
public class TemperatureExtractor extends RawFilesReader {

    private HashMap<Long, MultilevelSensorCommandClass> records = new HashMap<>();

    public TemperatureExtractor(File folderFile) {
        super(folderFile);
    }

    @Override
    protected void processMessage(long timeStamp, ZWaveMessage m) {

        if (m instanceof MultilevelSensorCommandClass) {
            MultilevelSensorCommandClass almostGoodFrame = (MultilevelSensorCommandClass) m;
            if (almostGoodFrame.getSensorType() == SensorType.TEMPERATURE) {
                records.put(timeStamp, (MultilevelSensorCommandClass) m);
            }
        }

    }

    @Override
    protected void allDone() {

        try {
            SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyy HH:mm:ss");

            File out = new File("out.csv");
            PrintWriter pr = new PrintWriter(out);

            for (Map.Entry<Long, MultilevelSensorCommandClass> entry : records.entrySet()) {

                pr.print(format.format(new Date(entry.getKey())) + ";" + entry.getValue().getSourceNode() + ";");

                double value;
                if (entry.getValue().getSensorType().units(entry.getValue().getScale() & 0xFF) == "F") {
                    value = ((entry.getValue().getValue() * entry.getValue().getPrecision()) - 32) * 5 / 9;
                } else {
                    value = entry.getValue().getValue() * entry.getValue().getPrecision();
                }

                pr.println(("" + value).replace(".", ","));
            }
            pr.flush();
            pr.close();


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

    }
}
