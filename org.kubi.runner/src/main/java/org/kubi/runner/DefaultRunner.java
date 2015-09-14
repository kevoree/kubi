package org.kubi.runner;

import org.kevoree.log.Log;
import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kevoree.modeling.drivers.websocket.WebSocketPeer;
import org.kevoree.modeling.drivers.websocket.gateway.WebSocketGateway;
import org.kubi.kernel.KubiKernelImpl;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

/**
 * Created by gnain on 27/05/15.
 */
public class DefaultRunner {


    private static final String DB_NAME = "kubiDB";
    private static final String DB_FSM_NAME = "fsmDB";

    public static void main(String[] args) throws IOException {
        Log.TRACE();

        clearDB();

        Log.trace("Initiating LevelDB");
        LevelDbContentDeliveryDriver leveldb = new LevelDbContentDeliveryDriver(DB_NAME);

        Log.trace("Starting WSGateway");
        WebSocketGateway.expose(leveldb, 8082).start();

        leveldb.connect(throwable -> {
            if (throwable != null) {
                throwable.printStackTrace();
            }

            Log.trace("Creating Kernel");
            try {
                final KubiKernelImpl kernel = new KubiKernelImpl(new WebSocketPeer("ws://localhost:8082/cdn"));

                Log.trace("Kernel start");
                kernel.start();

                Runtime.getRuntime().addShutdownHook(new Thread( () ->  {
                    try {
                        kernel.stop();
                    } catch (InterruptedException e) {
                        e.printStackTrace();
                    }
                }));

            } catch (IOException e) {
                e.printStackTrace();
            }
        });
    }

    private static void startKeepUpThread() {
        Executors.newSingleThreadScheduledExecutor().scheduleAtFixedRate(new Runnable() {
            @Override
            public void run() {
            }
        }, 2000, 2000, TimeUnit.MILLISECONDS);
    }

    private static void clearDB() {
        Path directory = Paths.get(DB_NAME);
        try {
            if (Files.exists(directory)) {
                Files.walkFileTree(directory, new SimpleFileVisitor<Path>() {
                    @Override
                    public FileVisitResult visitFile(Path file, BasicFileAttributes attrs) throws IOException {
                        Files.delete(file);
                        return FileVisitResult.CONTINUE;
                    }

                    @Override
                    public FileVisitResult postVisitDirectory(Path dir, IOException exc) throws IOException {
                        Files.delete(dir);
                        return FileVisitResult.CONTINUE;
                    }
                });
            }
        } catch (IOException e) {
            e.printStackTrace();
        }
    }



}
