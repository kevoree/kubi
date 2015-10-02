package org.kubi.zwave.spy;

import lu.snt.zwave.driver.*;
import org.kevoree.log.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.*;

/**
 * Created by gnain on 09/04/15.
 */
public class Main implements ZWaveKeyDiscoveryListener {

    private ZWaveKey _zWaveKey;
    private File csv;
    private PrintWriter pr;
    private String _folder;
    private Semaphore prSem = new Semaphore(1);

    private ScheduledExecutorService fileChecker = Executors.newSingleThreadScheduledExecutor();

    public static void main(String[] args) {
        //Log.TRACE();
        final Main m;
        System.out.println(Arrays.toString(args));
        if (args.length > 0) {
            m = new Main(args[0] + File.separator);
        } else {
            m = new Main("");
        }

        final ZWaveManager zwaveManager = new ZWaveManager();
        zwaveManager.addZWaveKeyDiscoveryListener(m);
        System.out.println("Start manager");
        zwaveManager.start();

        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            public void run() {
                if (m._zWaveKey != null) {
                    m._zWaveKey.disconnect();
                }
                zwaveManager.stop();

                if (m.pr != null) {
                    m.pr.close();
                }
            }
        }));

    }

    public Main(String folder) {
        this._folder = folder;

        fileChecker.scheduleAtFixedRate(new Runnable() {
            public void run() {
                renewFile();
            }
        }, 6, 6, TimeUnit.HOURS);

        renewFile();
    }

    private void renewFile() {
        try {
            prSem.acquire();

            if (pr != null) {
                pr.close();
            }

            csv = new File(_folder + "CSV_" + System.currentTimeMillis() + ".csv");
            pr = new PrintWriter(csv);
            prSem.release();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (InterruptedException e) {
            e.printStackTrace();
        }
    }

    public void zwaveKeyDiscovered(final ZWaveKey zWaveKey) {

        zWaveKey.registerRawFrameListener(new ZWaveFrameListener() {
            public void frameReceived(byte[] rawFrame) {
                try {

                    prSem.acquire();
                    pr.print(System.currentTimeMillis());
                    pr.print(",");
                    for (byte b : rawFrame) {
                        pr.print(String.format("%02x", b));
                    }
                    pr.println();
                    pr.flush();
                    prSem.release();

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });


        zWaveKey.connect();
    }
}
