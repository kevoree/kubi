package org.kubi.zwave.spy;

import lu.snt.zwave.protocol.messages.ZWaveMessage;

import java.io.*;
import java.util.Date;

/**
 * Created by gnain on 09/04/15.
 */
public class FileParser {


    public static void main(String[] args) {
        File folderFile;
        if (args.length > 0) {
            folderFile = new File(args[0] + File.separator);
        } else {
            folderFile = new File("./");
        }
        System.out.println(folderFile.getAbsolutePath());
        for (File f : folderFile.listFiles((dir, name) -> name.endsWith(".csv"))) {
            try {

                BufferedReader reader = new BufferedReader(new FileReader(f));
                String line;
                while((line = reader.readLine()) != null) {
                    String[] infos = line.split(",");
                    String frame = infos[1].trim();
                    byte[] back = new byte[(frame.length() / 2)];
                    for (int i = 0; i+1 < frame.length(); i += 2) {
                        back[i/2] = (byte)Integer.parseInt(frame.substring(i, i + 2),16);
                    }
                    readMessage(Long.valueOf(infos[0]), ZWaveMessage.parseMessage(back));
                }

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
    }

    private static void readMessage(long timeStamp, ZWaveMessage m) {
        System.out.println(new Date(timeStamp) + " :: " + m);
    }

}
