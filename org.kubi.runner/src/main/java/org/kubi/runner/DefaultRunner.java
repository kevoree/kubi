package org.kubi.runner;

import org.kevoree.modeling.drivers.leveldb.LevelDbContentDeliveryDriver;
import org.kubi.kernel.KubiKernelImpl;
import org.kevoree.log.Log;

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
        Log.DEBUG();
        clearDB();
        LevelDbContentDeliveryDriver leveldb = new LevelDbContentDeliveryDriver(DB_NAME);
        KubiKernelImpl kernel = new KubiKernelImpl(leveldb);
        kernel.start();
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() {
                Log.debug("Shutdown");
                try {
                    kernel.stop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }));

        kernel.start();
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
