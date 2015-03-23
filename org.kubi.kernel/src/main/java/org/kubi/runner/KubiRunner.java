package org.kubi.runner;

import java.io.IOException;
import java.nio.file.*;
import java.nio.file.attribute.BasicFileAttributes;

public class KubiRunner {

    private static int PORT = 8080;

    private static final String DB_NAME = "kubiDB";

    public static void main(String[] args) throws IOException {
        clearDB();
        KubiKernel kernel = new KubiKernel(DB_NAME, PORT);
        kernel.start();
        Runtime.getRuntime().addShutdownHook(new Thread(new Runnable() {
            @Override
            public void run() {
                try {
                    kernel.stop();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                }
            }
        }));
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
