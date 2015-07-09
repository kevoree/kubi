package org.kubi.runner;

import org.kevoree.log.Log;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;
import java.util.concurrent.Executors;
import java.util.concurrent.TimeUnit;

public class KubiRunner {

    private static final String DB_NAME = "kubiDB";

    public static void main(String[] args) throws IOException {
        Log.DEBUG();
        clearDB();
        KubiKernelImpl kernel = new KubiKernelImpl(DB_NAME);
        startKeepUpThread();
        Runtime.getRuntime().addShutdownHook(new Thread() {
            @Override
            public void run() {
                Log.debug("Shutdown");
                try {
                    kernel.stop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        });

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
