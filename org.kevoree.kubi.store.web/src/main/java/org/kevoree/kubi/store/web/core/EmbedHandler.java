package org.kevoree.kubi.store.web.core;

import org.kevoree.kubi.store.web.cmp.StoreComponent;
import org.webbitserver.HttpControl;
import org.webbitserver.HttpRequest;
import org.webbitserver.HttpResponse;
import org.webbitserver.handler.AbstractResourceHandler;
import org.webbitserver.handler.TemplateEngine;

import java.io.IOException;
import java.io.InputStream;
import java.util.concurrent.Executor;
import java.util.concurrent.Executors;

public class EmbedHandler extends AbstractResourceHandler {

    private StoreComponent origin;
    private String baseFolder;

    public EmbedHandler(Executor ioThread, TemplateEngine templateEngine) {
        super(ioThread, templateEngine);
    }

    public EmbedHandler(Executor ioThread) {
        super(ioThread);
    }

    public EmbedHandler(StoreComponent origin, String baseFolder) {
        super(Executors.newFixedThreadPool(4));
        this.origin = origin;
        this.baseFolder = baseFolder;
    }


        @Override
    protected ResourceWorker createIOWorker(HttpRequest request,
                                        HttpResponse response,
                                        HttpControl control) {
        return new ResourceWorker(request, response, control);
    }

    protected class ResourceWorker extends IOWorker {

        private final HttpResponse response;

        private final HttpRequest request;

        protected ResourceWorker(HttpRequest request, HttpResponse response, HttpControl control) {
            super(request.uri(), request, response, control);
            this.response = response;
            this.request = request;
        }

        @Override
        protected boolean exists() throws IOException {
            String path2 = path;
            if(path2.equals("/")){
                path2 = "index.html";
            }
            if (path2.startsWith("/")) {
                path2 = path2.substring(1);
            }
            return origin.getClass().getClassLoader().getResource(baseFolder + "/" + path2) != null;
        }

        @Override
        protected boolean isDirectory() throws IOException {
            return false;
        }

        private byte[] read(InputStream content) throws IOException {
            try {
                return read(content.available(), content);
            } catch (NullPointerException happensWhenReadingDirectoryPathInJar) {
                return null;
            }
        }

        @Override
        protected byte[] fileBytes() throws IOException {
            String path2 = path;
            if(path2.equals("/")){
                path2 = "index.html";
            }
            if (path2.startsWith("/")) {
                path2 = path2.substring(1);
            }
            return read(origin.getClass().getClassLoader().getResourceAsStream(baseFolder + "/" + path2));
        }

        @Override
        protected byte[] welcomeBytes() throws IOException {
            read(origin.getClass().getClassLoader().getResourceAsStream(baseFolder + "/" + "index.html"));
            return null;
        }

        @Override
        protected byte[] directoryListingBytes() throws IOException {
            return null;
        }

    }
}