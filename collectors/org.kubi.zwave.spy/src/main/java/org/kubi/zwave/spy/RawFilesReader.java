package org.kubi.zwave.spy;

import lu.snt.zwave.protocol.messages.ZWaveMessage;

import java.io.*;

/**
 * Created by gnain on 05/10/15.
 */
public abstract class RawFilesReader {

    private File _folderFile;


    public RawFilesReader(File folderFile) {

        this._folderFile = folderFile;
        System.out.println(folderFile.getAbsolutePath());

    }

    public void parse() {
        File[] filteredFiles = _folderFile.listFiles((dir, name) -> name.endsWith(".csv"));
        for (File f : filteredFiles) {
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
                    processMessage(Long.valueOf(infos[0]), ZWaveMessage.parseMessage(back));
                }

            } catch (FileNotFoundException e) {
                e.printStackTrace();
            } catch (IOException e) {
                e.printStackTrace();
            }
        }
        allDone();
    }

    protected abstract void processMessage(long timeStamp, ZWaveMessage m);

    protected abstract void allDone();



}
