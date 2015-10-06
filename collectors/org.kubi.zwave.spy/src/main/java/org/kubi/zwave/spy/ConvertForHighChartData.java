package org.kubi.zwave.spy;

import lu.snt.zwave.protocol.constants.SensorType;
import lu.snt.zwave.protocol.messages.ZWaveMessage;
import lu.snt.zwave.protocol.messages.app_command.BasicCommandClass;
import lu.snt.zwave.protocol.messages.app_command.MultilevelSensorCommandClass;
import lu.snt.zwave.protocol.messages.app_command.SensorBinaryCommandClass;
import lu.snt.zwave.protocol.messages.zw_common.ZW_ApplicationCommandHandler;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.text.SimpleDateFormat;
import java.util.*;

/**
 * Created by gnain on 05/10/15.
 */
public class ConvertForHighChartData extends RawFilesReader {

    private HashMap<String, SortedMap<Long, Double>> data = new HashMap<String, SortedMap<Long, Double>>();

    private PrintWriter pr;

    public ConvertForHighChartData(File folderFile) {
        super(folderFile);

    }

    @Override
    protected void processMessage(long timeStamp, ZWaveMessage m) {

        if (m instanceof MultilevelSensorCommandClass) {
            MultilevelSensorCommandClass almostGoodFrame = (MultilevelSensorCommandClass) m;
            SortedMap<Long, Double> records = data.get(almostGoodFrame.getSourceNode() + "_" + almostGoodFrame.getSensorType());
            if(records == null) {
                records = new TreeMap<Long, Double>();

                data.put(almostGoodFrame.getSourceNode() + "_" + almostGoodFrame.getSensorType(),records);
            }
            if (almostGoodFrame.getSensorType() == SensorType.TEMPERATURE) {
                double value;
                if (almostGoodFrame.getSensorType().units(almostGoodFrame.getScale() & 0xFF) == "F") {
                    value = ((almostGoodFrame.getValue() * almostGoodFrame.getPrecision()) - 32) * 5 / 9;
                } else {
                    value = almostGoodFrame.getValue() * almostGoodFrame.getPrecision();
                }
                records.put(timeStamp, value);
            } else if (almostGoodFrame.getSensorType() == SensorType.LUMINANCE || almostGoodFrame.getSensorType() == SensorType.RELATIVE_HUMIDITY) {
                records.put(timeStamp, almostGoodFrame.getValue() * almostGoodFrame.getPrecision());
            } else {
                System.err.println("Unknown SensorType: " + almostGoodFrame.getSensorType());
            }
        } else if(m instanceof SensorBinaryCommandClass){
            SensorBinaryCommandClass almostGoodFrame = (SensorBinaryCommandClass) m;
            //System.out.println("SensorType:" + almostGoodFrame.getSensorType());
            String key =  almostGoodFrame.getSourceNode() + "_" + (almostGoodFrame.getSensorType()!=null?almostGoodFrame.getSensorType():"MOTION");
            SortedMap<Long, Double> records = data.get(key);
            if(records == null) {
                records = new TreeMap<Long, Double>();
                data.put(key,records);
            }

            if(almostGoodFrame.isEventDetected()) {
                records.put(timeStamp, 0.0);
                records.put(timeStamp+1, 1.0);
            } else {
                records.put(timeStamp, 1.0);
                records.put(timeStamp+1, 0.0);
            }
        } else if(m instanceof BasicCommandClass){
            BasicCommandClass almostGoodFrame = (BasicCommandClass) m;
            SortedMap<Long, Double> records = data.get(almostGoodFrame.getSourceNode() + "_BASIC");
            if(records == null) {
                records = new TreeMap<Long, Double>();
                data.put(almostGoodFrame.getSourceNode() + "_BASIC",records);
            }
            if(almostGoodFrame.getValue() > 0) {
                records.put(timeStamp, 0.0);
                records.put(timeStamp+1, 1.0);
            } else {
                records.put(timeStamp, 1.0);
                records.put(timeStamp+1, 0.0);
            }

        } else {
            System.err.println("FrameType:" + m.getClass());
            System.err.println(m);
        }

    }

    @Override
    protected void allDone() {


       // SimpleDateFormat format = new SimpleDateFormat("dd/MM/yyy HH:mm:ss");
        try {
            File out = new File("./src/test/resources/out.js");
            pr = new PrintWriter(out);


        } catch (FileNotFoundException e) {
            e.printStackTrace();
        }

        for(String serie : data.keySet()) {
            pr.println("var _" + serie + " = [");
            SortedMap<Long, Double> records = data.get(serie);
            boolean isFirst = true;



            for(Map.Entry<Long, Double> entry : records.entrySet()) {
                if(!isFirst) {
                    pr.println(",");
                } else {
                    isFirst = false;
                }
                pr.print("["+entry.getKey()+","+entry.getValue()+"]");

            }
            pr.println("];");
            pr.println();
        }

        pr.flush();
        pr.close();


    }
}
