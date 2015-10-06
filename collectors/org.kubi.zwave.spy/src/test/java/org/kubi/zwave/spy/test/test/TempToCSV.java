package org.kubi.zwave.spy.test.test;

import lu.snt.zwave.protocol.messages.ZWaveMessage;
import org.kubi.zwave.spy.RawFilesReader;
import org.kubi.zwave.spy.TemperatureExtractor;

import java.io.File;
import java.util.Date;

/**
 * Created by gnain on 09/04/15.
 */
public class TempToCSV {

    //private static final String csvFolderPath = "./";
    private static final String csvFolderPath = "/Users/gnain/Sources/Kevoree/kubi/collectors/org.kubi.zwave.spy/src/test/resources";


    public static void main(String[] args) {
        File folderFile;
        if (args.length > 0) {
            folderFile = new File(args[0] + File.separator);
        } else {
            folderFile = new File(csvFolderPath);
        }

        RawFilesReader reader = new TemperatureExtractor(folderFile);
        reader.parse();
    }


}
