package org.kubi.zwave.spy;

import io.undertow.Handlers;
import io.undertow.Undertow;
import io.undertow.server.handlers.resource.ClassPathResourceManager;
import io.undertow.websockets.WebSocketConnectionCallback;
import io.undertow.websockets.core.*;
import io.undertow.websockets.spi.WebSocketHttpExchange;
import lu.snt.zwave.driver.*;
import org.kevoree.log.Log;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.io.PrintWriter;
import java.nio.ByteBuffer;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.concurrent.*;
import java.util.logging.Handler;

/**
 * Created by gnain on 09/04/15.
 */
public class Main implements ZWaveKeyDiscoveryListener {

    private ZWaveKey _zWaveKey;
    private File csv;
    private PrintWriter pr;
    private String _folder;
    private Semaphore prSem = new Semaphore(1);
    private Undertow undertow;
    private int WS_POST = 39432;
    private ArrayList<WebSocketChannel> channels = new ArrayList<>();

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


        undertow = Undertow.builder()
                .addHttpListener(WS_POST, "0.0.0.0")
                .setHandler(Handlers.path()
                        .addPrefixPath("/", Handlers.websocket(new WebSocketConnectionCallback() {

                            @Override
                            public void onConnect(WebSocketHttpExchange exchange, WebSocketChannel channel) {
                                channels.add(channel);
                                channel.getReceiveSetter().set(new AbstractReceiveListener() {

                                    @Override
                                    protected void onClose(WebSocketChannel webSocketChannel, StreamSourceFrameChannel channel) throws IOException {
                                        channels.remove(webSocketChannel);
                                    }

                                    @Override
                                    protected void onError(WebSocketChannel channel, Throwable error) {
                                        channels.remove(channel);
                                    }

                                });
                                channel.resumeReceives();
                            }

                        })))
                .build();

        undertow.start();

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

    private void forwardToWebSockets(final String msg) {
        ArrayList<WebSocketChannel> tmp = new ArrayList<>(channels);
        for(final WebSocketChannel chan : tmp) {
            WebSockets.sendText(msg, chan, null);
        }
    }

    public void zwaveKeyDiscovered(final ZWaveKey zWaveKey) {

        zWaveKey.registerRawFrameListener(new ZWaveFrameListener() {
            public void frameReceived(byte[] rawFrame) {
                try {

                    StringBuilder sb = new StringBuilder();
                    sb.append(System.currentTimeMillis());
                    sb.append(",");
                    for (byte b : rawFrame) {
                        sb.append(String.format("%02x", b));
                    }
                    String record = sb.toString();
                    prSem.acquire();
                    pr.println(record);
                    pr.flush();
                    prSem.release();
                    forwardToWebSockets(record);

                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });


        zWaveKey.connect();
    }
}
